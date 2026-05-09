"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, signOut: storeSignOut } =
    useAuthStore();

  const supabase = createClient();

  // Bootstrap session on mount & listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /** Sign in with Google (OAuth redirect flow) */
  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  }, []);

  /** Sign in with email magic link */
  const loginWithEmail = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  }, []);

  /** Sign out */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    storeSignOut();
  }, []);

  // Kept for backward compatibility with existing code that uses these names
  const getUser = useCallback(() => user, [user]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isLoggedIn: isAuthenticated,
    getUser,
    loginWithGoogle,
    loginWithEmail,
    logout,
    // Aliases used by legacy code
    signInWithEmail: loginWithEmail,
    signOut: logout,
  };
}
