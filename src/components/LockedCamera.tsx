import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, MapPin, Clock, Compass, Wifi, Check, AlertTriangle } from "lucide-react";

interface PhotoMetadata {
  latitude: number;
  longitude: number;
  timestamp: string;
  compassHeading: number | null;
  networkId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
  };
}

interface LockedCameraProps {
  language: "hi" | "en";
  milestoneStage: string;
  onCapture: (photoBlob: Blob, metadata: PhotoMetadata) => void;
  onClose: () => void;
}

const LockedCamera = ({ language, milestoneStage, onCapture, onClose }: LockedCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const labels = {
    hi: {
      title: "फोटो लें",
      gpsWaiting: "GPS प्राप्त हो रहा है...",
      gpsLocked: "GPS लॉक",
      noGps: "GPS उपलब्ध नहीं",
      capture: "फोटो खींचें",
      retake: "दोबारा लें",
      confirm: "पुष्टि करें",
      stage: milestoneStage,
      stampedInfo: "स्टैम्प जानकारी",
    },
    en: {
      title: "Capture Photo",
      gpsWaiting: "Acquiring GPS...",
      gpsLocked: "GPS Locked",
      noGps: "GPS unavailable",
      capture: "Take Photo",
      retake: "Retake",
      confirm: "Confirm",
      stage: milestoneStage,
      stampedInfo: "Stamped Info",
    },
  };
  const t = labels[language];

  // Start camera (rear-facing only, no gallery)
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Get GPS
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError(true);
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsError(false);
      },
      () => setGpsError(true),
      { enableHighAccuracy: true, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Compass heading
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if ((e as any).webkitCompassHeading) {
        setCompassHeading((e as any).webkitCompassHeading);
      } else if (e.alpha) {
        setCompassHeading(360 - e.alpha);
      }
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Stamp overlay
    const now = new Date();
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px sans-serif";

    const stampLines = [
      `📍 ${gpsLocation ? `${gpsLocation.lat.toFixed(6)}, ${gpsLocation.lng.toFixed(6)}` : "No GPS"}`,
      `🕐 ${now.toISOString()} UTC`,
      `🧭 ${compassHeading != null ? `${Math.round(compassHeading)}°` : "N/A"} | 📶 ${navigator.onLine ? "Online" : "Offline"} | 🏷️ ${milestoneStage}`,
    ];
    stampLines.forEach((line, i) => {
      ctx.fillText(line, 16, canvas.height - 85 + i * 35);
    });

    canvas.toBlob((blob) => {
      if (blob) {
        setCaptured(true);
        const metadata: PhotoMetadata = {
          latitude: gpsLocation?.lat ?? 0,
          longitude: gpsLocation?.lng ?? 0,
          timestamp: now.toISOString(),
          compassHeading,
          networkId: navigator.onLine ? "online" : "offline",
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
          },
        };
        onCapture(blob, metadata);
      }
    }, "image/jpeg", 0.9);
  }, [gpsLocation, compassHeading, milestoneStage, onCapture]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-foreground flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-foreground/90 text-primary-foreground z-10">
        <div>
          <h3 className="font-bold text-lg">{t.title}</h3>
          <span className="text-xs opacity-70">{t.stage}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-card/10">
          <X className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* GPS Status */}
      <div className="absolute top-16 left-4 right-4 z-10 flex gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          gpsLocation ? "bg-forest text-primary-foreground" : gpsError ? "bg-destructive text-destructive-foreground" : "bg-amber text-foreground"
        }`}>
          <MapPin className="w-3 h-3" />
          {gpsLocation ? t.gpsLocked : gpsError ? t.noGps : t.gpsWaiting}
        </div>
        {compassHeading != null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card/80 text-foreground">
            <Compass className="w-3 h-3" />
            {Math.round(compassHeading)}°
          </div>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-card/80 text-foreground">
          <Wifi className="w-3 h-3" />
          {navigator.onLine ? "Online" : "Offline"}
        </div>
      </div>

      {/* Camera Feed */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Crosshair guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-primary-foreground/30 rounded-2xl" />
        </div>
      </div>

      {/* Capture Button */}
      <div className="p-6 bg-foreground/90 flex justify-center">
        <motion.button
          onClick={capturePhoto}
          disabled={!gpsLocation}
          className={`w-20 h-20 rounded-full border-4 border-primary-foreground flex items-center justify-center ${
            gpsLocation ? "bg-primary-foreground" : "bg-muted-foreground/50 cursor-not-allowed"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <Camera className={`w-8 h-8 ${gpsLocation ? "text-forest" : "text-muted-foreground"}`} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LockedCamera;
