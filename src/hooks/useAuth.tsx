import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { logLogin } from "@/lib/auditLog";

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  dni: string;
  section: string | null;
  allowed_sections: string[];
  allowed_pages: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: string[];
  profile: ProfileData | null;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canAccessPage: (page: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAIL = "calbertutm@gmail.com";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const fetchUserData = async (userId: string) => {
    const [rolesRes, profileRes] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("profiles").select("full_name, email, phone, dni, section, allowed_sections, allowed_pages").eq("id", userId).single(),
    ]);
    if (rolesRes.data) setRoles(rolesRes.data.map((r: any) => r.role));
    if (profileRes.data) {
      const p = profileRes.data as any;
      setProfile({
        full_name: p.full_name,
        email: p.email,
        phone: p.phone || "",
        dni: p.dni || "",
        section: p.section,
        allowed_sections: p.allowed_sections || [],
        allowed_pages: p.allowed_pages || [],
      });
    }
  };

  useEffect(() => {
    let loginLogged = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchUserData(session.user.id), 0);
        if (_event === "SIGNED_IN" && !loginLogged) {
          loginLogged = true;
          setTimeout(() => logLogin(), 500);
        }
      } else {
        setRoles([]);
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
    setProfile(null);
  };

  const hasRole = (role: string) => roles.includes(role);
  const isSuperAdmin = hasRole("super_admin");
  const isAdmin = isSuperAdmin || hasRole("admin");

  const canAccessPage = (page: string) => {
    if (isAdmin) return true;
    if (!profile?.allowed_pages || profile.allowed_pages.length === 0) return false;
    return profile.allowed_pages.includes(page);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, roles, profile, signOut, hasRole, isAdmin, isSuperAdmin, canAccessPage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
