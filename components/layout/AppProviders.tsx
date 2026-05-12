"use client";

import { useAuth } from "@/hooks/useAuth";
import { SyncManager } from "./SyncManager";
import { OfflineIndicator } from "../ui/OfflineIndicator";

/**
 * AppProviders bootstraps the authentication state and
 * manages global background tasks like data synchronization.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  // useAuth handles the Supabase auth listener internally
  useAuth();

  return (
    <>
      <SyncManager />
      <OfflineIndicator />
      {children}
    </>
  );
}
