import { motion } from "framer-motion";
import { Clock, CheckCircle2, Banknote, ArrowRight } from "lucide-react";

type CreditStatus = "pending" | "certified" | "paid";

interface CreditBatch {
  id: string;
  credits: number;
  amount: number;
  status: CreditStatus;
  date: string;
}

interface CarbonIncomeStatusProps {
  language: "hi" | "en";
  batches?: CreditBatch[];
}

const CarbonIncomeStatus = ({ language, batches }: CarbonIncomeStatusProps) => {
  const mockBatches: CreditBatch[] = batches || [
    { id: "1", credits: 10, amount: 5000, status: "paid", date: "Nov 2025" },
    { id: "2", credits: 8, amount: 3950, status: "certified", date: "Oct 2025" },
    { id: "3", credits: 15, amount: 7500, status: "pending", date: "Dec 2025" },
  ];

  const statusConfig: Record<CreditStatus, { labelHi: string; labelEn: string; color: string; bgColor: string; icon: React.ElementType }> = {
    pending: {
      labelHi: "सत्यापन प्रतीक्षा",
      labelEn: "Pending Verification",
      color: "text-amber-dark",
      bgColor: "bg-amber/20",
      icon: Clock,
    },
    certified: {
      labelHi: "BEE प्रमाणित",
      labelEn: "BEE Certified",
      color: "text-forest",
      bgColor: "bg-forest/10",
      icon: CheckCircle2,
    },
    paid: {
      labelHi: "भुगतान पूर्ण",
      labelEn: "Paid",
      color: "text-sky",
      bgColor: "bg-sky/10",
      icon: Banknote,
    },
  };

  // Status flow steps
  const statusFlow: CreditStatus[] = ["pending", "certified", "paid"];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-soil">
        {language === "hi" ? "कार्बन आय स्थिति" : "Carbon Income Status"}
      </h3>

      {/* Status Flow Indicator */}
      <div className="card-earth">
        <div className="flex items-center justify-between">
          {statusFlow.map((status, i) => {
            const cfg = statusConfig[status];
            const Icon = cfg.icon;
            return (
              <div key={status} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cfg.bgColor}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${cfg.color}`}>
                    {language === "hi" ? cfg.labelHi : cfg.labelEn}
                  </span>
                </div>
                {i < statusFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-1 mb-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Batches */}
      <div className="space-y-3">
        {mockBatches.map((batch, i) => {
          const cfg = statusConfig[batch.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={batch.id}
              className="card-earth flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bgColor}`}>
                <Icon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-soil text-sm">
                  {batch.credits} {language === "hi" ? "क्रेडिट" : "Credits"}
                </p>
                <p className="text-xs text-muted-foreground">{batch.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-soil text-sm">{formatCurrency(batch.amount)}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color}`}>
                  {language === "hi" ? cfg.labelHi : cfg.labelEn}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CarbonIncomeStatus;
