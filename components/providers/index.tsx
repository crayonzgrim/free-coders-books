"use client";

// NOTE: SessionProvider commented out - login functionality disabled
// import { SessionProvider } from "./session-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
