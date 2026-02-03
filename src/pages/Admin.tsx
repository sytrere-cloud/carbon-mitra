import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLoginScreen from "@/screens/AdminLoginScreen";
import AdminDashboard from "@/screens/AdminDashboard";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-soil" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLoginScreen onSuccess={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
};

export default Admin;
