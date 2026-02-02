import { motion } from "framer-motion";
import { TrendingUp, Volume2 } from "lucide-react";

interface EarningsCardProps {
  totalEarnings: number;
  pendingCredits: number;
  language: "hi" | "en";
}

const EarningsCard = ({ totalEarnings, pendingCredits, language }: EarningsCardProps) => {
  const labels = {
    hi: {
      totalEarnings: "कुल कार्बन कमाई",
      pending: "प्रमाणन प्रतीक्षा",
      credits: "क्रेडिट",
      listen: "सुनें"
    },
    en: {
      totalEarnings: "Total Carbon Earnings",
      pending: "Pending Verification",
      credits: "Credits",
      listen: "Listen"
    }
  };

  const t = labels[language];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      className="card-forest mx-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">{t.totalEarnings}</span>
        </div>
        <motion.button
          className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          whileTap={{ scale: 0.9 }}
          aria-label={t.listen}
        >
          <Volume2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Big Number */}
      <motion.div
        className="flex items-baseline gap-2"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <span className="text-4xl font-bold">
          {formatCurrency(totalEarnings)}
        </span>
      </motion.div>

      {/* Pending Credits */}
      <div className="mt-4 pt-3 border-t border-primary-foreground/20">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-80">{t.pending}</span>
          <div className="flex items-center gap-2">
            <motion.span
              className="font-bold text-amber-glow"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {pendingCredits} {t.credits}
            </motion.span>
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EarningsCard;
