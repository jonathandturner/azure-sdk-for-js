/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { AccessToken, TokenCredential, GetTokenOptions, delay } from "@azure/core-http";
import { TokenCredentialOptions, IdentityClient } from "../client/identityClient";

const { promises: fs } = require("fs");

import express from "express";
import msal from "@azure/msal-node";

export class MsalDeviceCodeCredential implements TokenCredential {
  private identityClient: IdentityClient;
  private pca: msal.PublicClientApplication;
  //private msalCacheManager: msal.CacheManager;
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
      },
      cache: {
          cachePlugin
      },
    };
// const msalConfig = {
//     auth: {
//         clientId: "6c04f413-f6e7-4690-b372-dbdd083e7e5a",
//         authority: "https://login.microsoftonline.com/sgonz.onmicrosoft.com",
//     }
// };

    this.pca = new msal.PublicClientApplication(publicClientConfig);
    //this.msalCacheManager = this.pca.getCacheManager();
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
    let scopeArray = typeof scopes === "object" ? scopes : [scopes];

    // Create Express App and Routes
    const app = express();
    var complete = false;
    var authResponse: any = undefined;

    let self = this;

    const deviceCodeRequest = {
      deviceCodeCallback: (response: any) => (console.log(response.message)),
      scopes: scopeArray,
    };

    return new Promise(function(resolve, reject) {
      let p = self.pca.acquireTokenByDeviceCode(deviceCodeRequest).then((stringResponse: any) => {
        let deviceResponse = JSON.parse(stringResponse);
        resolve({expiresOnTimestamp: deviceResponse.expiresOnTimestamp, token: deviceResponse.access_token});
      }).catch((error) => {
        reject(new Error(`Device Authentication Error "${JSON.stringify(error)}"`));
      });

      //await this.msalCacheManager.readFromPersistence();
      /*.then(self.msalCacheManager.writeToPersistence)*/
    });
  }
}
