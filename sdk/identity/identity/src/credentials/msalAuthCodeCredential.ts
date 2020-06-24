/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { AccessToken, TokenCredential, GetTokenOptions, delay } from "@azure/core-http";
import { TokenCredentialOptions, IdentityClient } from "../client/identityClient";

const { promises: fs } = require("fs");

import express from "express";
import msal from "azure-msal-node";

import myLocalCache from "./data/cache.json";
//import {} from "fs";

//import extensions from "azure-msal-extensions";

const SERVER_PORT = process.env.PORT || 80;

export class MsalAuthCodeCredential implements TokenCredential {
  private identityClient: IdentityClient;
  private pca: msal.PublicClientApplication;
  private msalCacheManager: msal.CacheManager;
  private tenantId: string;
  private clientId: string;

  constructor(tenandId: string, clientId: string, options?: TokenCredentialOptions) {
    this.identityClient = new IdentityClient(options);
    this.tenantId = tenandId;
    this.clientId = clientId;

    const readFromStorage = () => {
        return fs.readFile("./data/cache.json", "utf-8");
    };
    const writeToStorage = (getMergedState: any) => {
        return readFromStorage().then((oldFile: any) =>{
            const mergedState = getMergedState(oldFile);
            return fs.writeFile("./data/cacheAfterWrite.json", mergedState);
        })
    };
    const cachePlugin = {
        readFromStorage,
        writeToStorage
    };

    // this.cachePlugin = cachePlugin;

    const publicClientConfig = {
      auth: {
          clientId: this.clientId,
          authority: "https://login.microsoftonline.com/" + this.tenantId,
          redirectUri: "http://localhost",
      },
      cache: {
          cachePlugin
      },
    };
    this.pca = new msal.PublicClientApplication(publicClientConfig);
    this.msalCacheManager = this.pca.getCacheManager();
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
  async getToken(
    scopes: string | string[],
    options?: GetTokenOptions
  ): Promise<AccessToken | null> {
    let scopeArray = typeof scopes === "object" ? scopes : [scopes];

    // let scope = typeof scopes === "string" ? scopes : scopes[0];
    // const resource = scope.replace(/\/.default$/, "");
    
    // // Check to make sure the scope we get back is a valid scope
    // if (!scopeString.match(/^[0-9a-zA-Z-.:/]+$/)) {
    //   throw new Error("Invalid scope was specified by the user or calling client")
    // }

    // if (scopeArray.indexOf("offline_access") < 0) {
    //   scopeArray.push("offline_access");
    // }

    console.log(scopeArray);

    // Create Express App and Routes
    const app = express();
    var complete = false;
    var authResponse: any = undefined;

    // app.get('/', async(req, res) => {
    //   const authCodeUrlParameters = {
    //     scopes: scopeArray,
    //     redirectUri: "http://localhost",
    //   };

    //   // get url to sign user in and consent to scopes needed for application
    //   try {
    //     let response = await this.pca.getAuthCodeUrl(authCodeUrlParameters);    
    //     console.log(response);
    //     return res.redirect(response);
    //   } catch (error) {
    //     console.log(JSON.stringify(error));
    //   }
    // });
    const authCodeUrlParameters = {
      scopes: scopeArray,
      redirectUri: "http://localhost",
    };
    let response = await this.pca.getAuthCodeUrl(authCodeUrlParameters);    
    console.log(response);

    app.get('/', (req, res) => {
      console.log("Inside the redirect");
      const tokenRequest: msal.AuthorizationCodeRequest = {
        code: req.query.code as string,
        redirectUri: "http://localhost",
        scopes: scopeArray,
      };

      console.log("req: ", req);
      console.log("res: ", res);

      this.pca.acquireTokenByCode(tokenRequest).then((response: any) => {
        console.log("\nResponse: \n:", response);
        res.send(200);
        complete = true;
        authResponse = response;
        return this.msalCacheManager.writeToPersistence();
      }).catch((error: any) => {
        console.log(error);
        res.status(500).send(error);
      });
    });

    //await this.msalCacheManager.readFromPersistence();
    let listen = app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));

    while (complete == false) {
      //await delay(100);
    }

    console.log("authResponse:");
    console.log(authResponse);

    listen.close();

    return {expiresOnTimestamp: authResponse.expiresOnTimestamp, token: authResponse.accessToken};
  }
}
