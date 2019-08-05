// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { BaseRequestPolicy, RequestPolicy, RequestPolicyOptions, RequestPolicyFactory } from "@azure/core-http";
import { HttpOperationResponse } from "@azure/core-http";
import { WebResource } from "@azure/core-http";

/**
 * Creates a new TracingPolicy factory.
 *
 * @param credential The TokenCredential implementation that can supply the challenge token.
 */
export function tracingPolicy(): RequestPolicyFactory {
  return {
    create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
      return new TracingPolicy(nextPolicy, options);
    }
  };
}

/**
 * Adds the tracing policy to the header
 */
export class TracingPolicy extends BaseRequestPolicy {
  /**
   * Creates a new TracingPolicy object.
   *
   * @param nextPolicy The next RequestPolicy in the request pipeline.
   * @param options Options for this RequestPolicy.
   * @param credential The TokenCredential implementation that can supply the bearer token.
   * @param scopes The scopes for which the bearer token applies.
   */
  constructor(
    nextPolicy: RequestPolicy,
    options: RequestPolicyOptions,
  ) {
    super(nextPolicy, options);
  }

  /**
   * Applies the Bearer token to the request through the Authorization header.
   * @param webResource
   */
  public async sendRequest(
    request: WebResource
  ): Promise<HttpOperationResponse> {
    if (request.spanOptions) {
      console.log("tracing policy:", request.spanOptions);
      request.headers.set("traceparent", request.spanOptions.parent._span );
    }
    return this._nextPolicy.sendRequest(request);
  }
}
