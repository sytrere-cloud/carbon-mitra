import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, ClipboardCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuditorOverview from "@/components/auditor/AuditorOverview";
import AuditorFarmList from "@/components/auditor/AuditorFarmList";
import AuditorFarmDetail from "@/components/auditor/AuditorFarmDetail";
import AuditorReports from "@/components/auditor/AuditorReports";
import { useToast } from "@/hooks/use-toast";

interface AuditorDashboardProps {
  onLogout: () => void;
}

const AuditorDashboard = ({ onLogout }: AuditorDashboardProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "farms" | "reports">("overview");
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [farmDetail, setFarmDetail] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assigned farms with related data
      const { data: assignments } = await supabase
        .from("audit_assignments")
        .select("farm_id, status, season, year")
        .eq("auditor_id", user!.id)
        .eq("status", "active");

      if (assignments && assignments.length > 0) {
        const farmIds = assignments.map(a => a.farm_id);
        
        const { data: farmsData } = await supabase
          .from("farms")
          .select("*")
          .in("id", farmIds);

        // Get photo counts and NDVI for each farm
        const enrichedFarms = await Promise.all(
          (farmsData ?? []).map(async (farm) => {
            const { count: photoCount } = await supabase
              .from("farm_photos")
              .select("*", { count: "exact", head: true })
              .eq("farm_id", farm.id);

            const { data: ndvi } = await supabase
              .from("ndvi_readings")
              .select("ndvi_value")
              .eq("farm_id", farm.id)
              .order("reading_date", { ascending: false })
              .limit(1);

            // Get farmer profile
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("user_id", farm.user_id)
              .single();

            return {
              ...farm,
              farmer_name: profile?.full_name ?? "Unknown",
              photo_count: photoCount ?? 0,
              latest_ndvi: ndvi?.[0]?.ndvi_value ?? null,
              status: "pending",
            };
          })
        );

        setFarms(enrichedFarms);
      }

      // Fetch reports
      const { data: reportsData } = await supabase
        .from("audit_reports")
        .select("*")
        .eq("auditor_id", user!.id)
        .order("created_at", { ascending: false });

      setReports(
        (reportsData ?? []).map(r => ({
          ...r,
          farm_count: (r.farm_ids as string[])?.length ?? 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching auditor data:", err);
    }
    setLoading(false);
  };

  const handleSelectFarm = async (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    if (!farm) return;

    // Fetch photos
    const { data: photos } = await supabase
      .from("farm_photos")
      .select("*")
      .eq("farm_id", farmId)
      .order("captured_at", { ascending: false });

    // Fetch NDVI
    const { data: ndvi } = await supabase
      .from("ndvi_readings")
      .select("*")
      .eq("farm_id", farmId)
      .order("reading_date", { ascending: false });

    // Fetch farmer profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, village")
      .eq("user_id", farm.user_id)
      .single();

    setFarmDetail({
      ...farm,
      farmer_name: profile?.full_name ?? "Unknown",
      farmer_phone: profile?.phone ?? null,
      farmer_village: profile?.village ?? null,
      photos: photos ?? [],
      ndvi_readings: ndvi ?? [],
    });
    setSelectedFarmId(farmId);
    setActiveTab("farms");
  };

  const handleGenerateReport = async () => {
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-audit-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ auditor_id: user!.id }),
        }
      );

      if (response.ok) {
        toast({
          title: "Report Generated",
          description: "Your audit report has been generated and will be sent automatically.",
        });
        fetchData();
      } else {
        throw new Error("Failed to generate report");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const photosToReview = farms.reduce((acc, f) => acc + f.photo_count, 0);
  const ndviAlerts = farms.filter(f => f.latest_ndvi !== null && f.latest_ndvi < 0.3).length;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "farms", label: "Farms" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Auditor Portal</h1>
            <p className="text-xs text-muted-foreground">NamastuBharat Verification</p>
          </div>
        </div>
        <motion.button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-3 bg-card border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id !== "farms") setSelectedFarmId(null);
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="p-4 space-y-4">
        {activeTab === "overview" && (
          <AuditorOverview
            assignedFarms={farms.length}
            photosToReview={photosToReview}
            ndviAlerts={ndviAlerts}
            completedAudits={reports.filter(r => r.status === "sent").length}
          />
        )}

        {activeTab === "farms" && !selectedFarmId && (
          <AuditorFarmList farms={farms} onSelectFarm={handleSelectFarm} />
        )}

        {activeTab === "farms" && selectedFarmId && farmDetail && (
          <AuditorFarmDetail
            farm={farmDetail}
            onBack={() => {
              setSelectedFarmId(null);
              setFarmDetail(null);
            }}
          />
        )}

        {activeTab === "reports" && (
          <AuditorReports
            reports={reports}
            onGenerateReport={handleGenerateReport}
          />
        )}
      </main>
    </div>
  );
};

export default AuditorDashboard;
