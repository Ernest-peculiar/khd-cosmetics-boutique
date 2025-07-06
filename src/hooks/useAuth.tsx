import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("SignIn attempt for:", email);

    // For admin - use a different approach: set the auth manually for mock admin
    if (
      email === "adminadmin123@gmail.com" &&
      password === "KesmondCosmetics123@"
    ) {
      console.log(
        "Admin login detected, creating mock session with proper auth context"
      );

      // Set the auth context manually for the mock admin
      // This creates a session that Supabase recognizes
      // try {
      //   await supabase.auth.admin.createUser({
      //     email: 'adminadmin123@gmail.com',
      //     password: 'temp-password',
      //     user_metadata: {
      //       first_name: 'Admin',
      //       last_name: 'User'
      //     },
      //     email_confirm: true
      //   });
      // } catch (e) {
      //   // User might already exist, that's okay
      //   console.log('Admin user might already exist:', e);
      // }

      // Now sign in with the admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "adminadmin123@gmail.com",
        password: "KesmondCosmetics123@",
      });

      if (error) {
        console.log("Admin sign in error:", error);
        // If normal sign in fails, create a mock session
        const mockUser = {
          id: "00000000-0000-0000-0000-000000000001",
          email: "adminadmin123@gmail.com",
          user_metadata: { first_name: "Admin", last_name: "User" },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: "authenticated",
        } as User;

        const mockSession = {
          access_token: "mock_admin_token",
          refresh_token: "mock_refresh_token",
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: "bearer",
          user: mockUser,
        } as Session;

        setUser(mockUser);
        setSession(mockSession);
        return { error: null };
      }

      console.log("Admin signed in successfully with real auth");
      return { error: null };
    }

    // Regular authentication for other users
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Regular sign in result:", { error: error?.message });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    console.log("SignOut called");
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
