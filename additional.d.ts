import type { Environment } from "monaco-editor/esm/vs/editor/editor.api";
import NextAuth from "next-auth"

declare global {
  interface Window {
    MonacoEnvironment: Environment;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string
    userId: string
  }
}