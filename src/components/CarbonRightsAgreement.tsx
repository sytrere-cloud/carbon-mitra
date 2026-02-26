import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, CheckCircle, Leaf, Volume2 } from "lucide-react";
import SignaturePad from "./SignaturePad";

interface CarbonRightsAgreementProps {
  language: "hi" | "en";
  farmerName: string;
  onComplete: (data: {
    fullName: string;
    aadhaarLastFour: string;
    signatureData: string;
    signatureType: "draw" | "type";
    selfDeclared: boolean;
  }) => void;
  onSkip: () => void;
}

const CarbonRightsAgreement = ({ language, farmerName, onComplete, onSkip }: CarbonRightsAgreementProps) => {
  const [step, setStep] = useState<"declaration" | "aadhaar" | "signature" | "done">("declaration");
  const [selfDeclared, setSelfDeclared] = useState(false);
  const [aadhaarLastFour, setAadhaarLastFour] = useState("");
  const [fullName, setFullName] = useState(farmerName);

  const labels = {
    hi: {
      title: "कार्बन अधिकार हस्तांतरण समझौता",
      subtitle: "किसान का वादा",
      declaration: "मैं घोषणा करता/करती हूं कि:",
      points: [
        "मैं इस भूमि का कानूनी मालिक/किरायेदार हूं",
        "मैं पराली नहीं जलाऊंगा/जलाऊंगी",
        "मैं NamastuBharat को मेरे खेत के कार्बन क्रेडिट बेचने का अधिकार देता/देती हूं",
        "मैं बिक्री का 80% प्राप्त करूंगा/करूंगी, 20% सेवा शुल्क है",
        "मैं समझता/समझती हूं कि सैटेलाइट से निगरानी होगी",
      ],
      agree: "मैं सहमत हूं और घोषणा करता/करती हूं",
      aadhaarLabel: "आधार के अंतिम 4 अंक (वैकल्पिक)",
      nameLabel: "पूरा नाम",
      next: "आगे बढ़ें",
      skip: "बाद में करें",
      signTitle: "अपना हस्ताक्षर दें",
      complete: "समझौता पूर्ण!",
      completeDesc: "आपका कार्बन अधिकार समझौता सुरक्षित रूप से संग्रहित किया गया है",
    },
    en: {
      title: "Carbon Rights Transfer Agreement",
      subtitle: "Kisan Promise",
      declaration: "I hereby declare that:",
      points: [
        "I am the legal owner/tenant of this land",
        "I will NOT burn crop stubble",
        "I authorize NamastuBharat to sell carbon credits from my farm",
        "I will receive 80% of sale proceeds; 20% is service fee",
        "I understand satellite monitoring will be used",
      ],
      agree: "I Agree & Self-Declare",
      aadhaarLabel: "Last 4 digits of Aadhaar (optional)",
      nameLabel: "Full Name",
      next: "Continue",
      skip: "Do Later",
      signTitle: "Add Your Signature",
      complete: "Agreement Complete!",
      completeDesc: "Your carbon rights agreement has been securely stored",
    },
  };

  const t = labels[language];

  const handleSignature = (data: string, type: "draw" | "type") => {
    setStep("done");
    setTimeout(() => {
      onComplete({ fullName, aadhaarLastFour, signatureData: data, signatureType: type, selfDeclared: true });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-top">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-forest" />
          <h1 className="text-lg font-bold text-soil">{t.subtitle}</h1>
        </div>
        <motion.button onClick={onSkip} className="text-muted-foreground text-sm font-medium" whileTap={{ scale: 0.95 }}>
          {t.skip}
        </motion.button>
      </div>

      {/* Progress */}
      <div className="flex gap-2 px-4 mb-4">
        {["declaration", "aadhaar", "signature"].map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              ["declaration", "aadhaar", "signature"].indexOf(step) >= i
                ? "bg-forest"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 px-4 pb-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Self-Declaration */}
          {step === "declaration" && (
            <motion.div key="declaration" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
              <div className="card-earth">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-forest" />
                  <h2 className="font-semibold text-soil">{t.title}</h2>
                </div>
                <motion.button className="voice-btn mb-3" whileTap={{ scale: 0.9 }}>
                  <Volume2 className="w-4 h-4" />
                </motion.button>
                <p className="text-sm text-muted-foreground mb-3">{t.declaration}</p>
                <div className="space-y-3">
                  {t.points.map((point, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Leaf className="w-4 h-4 text-forest mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 card-earth cursor-pointer">
                <input
                  type="checkbox"
                  checked={selfDeclared}
                  onChange={(e) => setSelfDeclared(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded accent-[hsl(var(--forest))]"
                />
                <span className="text-sm font-medium text-foreground">{t.agree}</span>
              </label>

              <motion.button
                onClick={() => setStep("aadhaar")}
                disabled={!selfDeclared}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                  selfDeclared ? "btn-primary" : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                whileTap={selfDeclared ? { scale: 0.98 } : {}}
              >
                {t.next}
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Name + Aadhaar last 4 */}
          {step === "aadhaar" && (
            <motion.div key="aadhaar" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
              <div className="card-earth space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t.nameLabel}</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t.aadhaarLabel}</label>
                  <input
                    type="text"
                    value={aadhaarLastFour}
                    onChange={(e) => setAadhaarLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none tracking-[0.5em] text-center text-lg"
                    maxLength={4}
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {language === "hi" ? "केवल पहचान के लिए, कहीं साझा नहीं किया जाएगा" : "For identification only, never shared"}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={() => setStep("signature")}
                disabled={fullName.trim().length < 2}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                  fullName.trim().length >= 2 ? "btn-primary" : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                whileTap={fullName.trim().length >= 2 ? { scale: 0.98 } : {}}
              >
                {t.next}
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Signature */}
          {step === "signature" && (
            <motion.div key="signature" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
              <h2 className="text-lg font-semibold text-soil">{t.signTitle}</h2>
              <SignaturePad language={language} onSignatureCapture={handleSignature} />
            </motion.div>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 space-y-4">
              <motion.div
                className="w-20 h-20 rounded-full bg-forest/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-10 h-10 text-forest" />
              </motion.div>
              <h2 className="text-xl font-bold text-soil">{t.complete}</h2>
              <p className="text-sm text-muted-foreground text-center">{t.completeDesc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CarbonRightsAgreement;
