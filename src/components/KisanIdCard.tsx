import { motion } from "framer-motion";
import { User, Copy, Share2, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface KisanIdCardProps {
  language: "hi" | "en";
  kisanId: string;
  referralCode: string;
  farmerName: string;
  village?: string;
  district?: string;
}

const KisanIdCard = ({ language, kisanId, referralCode, farmerName, village, district }: KisanIdCardProps) => {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: language === "hi" ? "कॉपी हो गया!" : "Copied!",
      description: code,
    });
  };

  const shareCode = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "NamastuBharat Referral",
        text: language === "hi"
          ? `मेरा NamastuBharat रेफरल कोड: ${referralCode}. कार्बन क्रेडिट से कमाएं!`
          : `My NamastuBharat referral code: ${referralCode}. Earn from Carbon Credits!`,
        url: window.location.origin,
      });
    } else {
      copyCode(referralCode);
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(135deg, hsl(122 39% 33%), hsl(122 42% 22%), hsl(16 32% 29%))",
      }}
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative p-6 text-primary-foreground">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs opacity-70 tracking-widest uppercase">
              {language === "hi" ? "किसान पहचान" : "Kisan Identity"}
            </p>
            <h3 className="text-2xl font-bold tracking-wider">{kisanId}</h3>
          </div>
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
            <QrCode className="w-7 h-7" />
          </div>
        </div>

        {/* Farmer Info */}
        <div className="mb-4">
          <p className="text-lg font-semibold">{farmerName}</p>
          {(village || district) && (
            <p className="text-sm opacity-70">
              {[village, district].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {/* Referral Code */}
        <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-xl p-3">
          <div className="flex-1">
            <p className="text-xs opacity-70">
              {language === "hi" ? "रेफरल कोड" : "Referral Code"}
            </p>
            <p className="font-mono font-bold text-sm tracking-wider">{referralCode}</p>
          </div>
          <motion.button
            onClick={() => copyCode(referralCode)}
            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20"
            whileTap={{ scale: 0.9 }}
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={shareCode}
            className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20"
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* NamastuBharat branding */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs opacity-50 font-medium">NAMASTU BHARAT</p>
          <p className="text-xs opacity-50">Digital Carbon Passbook</p>
        </div>
      </div>
    </motion.div>
  );
};

export default KisanIdCard;
