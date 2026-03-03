import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "farmer" | "auditor";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: AppRole | null;
  isAdmin: boolean;
  isAuditor: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    role: null,
    isAdmin: false,
    isAuditor: false,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        if (user) {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .single();
          
          const role = (roles?.role as AppRole) ?? "farmer";
          
          setAuthState({
            user,
            session,
            loading: false,
            role,
            isAdmin: role === "admin",
            isAuditor: role === "auditor",
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            role: null,
            isAdmin: false,
            isAuditor: false,
          });
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      if (user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        
        const role = (roles?.role as AppRole) ?? "farmer";
        
        setAuthState({
          user,
          session,
          loading: false,
          role,
          isAdmin: role === "admin",
          isAuditor: role === "auditor",
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  return {
    ...authState,
    signOut,
    signInWithEmail,
    signUpWithEmail,
  };
};
