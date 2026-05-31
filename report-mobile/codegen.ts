import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: 'http://localhost:8080/graphql', // TODO: remote hardcode
  ignoreNoDocuments: true,
  documents: ["src/**/*.{ts,tsx}", "!src/generated/**"],
  generates: {
    // generates schema.graphql from introspection url
    './src/generated/graphql/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true
      }
    },
    './src/generated/graphql/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    },
  },
};

export default config;
