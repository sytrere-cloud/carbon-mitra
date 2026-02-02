import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Loader2, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface LoginScreenProps {
  language: "hi" | "en";
  onSuccess: () => void;
  onSkip: () => void;
}

const LoginScreen = ({ language, onSuccess, onSkip }: LoginScreenProps) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const labels = {
    hi: {
      title: "NamastuBharat में आपका स्वागत है",
      subtitle: "अपने मोबाइल नंबर से लॉगिन करें",
      phonePlaceholder: "मोबाइल नंबर दर्ज करें",
      sendOtp: "OTP भेजें",
      enterOtp: "OTP दर्ज करें",
      otpSent: "OTP भेजा गया",
      verify: "सत्यापित करें",
      resend: "OTP फिर से भेजें",
      skip: "बाद में करें",
      secure: "आपका डेटा सुरक्षित है"
    },
    en: {
      title: "Welcome to NamastuBharat",
      subtitle: "Login with your mobile number",
      phonePlaceholder: "Enter mobile number",
      sendOtp: "Send OTP",
      enterOtp: "Enter OTP",
      otpSent: "OTP Sent",
      verify: "Verify",
      resend: "Resend OTP",
      skip: "Skip for now",
      secure: "Your data is secure"
    }
  };

  const t = labels[language];

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      toast({
        variant: "destructive",
        title: language === "hi" ? "गलत नंबर" : "Invalid Number",
        description: language === "hi" 
          ? "कृपया 10 अंकों का मोबाइल नंबर दर्ज करें" 
          : "Please enter a valid 10-digit mobile number"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setStep("otp");
      toast({
        title: t.otpSent,
        description: language === "hi" 
          ? `OTP ${formattedPhone} पर भेजा गया` 
          : `OTP sent to ${formattedPhone}`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: language === "hi" ? "त्रुटि" : "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: language === "hi" ? "गलत OTP" : "Invalid OTP",
        description: language === "hi" 
          ? "कृपया 6 अंकों का OTP दर्ज करें" 
          : "Please enter a 6-digit OTP"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      toast({
        title: language === "hi" ? "सफल!" : "Success!",
        description: language === "hi" 
          ? "आप सफलतापूर्वक लॉगिन हो गए" 
          : "You are now logged in"
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: language === "hi" ? "त्रुटि" : "Error",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header with Skip */}
      <div className="flex justify-end p-4 safe-top">
        <motion.button
          onClick={onSkip}
          className="text-muted-foreground text-sm font-medium"
          whileTap={{ scale: 0.95 }}
        >
          {t.skip}
        </motion.button>
      </div>

      {/* Logo Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-24 h-24 rounded-full bg-forest flex items-center justify-center mb-6 shadow-glow-forest"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <span className="text-4xl">🌳</span>
        </motion.div>

        <motion.h1
          className="text-2xl font-bold text-soil text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t.title}
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t.subtitle}
        </motion.p>

        {/* Phone Input */}
        {step === "phone" && (
          <motion.div
            className="w-full space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span className="font-medium">+91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder={t.phonePlaceholder}
                className="w-full h-14 pl-24 pr-4 rounded-2xl bg-card border border-border text-lg font-medium focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>

            <motion.button
              onClick={handleSendOtp}
              disabled={isLoading || phone.length < 10}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{t.sendOtp}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* OTP Input */}
        {step === "otp" && (
          <motion.div
            className="w-full space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">{t.enterOtp}</p>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot 
                        key={index} 
                        index={index} 
                        className="w-12 h-14 text-xl rounded-xl border-2"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <motion.button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length !== 6}
              className="w-full btn-amber flex items-center justify-center gap-2 disabled:opacity-50"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{t.verify}</span>
              )}
            </motion.button>

            <button
              onClick={handleSendOtp}
              className="w-full text-center text-sm text-forest font-medium"
            >
              {t.resend}
            </button>
          </motion.div>
        )}

        {/* Security Badge */}
        <motion.div
          className="flex items-center gap-2 mt-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Shield className="w-4 h-4" />
          <span className="text-xs">{t.secure}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;
