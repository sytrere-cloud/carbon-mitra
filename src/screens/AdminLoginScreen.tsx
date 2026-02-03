import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminLoginScreenProps {
  onSuccess: () => void;
}

const AdminLoginScreen = ({ onSuccess }: AdminLoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signInWithEmail } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await signInWithEmail(email, password);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soil/10 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-soil rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-soil">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">NamastuBharat Verification Dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="card-earth space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-soil">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@namastubharat.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:border-soil focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-soil">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-border bg-background focus:border-soil focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-soil transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-soil text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Sign In to Admin Portal
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          For authorized administrators only
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginScreen;
