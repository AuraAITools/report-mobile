import type { CodegenConfig } from "@graphql-codegen/cli";

// Schema source priority:
//   GRAPHQL_SCHEMA=remote → pull the live schema from the backend and refresh
//     the local snapshot at src/generated/graphql/schema.graphql.
//   default → read from the local snapshot so codegen runs without the backend.
const useRemoteSchema = process.env.GRAPHQL_SCHEMA === "remote";

const config: CodegenConfig = {
  schema: useRemoteSchema
    ? "http://localhost:8080/graphql"
    : "./src/generated/graphql/schema.graphql",
  ignoreNoDocuments: true,
  documents: ["src/**/*.{ts,tsx}", "!src/generated/**"],
  generates: {
    ...(useRemoteSchema
      ? {
          "./src/generated/graphql/schema.graphql": {
            plugins: ["schema-ast"],
            config: {
              includeDirectives: true,
            },
          },
        }
      : {}),
    "./src/generated/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
  },
};

export default config;
