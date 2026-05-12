"use client";

import { type ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/layout/AuthGuard";

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/calendar", label: "Calendar", Icon: CalendarIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [isBannerDismissed, setIsBannerDismissed] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("syncBannerDismissed") === "true";
    setIsBannerDismissed(dismissed);
  }, []);

  const handleDismissBanner = () => {
    sessionStorage.setItem("syncBannerDismissed", "true");
    setIsBannerDismissed(true);
  };

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border">
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              width={24} 
              height={24} 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">Kynda Do</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2">
            {isAuthenticated && user?.avatar ? (
              <Image src={user.avatar} alt="Avatar" width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-sm font-bold text-muted">
                {isAuthenticated && user ? (user.name || user.email || "?").charAt(0).toUpperCase() : "G"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {isAuthenticated && user ? user.name || "User" : "Guest"}
              </p>
              <p className="text-xs text-muted truncate">
                {isAuthenticated && user ? user.email : "Local mode"}
              </p>
            </div>
          </div>
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="w-full mt-2 py-2 text-xs font-medium text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="block text-center w-full mt-2 py-2 text-xs font-medium text-accent hover:text-white transition-colors rounded-lg hover:bg-accent/20"
            >
              Sign in to sync
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <AuthGuard>
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
                <Image 
                  src="/logo.svg" 
                  alt="Logo" 
                  width={28} 
                  height={28} 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold tracking-tight">Kynda Do</span>
            </div>
            {isAuthenticated ? (
              <button onClick={logout} className="text-xs font-medium text-muted hover:text-foreground">Log out</button>
            ) : (
              <Link href="/login" className="text-xs font-medium text-accent">Sign in</Link>
            )}
          </header>

          {!isAuthenticated && !isBannerDismissed && (
            <div className="bg-accent/10 border-b border-accent/20 px-4 py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <span>💾</span>
                <span className="text-xs sm:text-sm">Tasks saved locally. Login to sync.</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-accent font-medium hover:underline whitespace-nowrap text-xs sm:text-sm">
                  Login
                </Link>
                <button onClick={handleDismissBanner} className="text-muted hover:text-foreground">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-32 md:pb-8 scroll-smooth">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border z-40 pb-safe">
            <div className="flex items-center justify-around p-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors ${
                      isActive ? "text-accent" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <item.Icon />
                    <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </AuthGuard>
      </div>
    </div>
  );
}
