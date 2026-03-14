type HttpMethod = "get" | "post";

type OpenApiPath = {
  [method in HttpMethod]?: {
    summary: string;
    tags?: string[];
    security?: Array<Record<string, string[]>>;
    requestBody?: {
      required: boolean;
      content: {
        "application/json"?: {
          schema: {
            $ref?: string;
            type?: string;
            format?: string;
            items?: unknown;
            properties?: Record<string, unknown>;
          };
        };
        "multipart/form-data"?: {
          schema: {
            $ref?: string;
            type?: string;
            format?: string;
            items?: unknown;
            properties?: Record<string, unknown>;
          };
        };
      };
    };
    parameters?: Array<{
      name: string;
      in: string;
      required: boolean;
      description?: string;
      schema: {
        type: string;
      };
    }>;
    responses: Record<
      string,
      {
        description: string;
        content?: {
          "application/json": {
            schema: unknown;
          };
        };
      }
    >;
  };
};

type OpenApiSpec = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
  }>;
  tags: Array<{
    name: string;
    description: string;
  }>;
  components: {
    securitySchemes?: Record<string, unknown>;
    schemas: Record<string, unknown>;
  };
  paths: Record<string, OpenApiPath>;
};

export const swaggerSpec: OpenApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "manga-novel-api",
    version: "1.0.0",
    description: "Backend API for Manga & Novel website, powered by Bun + Express",
  },
  servers: [
    {
      url: "http://localhost:3333",
    },
  ],
  tags: [
    {
      name: "System",
      description: "Health check endpoints",
    },
    {
      name: "Authentication",
      description: "User registration and login",
    },
    {
      name: "Users",
      description: "User profile and management",
    },
    {
      name: "OTruyen Proxy",
      description: "Proxy endpoints for OTruyen API data",
    },
    {
      name: "Documents",
      description: "Document upload and file viewing endpoints",
    },
    {
      name: "Comics Local",
      description: "Local storage for comics synced from OTruyen",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Bun Api is working",
          },
        },
      },
      RegisterBody: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            example: "Son",
          },
          email: {
            type: "string",
            format: "email",
            example: "son@example.com",
          },
          password: {
            type: "string",
            example: "123456",
          },
        },
      },
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "son@example.com",
          },
          password: {
            type: "string",
            example: "123456",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "67d3f1c6c0d6ce087a1d0001",
          },
          name: {
            type: "string",
            example: "Son",
          },
          email: {
            type: "string",
            format: "email",
            example: "son@example.com",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      UserWithPassword: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "67d3f1c6c0d6ce087a1d0001",
          },
          name: {
            type: "string",
            example: "Son",
          },
          email: {
            type: "string",
            format: "email",
            example: "son@example.com",
          },
          password: {
            type: "string",
            example: "$2b$10$hashed-password",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
        },
      },
      Document: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "67d3f1c6c0d6ce087a1d0100",
          },
          originalName: {
            type: "string",
            example: "course-outline.pdf",
          },
          fileName: {
            type: "string",
            example: "1741931000000-course-outline.pdf",
          },
          mimeType: {
            type: "string",
            example: "application/pdf",
          },
          size: {
            type: "number",
            example: 245760,
          },
          fileUrl: {
            type: "string",
            example: "/uploads/documents/1741931000000-course-outline.pdf",
          },
          viewUrl: {
            type: "string",
            example: "/api/documents/67d3f1c6c0d6ce087a1d0100/view",
          },
          uploadedBy: {
            type: "string",
            example: "67d3f1c6c0d6ce087a1d0001",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      DocumentList: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Document",
        },
      },
      UploadDocumentBody: {
        type: "object",
        properties: {
          files: {
            type: "array",
            items: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
      UploadDocumentChunkBody: {
        type: "object",
        properties: {
          file: {
            type: "string",
            format: "binary",
          },
          uploadId: {
            type: "string",
            example: "lesson-01-pdf",
          },
          originalName: {
            type: "string",
            example: "lesson-01.pdf",
          },
          mimeType: {
            type: "string",
            example: "application/pdf",
          },
          chunkIndex: {
            type: "number",
            example: 0,
          },
          totalChunks: {
            type: "number",
            example: 4,
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Invalid email or password",
          },
        },
      },
      UserList: {
        type: "array",
        items: {
          $ref: "#/components/schemas/User",
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "Health check",
        tags: ["System"],
        responses: {
          "200": {
            description: "Server is running",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterBody",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserWithPassword",
                },
              },
            },
          },
          "400": {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "409": {
            description: "Email already exists",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/login": {
      post: {
        summary: "Login and receive a JWT token",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginBody",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          "400": {
            description: "Missing required fields",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/users": {
      get: {
        summary: "Get users list",
        tags: ["Users"],
        responses: {
          "200": {
            description: "Users list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserList",
                },
              },
            },
          },
        },
      },
    },
    "/api/me": {
      get: {
        summary: "Get current authenticated user",
        tags: ["Users"],
        responses: {
          "200": {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    "/api/users/{id}": {
      get: {
        summary: "Get user by id",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB user id",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "User details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/otruyen/home": {
      get: {
        summary: "Get home page data (OTruyen Proxy)",
        tags: ["OTruyen Proxy"],
        responses: {
          "200": {
            description: "Successful operation",
          },
        },
      },
    },
    "/api/otruyen/danh-sach/{type}": {
      get: {
        summary: "Get list of comics by type (OTruyen Proxy)",
        tags: ["OTruyen Proxy"],
        parameters: [
          {
            name: "type",
            in: "path",
            required: true,
            description: "Type: truyen-moi, sap-ra-mat, dang-phat-hanh, hoan-thanh",
            schema: {
              type: "string",
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Successful operation",
          },
        },
      },
    },
    "/api/otruyen/truyen-tranh/{slug}": {
      get: {
        summary: "Get comic details (OTruyen Proxy)",
        tags: ["OTruyen Proxy"],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful operation",
          },
        },
      },
    },
    "/api/otruyen/tim-kiem": {
      get: {
        summary: "Search comics (OTruyen Proxy)",
        tags: ["OTruyen Proxy"],
        parameters: [
          {
            name: "keyword",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Successful operation",
          },
        },
      },
    },
    "/api/documents": {
      get: {
        summary: "Get uploaded documents list",
        tags: ["Documents"],
        responses: {
          "200": {
            description: "Uploaded documents",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DocumentList",
                },
              },
            },
          },
        },
      },
    },
    "/api/documents/upload": {
      post: {
        summary: "Upload one or many document files",
        tags: ["Documents"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UploadDocumentBody",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Uploaded documents metadata",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DocumentList",
                },
              },
            },
          },
          "400": {
            description: "Invalid upload request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/documents/upload/chunk": {
      post: {
        summary: "Upload document by chunks",
        tags: ["Documents"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UploadDocumentChunkBody",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Chunk received, upload still in progress",
          },
          "201": {
            description: "All chunks uploaded and document assembled",
          },
          "400": {
            description: "Invalid chunk upload request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/documents/{id}": {
      get: {
        summary: "Get document metadata by id",
        tags: ["Documents"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB document id",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Document metadata",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Document",
                },
              },
            },
          },
          "404": {
            description: "Document not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/documents/{id}/view": {
      get: {
        summary: "View document file by id",
        tags: ["Documents"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "MongoDB document id",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Document binary file",
          },
          "404": {
            description: "Document not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/comics": {
      get: {
        summary: "Get paginated local comics list",
        tags: ["Comics Local"],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Default: 1",
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Default: 20",
          },
          {
            name: "sort",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Default: -updatedAt",
          },
        ],
        responses: {
          "200": {
            description: "Successful operation",
          },
        },
      },
    },
    "/api/comics/sync": {
      post: {
        summary: "Sync latest comics page from OTruyen",
        tags: ["Comics Local"],
        responses: {
          "200": {
            description: "Synchronization results",
          },
        },
      },
    },
    "/api/comics/sync-all": {
      post: {
        summary: "Start full background synchronization",
        tags: ["Comics Local"],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer" },
            description: "Start page",
          },
        ],
        responses: {
          "202": {
            description: "Synchronization started in background",
          },
        },
      },
    },
    "/api/comics/sync-new": {
      post: {
        summary: "Start smart background synchronization (new comics only)",
        tags: ["Comics Local"],
        responses: {
          "202": {
            description: "Smart sync started in background",
          },
        },
      },
    },
    "/api/comics/{slug}": {
      get: {
        summary: "Get local comic details by slug",
        tags: ["Comics Local"],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful operation",
          },
          "404": {
            description: "Comic not found",
          },
        },
      },
    },
  },
};
