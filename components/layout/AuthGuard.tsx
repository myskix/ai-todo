"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/Spinner";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated && (
        <div className="w-full bg-accent/10 border-b border-accent/20 px-4 py-2 flex items-center justify-between z-50">
          <p className="text-sm text-foreground">
            <span className="text-muted hidden sm:inline">Guest mode — </span>
            Login to sync your tasks across devices.
          </p>
          <Link
            href="/login"
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            Login →
          </Link>
        </div>
      )}
      {children}
    </>
  );
}
