/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as coreHttp from "@azure/core-http";


export const AclFailedEntry: coreHttp.CompositeMapper = {
  serializedName: "AclFailedEntry",
  type: {
    name: "Composite",
    className: "AclFailedEntry",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      type: {
        serializedName: "type",
        type: {
          name: "String"
        }
      },
      errorMessage: {
        serializedName: "errorMessage",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const SetAccessControlRecursiveResponse: coreHttp.CompositeMapper = {
  serializedName: "SetAccessControlRecursiveResponse",
  type: {
    name: "Composite",
    className: "SetAccessControlRecursiveResponse",
    modelProperties: {
      directoriesSuccessful: {
        serializedName: "directoriesSuccessful",
        type: {
          name: "Number"
        }
      },
      filesSuccessful: {
        serializedName: "filesSuccessful",
        type: {
          name: "Number"
        }
      },
      failureCount: {
        serializedName: "failureCount",
        type: {
          name: "Number"
        }
      },
      failedEntries: {
        serializedName: "failedEntries",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "AclFailedEntry"
            }
          }
        }
      }
    }
  }
};

export const Path: coreHttp.CompositeMapper = {
  serializedName: "Path",
  type: {
    name: "Composite",
    className: "Path",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      isDirectory: {
        serializedName: "isDirectory",
        defaultValue: false,
        type: {
          name: "Boolean"
        }
      },
      lastModified: {
        serializedName: "lastModified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "eTag",
        type: {
          name: "String"
        }
      },
      contentLength: {
        serializedName: "contentLength",
        type: {
          name: "Number"
        }
      },
      owner: {
        serializedName: "owner",
        type: {
          name: "String"
        }
      },
      group: {
        serializedName: "group",
        type: {
          name: "String"
        }
      },
      permissions: {
        serializedName: "permissions",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathList: coreHttp.CompositeMapper = {
  serializedName: "PathList",
  type: {
    name: "Composite",
    className: "PathList",
    modelProperties: {
      paths: {
        serializedName: "paths",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "Path"
            }
          }
        }
      }
    }
  }
};

