"use client";

import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your account and preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Account</h2>
        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full border border-border object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-2xl font-bold text-muted">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div>
                <p className="font-medium text-lg">{user.name || "User"}</p>
                <p className="text-muted text-sm">{user.email}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted">You are currently using the app in local offline mode. Sign in to sync your tasks across devices.</p>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-accent/20"
            >
              Sign In
            </a>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted">The app currently uses a persistent dark theme.</p>
            </div>
            <div className="w-10 h-6 bg-accent rounded-full relative opacity-50 cursor-not-allowed">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
