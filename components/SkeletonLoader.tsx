"use client";

import React from "react";

interface SkeletonLoaderProps {
  variant?: "table" | "card" | "list" | "channel";
  rows?: number;
  columns?: number;
}

const SkeletonLoader = ({ variant = "channel", rows = 5, columns = 6 }: SkeletonLoaderProps) => {
  // Base Shimmer Shading Classes
  const baseBg = "bg-gray-200 dark:bg-gray-800/80 rounded-xl animate-pulse";
  const innerBg = "bg-gray-300 dark:bg-gray-700/60 rounded-lg animate-pulse";

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xs space-y-4`}>
            <div className={`h-40 ${innerBg} w-full`} />
            <div className="space-y-2">
              <div className={`h-4 ${innerBg} w-3/4`} />
              <div className={`h-4 ${innerBg} w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3 w-full">
        {[...Array(rows)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-xs">
            <div className={`h-10 w-10 ${innerBg} rounded-full flex-shrink-0`} />
            <div className="flex-grow space-y-2">
              <div className={`h-4 ${innerBg} w-3/4`} />
              <div className={`h-3 ${innerBg} w-1/2`} />
            </div>
            <div className={`h-8 w-20 ${innerBg} flex-shrink-0`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "channel") {
    return (
      <div className="w-full flex flex-col gap-4">
        {/* Top Operations Panel Simulation Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`h-10 ${innerBg} w-full sm:w-36`} />
          <div className={`h-10 ${innerBg} flex-grow`} />
          <div className={`h-10 ${innerBg} w-full sm:w-28`} />
        </div>

        {/* Master Workspace Simulation */}
        <div className="flex gap-4 w-full">
          {/* Left Sidebar Category Block Menu */}
          <div className="w-64 flex-shrink-0 hidden lg:block space-y-2 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl h-fit">
            <div className={`h-4 ${innerBg} w-1/2 mb-4`} />
            {[...Array(6)].map((_, index) => {
              // Ganti Math.random dengan lebar statis berbasis index untuk menghindari penolakan dehidrasi SSR
              const widths = ["w-[85%]", "w-[70%]", "w-[75%]", "w-[60%]", "w-[80%]", "w-[65%]"];
              return <div key={index} className={`h-8 ${innerBg} ${widths[index % widths.length]}`} />;
            })}
          </div>

          {/* Right Main Grid Container Block workspace */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="flex flex-col items-center p-3.5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-xs space-y-3">
                  <div className={`h-14 w-14 sm:h-16 sm:w-16 ${innerBg} rounded-xl`} />
                  <div className={`h-4 ${innerBg} w-20`} />
                  <div className={`h-8 ${innerBg} w-full`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback Varian "table"
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`h-10 ${innerBg} w-32`} />
        <div className={`h-10 ${innerBg} flex-grow`} />
        <div className={`h-10 ${innerBg} w-24`} />
      </div>

      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xs">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
            <tr>
              {[...Array(columns)].map((_, index) => (
                <th key={index} className="p-3 text-left">
                  <div className={`h-4 ${innerBg} w-16`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {[...Array(rows)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(columns)].map((_, colIndex) => {
                  // Gunakan siklus pola modulus konstan untuk variasi visual lebar kolom yang aman dari server-side mismatch
                  const widths = ["w-[60%]", "w-[80%]", "w-[70%]", "w-[85%]", "w-[65%]", "w-[75%]"];
                  return (
                    <td key={colIndex} className="p-3">
                      <div className={`h-4 ${innerBg} ${widths[(rowIndex + colIndex) % widths.length]}`} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonLoader;