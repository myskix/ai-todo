"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSync } from "@/hooks/useSync";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function SyncManager() {
  const { isAuthenticated, user } = useAuthStore();
  const { syncOnLogin, isSyncing } = useSync();
  const isOnline = useOnlineStatus();
  
  // Track previous states to trigger sync only on changes
  const prevAuthRef = useRef(false);
  const prevOnlineRef = useRef(true);
  const initialSyncDone = useRef(false);

  // 1. Sync on Login or Initial Session Load
  useEffect(() => {
    if (isAuthenticated && !prevAuthRef.current) {
      console.log("[SyncManager] User logged in, triggering sync...");
      syncOnLogin();
      initialSyncDone.current = true;
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, syncOnLogin]);

  // 2. Sync when coming back Online
  useEffect(() => {
    if (isOnline && !prevOnlineRef.current && isAuthenticated) {
      console.log("[SyncManager] Back online, triggering sync...");
      syncOnLogin();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, isAuthenticated, syncOnLogin]);

  // 3. Periodic Sync (every 5 minutes) if online and authenticated
  useEffect(() => {
    if (!isAuthenticated || !isOnline) return;

    const interval = setInterval(() => {
      console.log("[SyncManager] Periodic sync...");
      syncOnLogin();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isOnline, syncOnLogin]);

  // This component doesn't render anything visible
  return null;
}
