"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-[95vw]",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  subtitle,
  icon,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Fungsi penutup tunggal yang terintegrasi dengan durasi transisi Tailwind (300ms)
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    const timer = setTimeout(() => {
      onClose();
    }, 300); // Harus presisi dengan duration-300 Tailwind
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        handleClose();
      }
    },
    [handleClose, closeOnEscape]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setShouldRender(true);
      
      // Amankan eksekusi kelas transisi masuk
      const animationFrame = requestAnimationFrame(() => {
        setIsAnimating(true);
      });

      // Kunci scrollbar di balik layar
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      document.addEventListener("keydown", handleEscape);

      // Focus Trap Otomatis: Arahkan fokus ke elemen interaktif pertama di dalam modal
      if (contentRef.current) {
        const focusableElements = contentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }

      return () => {
        cancelAnimationFrame(animationFrame);
        document.removeEventListener("keydown", handleEscape);
      };
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);

      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }

      return () => clearTimeout(timer);
    }
  }, [isOpen, handleEscape]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  const sizeClass = sizeClasses[size] || sizeClasses.lg;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300 ease-in-out ${
        isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={subtitle ? "modal-subtitle" : undefined}
    >
      {/* Gelap Latar Belakang (Backdrop Backdrop Blur) */}
      <div
        className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Kontainer Utama Box Modal */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl ${sizeClass} w-full max-h-[85vh] overflow-hidden transform transition-all duration-300 ease-out ${
          isAnimating
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Kepala Modal (Header) */}
        <div className="flex justify-between items-start p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {icon && (
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/30">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2
                id="modal-title"
                className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate"
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  id="modal-subtitle"
                  className="mt-0.5 text-xs text-gray-400 dark:text-gray-500 font-medium"
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {showCloseButton && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </button>
          )}
        </div>

        {/* Isi Formulir / Konten Modal */}
        <div className="overflow-y-auto max-h-[calc(85vh-11rem)] p-4 sm:p-5 text-gray-700 dark:text-gray-300 font-medium text-sm scrollbar-thin">
          {children}
        </div>

        {/* Kaki Modal (Footer Opsional) */}
        {footer && (
          <div className="flex justify-end items-center gap-2 p-3 sm:p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;