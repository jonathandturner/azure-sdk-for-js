// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-unused-vars */

import { TokenCredential, GetTokenOptions, AccessToken } from "@azure/core-http";
import { IdentityClientOptions } from "../client/identityClient";
import { TokenRequestContext } from "@azure/core-auth";

const BrowserNotSupportedError = new Error("DeviceCodeCredential is not supported in the browser.");

export class DeviceCodeCredential implements TokenCredential {
  constructor(
    tenantId: string,
    clientId: string,
    userPromptCallback: (details: any) => void,
    options?: IdentityClientOptions
  ) {
    throw BrowserNotSupportedError;
  }

  public getToken(
    requestContext: TokenRequestContext,
    options?: GetTokenOptions
  ): Promise<AccessToken | null> {
    throw BrowserNotSupportedError;
  }
}
