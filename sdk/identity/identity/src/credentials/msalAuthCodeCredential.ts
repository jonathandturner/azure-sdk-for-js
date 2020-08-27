// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AccessToken, TokenCredential, GetTokenOptions, delay } from "@azure/core-http";
import { TokenCredentialOptions, IdentityClient } from "../client/identityClient";

const { promises: fs } = require("fs");

import express from "express";
import msal from "@azure/msal-node";
import open from "open";
import path from "path";
import http from "http";

import { Socket } from "net";

const SERVER_PORT = process.env.PORT || 80;
const cachePath = path.join(__dirname, "./cache.json");

interface AuthenticationRecord {
  authority?: string,
  homeAccountId: string,
  environment: string,
  tenantId: string,
  username: string,
}

export class MsalAuthCodeCredential implements TokenCredential {
  private identityClient: IdentityClient;
  private pca: msal.PublicClientApplication;
  private msalCacheManager: msal.TokenCache;
  private tenantId: string;
  private clientId: string;
  private persistenceEnabled: boolean;
  private authenticationRecord: AuthenticationRecord | undefined;

  constructor(
    tenandId: string,
    clientId: string,
    cacheOptions?: {
      cachePlugin?: {
        readFromStorage: () => Promise<string>;
        writeToStorage: (getMergedState: (oldState: string) => string) => Promise<void>;
      };
    },
    authenticationRecord?: AuthenticationRecord,
    options?: TokenCredentialOptions
  ) {
    this.identityClient = new IdentityClient(options);
    this.tenantId = tenandId;
    this.clientId = clientId;
    this.persistenceEnabled = cacheOptions !== undefined;
    this.authenticationRecord = authenticationRecord;

    const publicClientConfig = {
      auth: {
        clientId: this.clientId,
        authority: "https://login.microsoftonline.com/" + this.tenantId,
        redirectUri: "http://localhost"
      },
      cache: cacheOptions
    };
    this.pca = new msal.PublicClientApplication(publicClientConfig);
    this.msalCacheManager = this.pca.getTokenCache();
  }

  /**
   * Authenticates with Azure Active Directory and returns an access token if
   * successful.  If authentication cannot be performed at this time, this method may
   * return null.  If an error occurs during authentication, an {@link AuthenticationError}
   * containing failure details will be thrown.
   *
   * @param scopes The list of scopes for which the token will have access.
   * @param options The options used to configure any requests this
   *                TokenCredential implementation might make.
   */
  getToken(scopes: string | string[], options?: GetTokenOptions): Promise<AccessToken | null> {
    const scopeArray = typeof scopes === "object" ? scopes : [scopes];

    if (this.authenticationRecord && this.persistenceEnabled) {
      return this.acquireTokenFromCache();
    } else {
      return this.acquireTokenFromBrowser(scopeArray);
    }
  }

  private async acquireTokenFromCache(): Promise<AccessToken | null> {
    await this.msalCacheManager.readFromPersistence();
    const contents = this.msalCacheManager.serialize();
    console.log(JSON.parse(contents));
    
    const accounts = this.msalCacheManager.getAllAccounts();
    console.log("Accounts: ", accounts);

    const silentRequest = {
      account: this.authenticationRecord!,
      scopes: ['https://vault.azure.net/user_impersonation', 'https://vault.azure.net/.default'],
    };

    console.log("silent request: ", silentRequest);

    const response = await this.pca.acquireTokenSilent(silentRequest);
    
    console.log("\nSuccessful silent token acquisition:\nResponse: \n:", response);
    return {
      expiresOnTimestamp: response.expiresOn.getTime(),
      token: response.accessToken
    };    
  }

  private async openAuthCodeUrl(scopeArray: string[]): Promise<void> {
    const authCodeUrlParameters = {
      scopes: scopeArray,
      redirectUri: "http://localhost"
    };

    const response = await this.pca.getAuthCodeUrl(authCodeUrlParameters);
    await open(response);
    if (this.persistenceEnabled) {
      try {
        await this.msalCacheManager.readFromPersistence();
        console.log("Result: ", this.msalCacheManager.serialize());
      } catch(e) {
        console.log("Cache could not be read");
        throw e;
      }
    }
  }

  private async acquireTokenFromBrowser(scopeArray: string[]): Promise<AccessToken | null> {
    
    return new Promise<AccessToken | null>(async (resolve, reject) => {
      let listen: http.Server | undefined;
      let socketToDestroy: Socket | undefined;

      function cleanup() {
        if (listen) {
          listen.close();
        }
        if (socketToDestroy) {
          socketToDestroy.destroy();
        }
      }

      // Create Express App and Routes
      const app = express();

      app.get("/", async (req, res) => {
        const tokenRequest: msal.AuthorizationCodeRequest = {
          code: req.query.code as string,
          redirectUri: "http://localhost",
          scopes: scopeArray
        };

        try {
          const authResponse = await this.pca.acquireTokenByCode(tokenRequest);
          res.sendStatus(200);
          console.log("authResponse: ", authResponse);
          if (this.persistenceEnabled) {
            this.msalCacheManager.writeToPersistence();
          }
          
          resolve({
            expiresOnTimestamp: authResponse.expiresOn.valueOf(),
            token: authResponse.accessToken
          });
        } catch (error) {
          res.status(500).send(error);

          reject(
            new Error(
              `Authentication Error "${req.query["error"]}":\n\n${req.query["error_description"]}`
            )
          );
        } finally {
          cleanup();
        }
      });

      listen = app.listen(SERVER_PORT, () =>
        console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`)
      );
      listen.on("connection", (socket) => (socketToDestroy = socket));

      try {
        await this.openAuthCodeUrl(scopeArray);
      } catch(e) {
        cleanup();
        throw e;
      }
    });
  }
}

async function createPersistence(): Promise<
  | {
      cachePlugin?: {
        readFromStorage: () => Promise<string>;
        writeToStorage: (getMergedState: (oldState: string) => string) => Promise<void>;
      };
    }
  | undefined
> {
  let extensions: any;
  try {
    extensions = require("@azure/msal-node-extension");
  } catch (er) {
    return undefined;
  }

  // On Windows, uses a DPAPI encrypted file
  if (process.platform === "win32") {
    return extensions.FilePersistenceWithDataProtection.create(
      cachePath,
      extensions.DataProtectionScope.LocalMachine
    );
  }

  // On Mac, uses keychain.
  if (process.platform === "darwin") {
    return extensions.KeychainPersistence.create(cachePath, "serviceName", "accountName");
  }

  // On Linux, uses  libsecret to store to secret service. Libsecret has to be installed.
  if (process.platform === "linux") {
    return extensions.LibSecretPersistence.create(cachePath, "serviceName", "accountName");
  }

  // fall back to using plain text file. Not recommended for storing secrets.
  return extensions.FilePersistence.create(cachePath);
}
