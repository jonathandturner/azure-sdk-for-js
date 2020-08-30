// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AccessToken, TokenCredential, GetTokenOptions, delay } from "@azure/core-http";
import { TokenCredentialOptions, IdentityClient } from "../client/identityClient";

const { promises: fs } = require("fs");

import msal from "@azure/msal-node";

export class MsalDeviceCodeCredential implements TokenCredential {
  private identityClient: IdentityClient;
  private pca: msal.PublicClientApplication;
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

    const publicClientConfig = {
      auth: {
          clientId: this.clientId,
          authority: "https://login.microsoftonline.com/" + this.tenantId,
      },
      cache: {
          cachePlugin
      },
    };

    this.pca = new msal.PublicClientApplication(publicClientConfig);
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
  getToken(
    scopes: string | string[],
    options?: GetTokenOptions
  ): Promise<AccessToken | null> {
    const scopeArray = typeof scopes === "object" ? scopes : [scopes];

    const deviceCodeRequest = {
      deviceCodeCallback: (response: any) => (console.log(response.message)),
      scopes: scopeArray,
    };

    return this.acquireTokenByDeviceCode(deviceCodeRequest);
  }

  private async acquireTokenByDeviceCode(deviceCodeRequest: msal.DeviceCodeRequest): Promise<AccessToken | null> {
    try {
      const deviceResponse = await this.pca.acquireTokenByDeviceCode(deviceCodeRequest);
      return({
        expiresOnTimestamp: deviceResponse.expiresOn.getTime(),
        token: deviceResponse.accessToken
      });
    } catch (error) {
      throw new Error(`Device Authentication Error "${JSON.stringify(error)}"`);
    }
  }
}
