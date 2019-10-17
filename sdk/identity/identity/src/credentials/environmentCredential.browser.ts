// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-unused-vars */

import { AccessToken, TokenCredential, GetTokenOptions } from "@azure/core-http";
import { IdentityClientOptions } from "../client/identityClient";
import { TokenRequestContext } from "@azure/core-auth";

const BrowserNotSupportedError = new Error(
  "EnvironmentCredential is not supported in the browser."
);

export class EnvironmentCredential implements TokenCredential {
  constructor(options?: IdentityClientOptions) {
    throw BrowserNotSupportedError;
  }

  getToken(
    requestContext: TokenRequestContext,
    options?: GetTokenOptions
  ): Promise<AccessToken | null> {
    throw BrowserNotSupportedError;
  }
}