export const FileSystem: coreHttp.CompositeMapper = {
  serializedName: "FileSystem",
  type: {
    name: "Composite",
    className: "FileSystem",
    modelProperties: {
      name: {
        serializedName: "name",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "lastModified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "eTag",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const FileSystemList: coreHttp.CompositeMapper = {
  serializedName: "FileSystemList",
  type: {
    name: "Composite",
    className: "FileSystemList",
    modelProperties: {
      filesystems: {
        serializedName: "filesystems",
        type: {
          name: "Sequence",
          element: {
            type: {
              name: "Composite",
              className: "FileSystem"
            }
          }
        }
      }
    }
  }
};

export const StorageErrorError: coreHttp.CompositeMapper = {
  serializedName: "StorageError_error",
  type: {
    name: "Composite",
    className: "StorageErrorError",
    modelProperties: {
      code: {
        serializedName: "Code",
        type: {
          name: "String"
        }
      },
      message: {
        serializedName: "Message",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const StorageError: coreHttp.CompositeMapper = {
  serializedName: "StorageError",
  type: {
    name: "Composite",
    className: "StorageError",
    modelProperties: {
      error: {
        serializedName: "error",
        type: {
          name: "Composite",
          className: "StorageErrorError"
        }
      }
    }
  }
};

export const ModifiedAccessConditions: coreHttp.CompositeMapper = {
  type: {
    name: "Composite",
    className: "ModifiedAccessConditions",
    modelProperties: {
      ifModifiedSince: {
        type: {
          name: "DateTimeRfc1123"
        }
      },
      ifUnmodifiedSince: {
        type: {
          name: "DateTimeRfc1123"
        }
      },
      ifMatch: {
        type: {
          name: "String"
        }
      },
      ifNoneMatch: {
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathHttpHeaders: coreHttp.CompositeMapper = {
  type: {
    name: "Composite",
    className: "PathHttpHeaders",
    modelProperties: {
      cacheControl: {
        type: {
          name: "String"
        }
      },
      contentEncoding: {
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        type: {
          name: "String"
        }
      },
      contentDisposition: {
        type: {
          name: "String"
        }
      },
      contentType: {
        type: {
          name: "String"
        }
      },
      contentMD5: {
        type: {
          name: "ByteArray"
        }
      },
      transactionalContentHash: {
        type: {
          name: "ByteArray"
        }
      }
    }
  }
};

export const LeaseAccessConditions: coreHttp.CompositeMapper = {
  type: {
    name: "Composite",
    className: "LeaseAccessConditions",
    modelProperties: {
      leaseId: {
        type: {
          name: "String"
        }
      }
    }
  }
};

export const SourceModifiedAccessConditions: coreHttp.CompositeMapper = {
  type: {
    name: "Composite",
    className: "SourceModifiedAccessConditions",
    modelProperties: {
      sourceIfMatch: {
        type: {
          name: "String"
        }
      },
      sourceIfNoneMatch: {
        type: {
          name: "String"
        }
      },
      sourceIfModifiedSince: {
        type: {
          name: "DateTimeRfc1123"
        }
      },
      sourceIfUnmodifiedSince: {
        type: {
          name: "DateTimeRfc1123"
        }
      }
    }
  }
};

export const ServiceListFileSystemsHeaders: coreHttp.CompositeMapper = {
  serializedName: "service-listfilesystems-headers",
  type: {
    name: "Composite",
    className: "ServiceListFileSystemsHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      continuation: {
        serializedName: "x-ms-continuation",
        type: {
          name: "String"
        }
      },
      contentType: {
        serializedName: "content-type",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const FileSystemCreateHeaders: coreHttp.CompositeMapper = {
  serializedName: "filesystem-create-headers",
  type: {
    name: "Composite",
    className: "FileSystemCreateHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      namespaceEnabled: {
        serializedName: "x-ms-namespace-enabled",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const FileSystemSetPropertiesHeaders: coreHttp.CompositeMapper = {
  serializedName: "filesystem-setproperties-headers",
  type: {
    name: "Composite",
    className: "FileSystemSetPropertiesHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const FileSystemGetPropertiesHeaders: coreHttp.CompositeMapper = {
  serializedName: "filesystem-getproperties-headers",
  type: {
    name: "Composite",
    className: "FileSystemGetPropertiesHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      properties: {
        serializedName: "x-ms-properties",
        type: {
          name: "String"
        }
      },
      namespaceEnabled: {
        serializedName: "x-ms-namespace-enabled",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const FileSystemDeleteHeaders: coreHttp.CompositeMapper = {
  serializedName: "filesystem-delete-headers",
  type: {
    name: "Composite",
    className: "FileSystemDeleteHeaders",
    modelProperties: {
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const FileSystemListPathsHeaders: coreHttp.CompositeMapper = {
  serializedName: "filesystem-listpaths-headers",
  type: {
    name: "Composite",
    className: "FileSystemListPathsHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      continuation: {
        serializedName: "x-ms-continuation",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathCreateHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-create-headers",
  type: {
    name: "Composite",
    className: "PathCreateHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      continuation: {
        serializedName: "x-ms-continuation",
        type: {
          name: "String"
        }
      },
      contentLength: {
        serializedName: "content-length",
        type: {
          name: "Number"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathUpdateHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-update-headers",
  type: {
    name: "Composite",
    className: "PathUpdateHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      acceptRanges: {
        serializedName: "accept-ranges",
        type: {
          name: "String"
        }
      },
      cacheControl: {
        serializedName: "cache-control",
        type: {
          name: "String"
        }
      },
      contentDisposition: {
        serializedName: "content-disposition",
        type: {
          name: "String"
        }
      },
      contentEncoding: {
        serializedName: "content-encoding",
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        serializedName: "content-language",
        type: {
          name: "String"
        }
      },
      contentLength: {
        serializedName: "content-length",
        type: {
          name: "Number"
        }
      },
      contentRange: {
        serializedName: "content-range",
        type: {
          name: "String"
        }
      },
      contentType: {
        serializedName: "content-type",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        type: {
          name: "String"
        }
      },
      properties: {
        serializedName: "x-ms-properties",
        type: {
          name: "String"
        }
      },
      xMsContinuation: {
        serializedName: "x-ms-continuation",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathLeaseHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-lease-headers",
  type: {
    name: "Composite",
    className: "PathLeaseHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      leaseId: {
        serializedName: "x-ms-lease-id",
        type: {
          name: "String"
        }
      },
      leaseTime: {
        serializedName: "x-ms-lease-time",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathReadHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-read-headers",
  type: {
    name: "Composite",
    className: "PathReadHeaders",
    modelProperties: {
      acceptRanges: {
        serializedName: "accept-ranges",
        type: {
          name: "String"
        }
      },
      cacheControl: {
        serializedName: "cache-control",
        type: {
          name: "String"
        }
      },
      contentDisposition: {
        serializedName: "content-disposition",
        type: {
          name: "String"
        }
      },
      contentEncoding: {
        serializedName: "content-encoding",
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        serializedName: "content-language",
        type: {
          name: "String"
        }
      },
      contentLength: {
        serializedName: "content-length",
        type: {
          name: "Number"
        }
      },
      contentRange: {
        serializedName: "content-range",
        type: {
          name: "String"
        }
      },
      contentType: {
        serializedName: "content-type",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      resourceType: {
        serializedName: "x-ms-resource-type",
        type: {
          name: "String"
        }
      },
      properties: {
        serializedName: "x-ms-properties",
        type: {
          name: "String"
        }
      },
      leaseDuration: {
        serializedName: "x-ms-lease-duration",
        type: {
          name: "String"
        }
      },
      leaseState: {
        serializedName: "x-ms-lease-state",
        type: {
          name: "String"
        }
      },
      leaseStatus: {
        serializedName: "x-ms-lease-status",
        type: {
          name: "String"
        }
      },
      xMsContentMd5: {
        serializedName: "x-ms-content-md5",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathGetPropertiesHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-getproperties-headers",
  type: {
    name: "Composite",
    className: "PathGetPropertiesHeaders",
    modelProperties: {
      acceptRanges: {
        serializedName: "accept-ranges",
        type: {
          name: "String"
        }
      },
      cacheControl: {
        serializedName: "cache-control",
        type: {
          name: "String"
        }
      },
      contentDisposition: {
        serializedName: "content-disposition",
        type: {
          name: "String"
        }
      },
      contentEncoding: {
        serializedName: "content-encoding",
        type: {
          name: "String"
        }
      },
      contentLanguage: {
        serializedName: "content-language",
        type: {
          name: "String"
        }
      },
      contentLength: {
        serializedName: "content-length",
        type: {
          name: "Number"
        }
      },
      contentRange: {
        serializedName: "content-range",
        type: {
          name: "String"
        }
      },
      contentType: {
        serializedName: "content-type",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      resourceType: {
        serializedName: "x-ms-resource-type",
        type: {
          name: "String"
        }
      },
      properties: {
        serializedName: "x-ms-properties",
        type: {
          name: "String"
        }
      },
      owner: {
        serializedName: "x-ms-owner",
        type: {
          name: "String"
        }
      },
      group: {
        serializedName: "x-ms-group",
        type: {
          name: "String"
        }
      },
      permissions: {
        serializedName: "x-ms-permissions",
        type: {
          name: "String"
        }
      },
      acl: {
        serializedName: "x-ms-acl",
        type: {
          name: "String"
        }
      },
      leaseDuration: {
        serializedName: "x-ms-lease-duration",
        type: {
          name: "String"
        }
      },
      leaseState: {
        serializedName: "x-ms-lease-state",
        type: {
          name: "String"
        }
      },
      leaseStatus: {
        serializedName: "x-ms-lease-status",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathDeleteHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-delete-headers",
  type: {
    name: "Composite",
    className: "PathDeleteHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      continuation: {
        serializedName: "x-ms-continuation",
        type: {
          name: "String"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathSetAccessControlHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-setaccesscontrol-headers",
  type: {
    name: "Composite",
    className: "PathSetAccessControlHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathSetAccessControlRecursiveHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-setaccesscontrolrecursive-headers",
  type: {
    name: "Composite",
    className: "PathSetAccessControlRecursiveHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      continuation: {
        serializedName: "x-ms-continuation",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathFlushDataHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-flushdata-headers",
  type: {
    name: "Composite",
    className: "PathFlushDataHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      contentLength: {
        serializedName: "content-length",
        type: {
          name: "Number"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      }
    }
  }
};

export const PathAppendDataHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-appenddata-headers",
  type: {
    name: "Composite",
    className: "PathAppendDataHeaders",
    modelProperties: {
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      contentMD5: {
        serializedName: "content-md5",
        type: {
          name: "ByteArray"
        }
      },
      xMsContentCrc64: {
        serializedName: "x-ms-content-crc64",
        type: {
          name: "ByteArray"
        }
      },
      isServerEncrypted: {
        serializedName: "x-ms-request-server-encrypted",
        type: {
          name: "Boolean"
        }
      }
    }
  }
};

export const PathSetExpiryHeaders: coreHttp.CompositeMapper = {
  serializedName: "path-setexpiry-headers",
  type: {
    name: "Composite",
    className: "PathSetExpiryHeaders",
    modelProperties: {
      etag: {
        serializedName: "etag",
        type: {
          name: "String"
        }
      },
      lastModified: {
        serializedName: "last-modified",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      clientRequestId: {
        serializedName: "x-ms-client-request-id",
        type: {
          name: "String"
        }
      },
      requestId: {
        serializedName: "x-ms-request-id",
        type: {
          name: "String"
        }
      },
      version: {
        serializedName: "x-ms-version",
        type: {
          name: "String"
        }
      },
      date: {
        serializedName: "date",
        type: {
          name: "DateTimeRfc1123"
        }
      },
      errorCode: {
        serializedName: "x-ms-error-code",
        type: {
          name: "String"
        }
      }
    }
  }
};
