"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
      <div className="w-64 h-64">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    </div>
  );
}