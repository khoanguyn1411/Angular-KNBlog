// Define the type of the environment variables.
declare interface Env {
  readonly NODE_ENV: string;
  // Replace the following with your own environment variables.
  // Example: NGX_VERSION: string;
  readonly NG_APP_ENV: string;
  readonly NG_APP_VERSION: string;
  readonly NG_APP_COMMIT: string;
  readonly NG_APP_API_URL: string;

  readonly NG_APP_GOOGLE_CLIENT_ID: string;
}

// Choose how to access the environment variables.
// Remove the unused options.

// 1. Use import.meta.env.YOUR_ENV_VAR in your code. (conventional)
declare interface ImportMeta {
  readonly env: Env;
}

