"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";

import {
  isSupabaseConfigured,
  mapSupabaseUser,
  type AuthActionResult,
  type AuthUser,
} from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  hydrated: boolean;
  configured: boolean;
  user: AuthUser | null;
  login: (input: { email: string; password: string }) => Promise<AuthActionResult>;
  logout: () => Promise<AuthActionResult>;
  register: (input: {
    email: string;
    password: string;
    fullName: string;
  }) => Promise<AuthActionResult>;
  requestPasswordReset: (input: {
    email: string;
    redirectTo: string;
  }) => Promise<AuthActionResult>;
  updatePassword: (password: string) => Promise<AuthActionResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!hydrated || !configured) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    let active = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(mapSupabaseUser(data.user));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [configured, hydrated]);

  const value = useMemo<AuthContextValue>(
    () => ({
      hydrated,
      configured,
      user,
      login: async ({ email, password }) => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          return { error: "Supabase is not configured." };
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },
      register: async ({ email, password, fullName }) => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          return { error: "Supabase is not configured." };
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        return error ? { error: error.message } : {};
      },
      logout: async () => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          setUser(null);
          return {};
        }

        const { error } = await supabase.auth.signOut();
        return error ? { error: error.message } : {};
      },
      requestPasswordReset: async ({ email, redirectTo }) => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          return { error: "Supabase is not configured." };
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });

        return error ? { error: error.message } : {};
      },
      updatePassword: async (password) => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
          return { error: "Supabase is not configured." };
        }

        const { error } = await supabase.auth.updateUser({ password });
        return error ? { error: error.message } : {};
      },
    }),
    [configured, hydrated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
