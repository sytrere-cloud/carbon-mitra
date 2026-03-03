import { motion } from "framer-motion";
import { FileText, Download, Clock, CheckCircle, Send } from "lucide-react";

interface Report {
  id: string;
  report_type: string;
  status: string;
  generated_at: string;
  sent_at: string | null;
  farm_count: number;
}

interface AuditorReportsProps {
  reports: Report[];
  onGenerateReport: () => void;
}

const AuditorReports = ({ reports, onGenerateReport }: AuditorReportsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent": return <Send className="w-4 h-4 text-primary" />;
      case "generated": return <CheckCircle className="w-4 h-4 text-accent" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Audit Reports</h2>
        <motion.button
          onClick={onGenerateReport}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
          whileTap={{ scale: 0.95 }}
        >
          Generate Report
        </motion.button>
      </div>

      {reports.length === 0 ? (
        <div className="card-earth text-center py-8">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No reports generated yet</p>
          <p className="text-xs text-muted-foreground mt-1">Reports are auto-generated weekly</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-earth flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground capitalize">
                  {report.report_type} Report
                </p>
                <p className="text-xs text-muted-foreground">
                  {report.farm_count} farms • {new Date(report.generated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusIcon(report.status)}
                <span className={`text-xs font-semibold capitalize ${
                  report.status === "sent" ? "text-primary" : "text-muted-foreground"
                }`}>
                  {report.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditorReports;
