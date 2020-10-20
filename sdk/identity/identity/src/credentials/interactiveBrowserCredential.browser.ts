// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as msal from "@azure/msal-browser";
import { AccessToken, TokenCredential, GetTokenOptions } from "@azure/core-http";
import { IdentityClient } from "../client/identityClient";
import { AuthenticationRecord } from "../client/msalClient";
import {
  BrowserLoginStyle,
  InteractiveBrowserCredentialOptions
} from "./interactiveBrowserCredentialOptions";
import { createSpan } from "../util/tracing";
import { CanonicalCode } from "@opentelemetry/api";
import { DefaultTenantId, DeveloperSignOnClientId } from "../constants";
import { credentialLogger, formatSuccess, formatError } from "../util/logging";

const logger = credentialLogger("InteractiveBrowserCredential");

/**
 * Enables authentication to Azure Active Directory inside of the web browser
 * using the interactive login flow, either via browser redirects or a popup
 * window.
 */
export class InteractiveBrowserCredential implements TokenCredential {
  private loginStyle: BrowserLoginStyle;
  private msalConfig: msal.Configuration;
  private msalObject: msal.PublicClientApplication;
  private redirectUri: string;
  private authenticationRecord: AuthenticationRecord | undefined;

  /**
   * Creates an instance of the InteractiveBrowserCredential with the
   * details needed to authenticate against Azure Active Directory with
   * a user identity.
   *
   * @param tenantId The Azure Active Directory tenant (directory) ID.
   * @param clientId The client (application) ID of an App Registration in the tenant.
   * @param options Options for configuring the client which makes the authentication request.
   */
  constructor(options?: InteractiveBrowserCredentialOptions) {
    options = {
      ...IdentityClient.getDefaultOptions(),
      ...options,
      tenantId: (options && options.tenantId) || DefaultTenantId,
      // TODO: temporary - this is the Azure CLI clientID - we'll replace it when
      // Developer Sign On application is available
      // https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/identity/Azure.Identity/src/Constants.cs#L9
      clientId: (options && options.clientId) || DeveloperSignOnClientId
    };

    this.loginStyle = options.loginStyle || "popup";
    if (["redirect", "popup"].indexOf(this.loginStyle) === -1) {
      const error = new Error(`Invalid loginStyle: ${options.loginStyle}`);
      logger.info(formatError(error));
      throw error;
    }

    if (options && options.redirectUri) {
      if (typeof options.redirectUri === "string") {
        this.redirectUri = options.redirectUri;
      } else {
        this.redirectUri = options.redirectUri();
      }
    } else {
      this.redirectUri = "http://localhost";
    }

    if (options && options.postLogoutRedirectUri) {
      if (typeof options.postLogoutRedirectUri === "string") {
        this.redirectUri = options.postLogoutRedirectUri;
      } else {
        this.redirectUri = options.postLogoutRedirectUri();
      }
    }

    // this.authenticationRecord = options?.authenticationRecord;

    this.msalConfig = {
      auth: {
        clientId: options.clientId!, // we just initialized it above
        authority: `${options.authorityHost}/${options.tenantId}`,
        redirectUri: this.redirectUri,
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
      }
    };

    this.msalObject = new msal.PublicClientApplication(this.msalConfig);
  }

  private login(): Promise<msal.AuthenticationResult | null> {
    switch (this.loginStyle) {
      case "redirect": {
        const loginPromise = this.msalObject.handleRedirectPromise();
        this.msalObject.loginRedirect();
        return loginPromise;
      }
      case "popup":
        return this.msalObject.loginPopup();
    }
  }

  private async acquireTokenSilent(
    authParams: msal.SilentRequest
  ): Promise<msal.AuthenticationResult | undefined> {
    let authResponse: msal.AuthenticationResult | undefined;
    try {
      logger.info("Attempting to acquire token silently");
      authResponse = await this.msalObject.acquireTokenSilent(authParams);
    } catch (err) {
      if (err instanceof msal.AuthError) {
        switch (err.errorCode) {
          case "consent_required":
          case "interaction_required":
          case "login_required":
            logger.info(`Authentication returned errorCode ${err.errorCode}`);
            break;
          default:
            logger.info(formatError(`Failed to acquire token: ${err.message}`));
            throw err;
        }
      }
    }

    let authPromise: Promise<msal.AuthenticationResult | null>;
    if (authResponse === undefined) {
      logger.info(
        `Silent authentication failed, falling back to interactive method ${this.loginStyle}`
      );
      switch (this.loginStyle) {
        case "redirect":
          authPromise = this.msalObject.handleRedirectPromise();
          this.msalObject.acquireTokenRedirect(authParams);
          break;
        case "popup":
          authPromise = this.msalObject.acquireTokenPopup(authParams);
          break;
      }

      const result = authPromise && (await authPromise);
      authResponse = result ? result : undefined;
    }

    return authResponse;
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
    const { span } = createSpan("InteractiveBrowserCredential-getToken", options);
    try {
      let currentAccounts = this.msalObject.getAllAccounts();

      if (currentAccounts.length == 0) {
        await this.login();
      }

      currentAccounts = this.msalObject.getAllAccounts();
      let accountObj;

      if (!currentAccounts || currentAccounts.length === 0) {
          // No user signed in
          return null;
      } else if (currentAccounts.length > 1) {
          // More than one user signed in, find desired user with getAccountByUsername(username)
          if (this.authenticationRecord) {
            accountObj = this.msalObject.getAccountByUsername(this.authenticationRecord.username);
          } else {
            return null;
          }
      } else {
          accountObj = currentAccounts[0];
      }
      
      const authResponse = await this.acquireTokenSilent({
        scopes: Array.isArray(scopes) ? scopes : scopes.split(","),
        account: accountObj!
      });

      if (authResponse) {
        logger.getToken.info(formatSuccess(scopes));
        return {
          token: authResponse.accessToken,
          expiresOnTimestamp: authResponse.expiresOn.getTime()
        };
      } else {
        logger.getToken.info("No response");
        return null;
      }
    } catch (err) {
      span.setStatus({
        code: CanonicalCode.UNKNOWN,
        message: err.message
      });
      logger.getToken.info(formatError(err));
      throw err;
    } finally {
      span.end();
    }
  }
}
