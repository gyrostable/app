const ROLLBAR_CONFIG = {
  accessToken:
    // Only activate Rollbar in production
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_ROLLBAR_TOKEN
      : "",
  captureUncaught: false,
  captureUnhandledRejections: false,
  payload: {
    client: {
      javascript: {
        code_version: "1.0.0",
        source_map_enabled: true,
      },
    },
  },
};

export default ROLLBAR_CONFIG;
