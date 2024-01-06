declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RPC_USER: string
      RPC_PASSWORD: string
      CONNECTION_STRING: string
      PORT: number
      ENABLE_LOGGING: "true" | "false"
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
