import { motion } from "framer-motion";
import { 
  Wallet, TrendingUp, Clock, Sparkles, ArrowUpRight,
  ArrowDownLeft, Building2, Volume2, CreditCard
} from "lucide-react";
import KisanIdCard from "@/components/KisanIdCard";
import CarbonIncomeStatus from "@/components/CarbonIncomeStatus";

interface WalletScreenProps {
  language: "hi" | "en";
}

const WalletScreen = ({ language }: WalletScreenProps) => {
  const labels = {
    hi: {
      title: "NamastuBharat वॉलेट",
      earned: "कमाया हुआ",
      pending: "प्रमाणन प्रतीक्षा",
      potential: "संभावित कमाई",
      transferToBank: "बैंक में भेजें",
      transactions: "लेनदेन",
      creditsold: "क्रेडिट बेचा",
      to: "को"
    },
    en: {
      title: "NamastuBharat Wallet",
      earned: "Earned",
      pending: "Pending Verification",
      potential: "Potential Earnings",
      transferToBank: "Transfer to Bank",
      transactions: "Transactions",
      creditsold: "Credits Sold",
      to: "to"
    }
  };

  const t = labels[language];

  const transactions = [
    { id: "1", type: "credit", amount: 5000, credits: 10, buyer: "Tata Steel", date: "15 Nov 2025" },
    { id: "2", type: "credit", amount: 3500, credits: 7, buyer: "Reliance", date: "01 Nov 2025" },
    { id: "3", type: "credit", amount: 3950, credits: 8, buyer: "Adani Green", date: "15 Oct 2025" },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="px-4 space-y-6 pb-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Wallet className="w-6 h-6 text-forest" />
          <h1 className="text-xl font-bold text-soil">{t.title}</h1>
        </div>
        <motion.button className="voice-btn" whileTap={{ scale: 0.9 }}>
          <Volume2 className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Kisan ID Card */}
      <KisanIdCard
        language={language}
        kisanId="NB-0001"
        referralCode="NB-0001-a3f2"
        farmerName={language === "hi" ? "राजेश किसान" : "Rajesh Kisan"}
        village={language === "hi" ? "गाँव: सोनपुर" : "Sonpur"}
        district={language === "hi" ? "जिला: भोपाल" : "Bhopal"}
      />

      {/* Balance Cards */}
      <div className="space-y-4">
        <motion.div
          className="card-forest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm opacity-90">{t.earned}</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(12450)}</p>
          <div className="mt-3 flex items-center gap-2 text-sm opacity-80">
            <span>25 Credits</span>
            <span>•</span>
            <span className="text-amber-glow">+₹5,000 {language === "hi" ? "इस महीने" : "this month"}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="card-earth border-2 border-amber/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber" />
              <span className="text-xs text-muted-foreground">{t.pending}</span>
            </div>
            <p className="text-xl font-bold text-amber">{formatCurrency(7500)}</p>
            <p className="text-xs text-muted-foreground mt-1">15 Credits</p>
          </motion.div>

          <motion.div
            className="card-earth border-2 border-forest/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-forest" />
              <span className="text-xs text-muted-foreground">{t.potential}</span>
            </div>
            <p className="text-xl font-bold text-forest">{formatCurrency(15000)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "hi" ? "यदि जलाया नहीं" : "If no burning"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Carbon Income Status Flow */}
      <CarbonIncomeStatus language={language} />

      {/* Transfer Button */}
      <motion.button
        className="w-full btn-amber flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Building2 className="w-5 h-5" />
        <span className="font-semibold">{t.transferToBank}</span>
        <ArrowUpRight className="w-5 h-5" />
      </motion.button>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-semibold text-soil mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-forest" />
          {t.transactions}
        </h2>
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              className="card-earth flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5 text-forest" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-soil">
                  {tx.credits} {t.creditsold} {t.to} {tx.buyer}
                </p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
              <p className="font-bold text-forest">+{formatCurrency(tx.amount)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WalletScreen;
