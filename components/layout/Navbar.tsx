"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <span className="md:hidden text-base font-bold text-foreground">
          ✦ <span className="text-accent">AI</span> Todo
        </span>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="flex items-center gap-2">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name ?? user.email}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block text-sm text-muted">
                {user.name ?? user.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
