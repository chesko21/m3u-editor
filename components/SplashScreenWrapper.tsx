"use client";

import { useEffect, useState, useRef } from "react";

export default function SplashScreenWrapper() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");

  // Amankan siklus interval rekursif dari memory leak menggunakan useRef
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);

    const loadingSteps = [
      { text: "Initializing", progress: 15, duration: 500 },
      { text: "Loading Resources", progress: 40, duration: 600 },
      { text: "Preparing Interface", progress: 65, duration: 600 },
      { text: "Almost Ready", progress: 85, duration: 400 },
      { text: "Complete", progress: 100, duration: 400 },
    ];

    let currentStep = 0;

    const processStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingText(step.text);

        const startProgress = currentStep > 0 ? loadingSteps[currentStep - 1].progress : 0;
        const targetProgress = step.progress;
        const stepDuration = step.duration;
        
        const stepsCount = 20;
        const increment = (targetProgress - startProgress) / stepsCount;
        const intervalTime = stepDuration / stepsCount;

        let currentProgress = startProgress;

        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        progressIntervalRef.current = setInterval(() => {
          currentProgress += increment;
          
          if (currentProgress >= targetProgress) {
            setProgress(targetProgress);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            currentStep++;
            processStep();
          } else {
            setProgress(Math.round(currentProgress));
          }
        }, intervalTime);
      }
    };

    processStep();

    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2600);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3100);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  if (!isVisible || !isClient) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-[999] transition-all duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 scale-102 blur-xs" : "opacity-100 scale-100"
      }`}
    >
      <div className="relative flex flex-col items-center p-4">
        
        {/* Animated Custom SVG CSS Spinner (Alternatif Lottie Ringan) */}
        <div
          className={`relative ${
            isFadingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
          } transition-all duration-500`}
        >
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="w-40 h-40 md:w-52 md:h-52 relative flex items-center justify-center">
            <div className="relative">
              {/* Outer Spin Ring */}
              <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin transition-all" />
              
              {/* Center Play Icon Indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Text & Tracker Info */}
        <div className="mt-6 w-48 md:w-56">
          <div className="flex justify-between items-center mb-2 px-0.5">
            <span className="text-blue-400 text-xs font-semibold tracking-wider">
              {loadingText}
            </span>
            <span className="text-slate-400 text-xs font-mono font-bold">
              {progress}%
            </span>
          </div>

          {/* Bar Progress Track */}
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden border border-slate-800/40">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-sky-300 rounded-full transition-all duration-200 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 blur-xs" />
            </div>
          </div>
        </div>

        {/* Bouncing Dots Loading */}
        <div className="mt-5 flex space-x-1.5">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${dot * 0.15}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {/* Brand Meta Title */}
        <p className="mt-8 text-slate-500 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-center">
          StreamEdit Pro
        </p>

        <div className="mt-8 w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
      </div>

      {/* Footer System Version Sign */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="flex items-center space-x-1.5 text-slate-700 text-[11px] font-medium tracking-wide">
          <span className="w-1 h-1 bg-slate-800 rounded-full" />
          <span className="font-mono">v4.0.0</span>
          <span className="w-1 h-1 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}