import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Clock, Lock, Sprout, Leaf, Wheat } from "lucide-react";
import LockedCamera from "./LockedCamera";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface MilestoneStage {
  id: string;
  nameHi: string;
  nameEn: string;
  descHi: string;
  descEn: string;
  icon: React.ElementType;
  months: string;
  status: "locked" | "active" | "pending" | "verified";
  photoUrl?: string;
}

interface EvidenceMilestonesProps {
  language: "hi" | "en";
  farmId?: string;
}

const EvidenceMilestones = ({ language, farmId }: EvidenceMilestonesProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [stages, setStages] = useState<MilestoneStage[]>([
    {
      id: "sowing",
      nameHi: "बुवाई",
      nameEn: "Sowing",
      descHi: "DSR मशीन / हैप्पी सीडर का फोटो",
      descEn: "Photo of DSR machine / Happy Seeder",
      icon: Sprout,
      months: "Jun-Jul",
      status: "active",
    },
    {
      id: "mid-growth",
      nameHi: "मध्य विकास",
      nameEn: "Mid-Growth",
      descHi: "खेत में फसल की वृद्धि का फोटो",
      descEn: "Photo of crop growth in field",
      icon: Leaf,
      months: "Sep-Oct",
      status: "locked",
    },
    {
      id: "pre-harvest",
      nameHi: "कटाई पूर्व",
      nameEn: "Pre-Harvest",
      descHi: "खेत में कोई जलन नहीं का प्रमाण",
      descEn: "Evidence of no burning in field",
      icon: Wheat,
      months: "Nov-Dec",
      status: "locked",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-forest text-primary-foreground";
      case "pending": return "bg-amber text-foreground";
      case "active": return "bg-primary/10 border-2 border-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return CheckCircle2;
      case "pending": return Clock;
      case "active": return Camera;
      default: return Lock;
    }
  };

  const handleOpenCamera = (stageId: string) => {
    setActiveStageId(stageId);
    setShowCamera(true);
  };

  const handleCapture = async (photoBlob: Blob, metadata: any) => {
    if (!activeStageId) return;
    setShowCamera(false);
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/${activeStageId}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("farm-photos")
        .upload(fileName, photoBlob, { contentType: "image/jpeg" });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("farm-photos")
        .getPublicUrl(fileName);

      // Save to farm_photos table
      if (farmId) {
        await supabase.from("farm_photos").insert({
          farm_id: farmId,
          user_id: user.id,
          photo_url: publicUrl,
          photo_type: "evidence",
          milestone_stage: activeStageId,
          latitude: metadata.latitude,
          longitude: metadata.longitude,
          compass_heading: metadata.compassHeading,
          network_id: metadata.networkId,
          device_info: metadata.deviceInfo,
          captured_at: metadata.timestamp,
        });
      }

      // Update stage status
      setStages((prev) =>
        prev.map((s) =>
          s.id === activeStageId ? { ...s, status: "pending" as const, photoUrl: publicUrl } : s
        )
      );

      toast({
        title: language === "hi" ? "फोटो अपलोड हुई!" : "Photo Uploaded!",
        description: language === "hi" ? "सत्यापन के लिए भेजा गया" : "Sent for verification",
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "फोटो अपलोड विफल" : "Photo upload failed",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const activeStage = stages.find((s) => s.id === activeStageId);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-soil flex items-center gap-2">
        <Camera className="w-5 h-5 text-forest" />
        {language === "hi" ? "साक्ष्य माइलस्टोन" : "Evidence Milestones"}
      </h3>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

        {stages.map((stage, index) => {
          const StatusIcon = getStatusIcon(stage.status);
          const StageIcon = stage.icon;
          return (
            <motion.div
              key={stage.id}
              className="relative flex gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              {/* Icon node */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 ${getStatusColor(stage.status)}`}>
                <StatusIcon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className={`flex-1 card-earth ${stage.status === "active" ? "border-2 border-primary" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <StageIcon className="w-4 h-4 text-forest" />
                    <h4 className="font-semibold text-soil">
                      {language === "hi" ? stage.nameHi : stage.nameEn}
                    </h4>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {stage.months}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {language === "hi" ? stage.descHi : stage.descEn}
                </p>

                {stage.status === "active" && (
                  <motion.button
                    onClick={() => handleOpenCamera(stage.id)}
                    disabled={uploading}
                    className="btn-primary w-full flex items-center justify-center gap-2 !py-3 !text-sm"
                    whileTap={{ scale: 0.98 }}
                  >
                    <Camera className="w-4 h-4" />
                    {uploading
                      ? (language === "hi" ? "अपलोड हो रहा..." : "Uploading...")
                      : (language === "hi" ? "फोटो खींचें" : "Take Photo")}
                  </motion.button>
                )}

                {stage.status === "pending" && (
                  <div className="badge-pending inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {language === "hi" ? "सत्यापन प्रतीक्षा" : "Pending Verification"}
                  </div>
                )}

                {stage.status === "verified" && (
                  <div className="badge-verified inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {language === "hi" ? "BEE प्रमाणित" : "BEE Certified"}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Camera Modal */}
      {showCamera && activeStage && (
        <LockedCamera
          language={language}
          milestoneStage={language === "hi" ? activeStage.nameHi : activeStage.nameEn}
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default EvidenceMilestones;
