import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuditorLoginScreen from "@/screens/AuditorLoginScreen";
import AuditorDashboard from "@/screens/AuditorDashboard";
import { Loader2 } from "lucide-react";

const Auditor = () => {
  const { user, loading, isAuditor, isAdmin } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Admins can also access auditor portal
    if (user && (isAuditor || isAdmin)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user, isAuditor, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuditorLoginScreen onSuccess={() => setIsLoggedIn(true)} />;
  }

  return <AuditorDashboard onLogout={() => setIsLoggedIn(false)} />;
};

export default Auditor;
