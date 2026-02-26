import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, 
  ChevronRight, 
  Shield, 
  Handshake, 
  CheckCircle,
  Leaf,
  Mic,
  FileSignature
} from "lucide-react";
import CarbonRightsAgreement from "@/components/CarbonRightsAgreement";

interface OnboardingScreenProps {
  language: "hi" | "en";
  onComplete: () => void;
}

const OnboardingScreen = ({ language, onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  const labels = {
    hi: {
      skip: "छोड़ें",
      next: "आगे बढ़ें",
      accept: "मैं सहमत हूं",
      listen: "सुनें",
      recordConsent: "सहमति दर्ज करें",
      step1: {
        title: "आपकी जमीन, आपके अधिकार",
        content: "NamastuBharat आपकी जमीन का मालिक नहीं है। आप मालिक हैं। हम केवल आपके खेत द्वारा उत्पादित 'स्वच्छ हवा' (कार्बन) को बेचने में मदद करते हैं। आप जब चाहें ऐप का उपयोग बंद कर सकते हैं, लेकिन भुगतान पाने के लिए आपको कम से कम एक पूरे सीजन के लिए हरित नियमों का पालन करना होगा।"
      },
      step2: {
        title: "ईमानदार काम, ईमानदार पैसा",
        content: "हम वादा करते हैं कि आपके कार्बन क्रेडिट बेचने से मिलने वाले पैसे का 80% आपको देंगे। हम उपग्रहों, वैज्ञानिकों और ऐप के लिए 20% रखते हैं। आप अपने वॉलेट में लाइव मार्केट प्राइस देखेंगे।"
      },
      step3: {
        title: "कोई धोखा नहीं",
        content: "भुगतान पाने के लिए, आपको पराली नहीं जलानी है और अनुरोध किए जाने पर फोटो लेने होंगे। यदि सैटेलाइट आपके GPS मैप पर धुआं या आग देखता है, तो उस वर्ष के लिए आपके क्रेडिट रद्द हो जाएंगे। हम आपके आधार का उपयोग केवल आपके बैंक में सुरक्षित रूप से पैसे भेजने के लिए करते हैं।"
      }
    },
    en: {
      skip: "Skip",
      next: "Continue",
      accept: "I Accept",
      listen: "Listen",
      recordConsent: "Record Consent",
      step1: {
        title: "Your Land, Your Rights",
        content: "NamastuBharat does NOT own your land. You are the owner. We only help you sell the 'clean air' (carbon) your farm produces. You can stop using the app whenever you want, but you must follow the green rules for at least one full season to get paid."
      },
      step2: {
        title: "Honest Work, Honest Pay",
        content: "We promise to give you 80% of the money we get from selling your carbon credits. We keep 20% to pay for the satellites, the scientists, and the app. You will see the live market price in your wallet."
      },
      step3: {
        title: "No Tricks",
        content: "To get paid, you must not burn stubble and you must take photos as requested. If the satellite sees smoke or fire on your GPS map, your credits for that year will be cancelled. We use your Aadhaar only to send money safely to your bank."
      }
    }
  };

  const t = labels[language];

  const steps = [
    { icon: Leaf, ...t.step1 },
    { icon: Handshake, ...t.step2 },
    { icon: Shield, ...t.step3 }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAccept = () => {
    setHasAccepted(true);
    setTimeout(() => {
      setShowAgreement(true);
    }, 800);
  };

  const handleAgreementComplete = (data: {
    fullName: string;
    aadhaarLastFour: string;
    signatureData: string;
    signatureType: "draw" | "type";
    selfDeclared: boolean;
  }) => {
    console.log("Agreement signed:", data);
    onComplete();
  };

  const handleAgreementSkip = () => {
    onComplete();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  if (showAgreement) {
    return (
      <CarbonRightsAgreement
        language={language}
        farmerName={language === "hi" ? "राजेश किसान" : "Rajesh Kisan"}
        onComplete={handleAgreementComplete}
        onSkip={handleAgreementSkip}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex justify-end p-4 safe-top">
        <motion.button
          onClick={onComplete}
          className="text-muted-foreground text-sm font-medium"
          whileTap={{ scale: 0.95 }}
        >
          {t.skip}
        </motion.button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentStep ? "w-8 bg-forest" : "w-2 bg-muted"
            }`}
            animate={{ scale: i === currentStep ? 1.1 : 1 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-24 h-24 rounded-full bg-forest/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Icon className="w-12 h-12 text-forest" />
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-soil text-center mb-4">
              {currentStepData.title}
            </h1>

            {/* Content Card */}
            <div className="card-earth">
              <div className="flex items-start gap-3">
                <motion.button
                  className="voice-btn flex-shrink-0"
                  whileTap={{ scale: 0.9 }}
                >
                  <Volume2 className="w-5 h-5" />
                </motion.button>
                <p className="text-soil leading-relaxed">
                  {currentStepData.content}
                </p>
              </div>
            </div>

            {/* Voice Consent (Last Step) */}
            {currentStep === steps.length - 1 && (
              <motion.div
                className="mt-6 card-forest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-center mb-4 opacity-90">
                  {language === "hi" 
                    ? "अपनी आवाज में सहमति दर्ज करें" 
                    : "Record your consent by voice"}
                </p>
                <motion.button
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary-foreground/20"
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className="w-6 h-6" />
                  <span className="font-semibold">{t.recordConsent}</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 safe-bottom">
        {currentStep < steps.length - 1 ? (
          <motion.button
            className="w-full btn-primary flex items-center justify-center gap-2"
            onClick={handleNext}
            whileTap={{ scale: 0.98 }}
          >
            <span>{t.next}</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.button
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-all ${
              hasAccepted 
                ? "bg-forest text-primary-foreground" 
                : "btn-amber"
            }`}
            onClick={handleAccept}
            whileTap={{ scale: 0.98 }}
            disabled={hasAccepted}
          >
            {hasAccepted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{language === "hi" ? "स्वीकृत" : "Accepted"}</span>
              </>
            ) : (
              <span>{t.accept}</span>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
