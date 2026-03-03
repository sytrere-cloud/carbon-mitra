import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuditorLoginScreenProps {
  onSuccess: () => void;
}

const AuditorLoginScreen = ({ onSuccess }: AuditorLoginScreenProps) => {
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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
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
            className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <ClipboardCheck className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">Auditor Portal</h1>
          <p className="text-muted-foreground mt-2">Carbon Credit Verification System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="card-earth space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="auditor@acva.org"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ClipboardCheck className="w-5 h-5" />
                Sign In to Auditor Portal
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          For accredited carbon verification auditors only
        </p>
      </motion.div>
    </div>
  );
};

export default AuditorLoginScreen;
