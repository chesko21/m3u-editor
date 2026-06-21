"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUpload, 
  faEdit, 
  faCloudDownloadAlt, 
  faDownload, 
  faBoxes, 
  faBolt 
} from "@fortawesome/free-solid-svg-icons";

export default function Features() {
  const featureList = [
    {
      title: "Upload M3U File",
      description: "Unggah berkas M3U/M3U8 lokal Anda secara instan untuk dianalisis dan dikelola langsung di dalam browser.",
      icon: faUpload,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-100/50 dark:border-blue-900/30",
      glowClass: "hover:shadow-blue-500/10 hover:border-blue-500/30 dark:hover:border-blue-500/20"
    },
    {
      title: "Fetch from Remote URL",
      description: "Muat daftar putar IPTV langsung menggunakan tautan URL jaringan web eksternal melalui sistem proxy yang aman.",
      icon: faCloudDownloadAlt,
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/40 border-purple-100/50 dark:border-purple-900/30",
      glowClass: "hover:shadow-purple-500/10 hover:border-purple-500/30 dark:hover:border-purple-500/20"
    },
    {
      title: "Edit Channel Details",
      description: "Ubah metadata saluran mulai dari durasi, ID TVG, nama, logo ikon, hingga konfigurasi header HTTP Referer khusus.",
      icon: faEdit,
      iconColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/40 border-amber-100/50 dark:border-amber-900/30",
      glowClass: "hover:shadow-amber-500/10 hover:border-amber-500/30 dark:hover:border-amber-500/20"
    },
    {
      title: "Smart Grouping",
      description: "Saluran otomatis dikelompokkan ke dalam kategori berdasarkan tag grup bawaan berkas untuk navigasi yang lebih efisien.",
      icon: faBoxes,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100/50 dark:border-indigo-900/30",
      glowClass: "hover:shadow-indigo-500/10 hover:border-indigo-500/30 dark:hover:border-indigo-500/20"
    },
    {
      title: "Debounced Search",
      description: "Sistem pencarian super cepat teroptimasi yang mampu memfilter ribuan saluran IPTV tanpa menyebabkan lag pada perangkat.",
      icon: faBolt,
      iconColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/40 border-rose-100/50 dark:border-rose-900/30",
      glowClass: "hover:shadow-rose-500/10 hover:border-rose-500/30 dark:hover:border-rose-500/20"
    },
    {
      title: "Export & Save Playlist",
      description: "Unduh kembali hasil suntingan Anda menjadi berkas M3U standar industri yang siap digunakan pada aplikasi pemutar IPTV favorit.",
      icon: faDownload,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100/50 dark:border-emerald-900/30",
      glowClass: "hover:shadow-emerald-500/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/20"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0b0f19] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="text-center animate-fade-in max-w-2xl mx-auto flex flex-col gap-3">
          <span className="text-[10px] font-extrabold tracking-widest text-blue-600 dark:text-blue-500 uppercase">
            Fitur Utama Aplikasi
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Segudang Fitur Andalan
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Temukan berbagai kapabilitas utama M3U StreamEditor Pro yang dirancang khusus untuk memberikan efisiensi penuh dalam manajemen playlist IPTV Anda.
          </p>
        </div>

        {/* Features Dynamic Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, idx) => (
            <div 
              key={idx} 
              style={{ animationDelay: `${idx * 100}ms` }}
              className={`group p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4 animate-scale-in opacity-0 ${feature.glowClass}`}
            >
              {/* Icon Container */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <FontAwesomeIcon icon={feature.icon} className={`text-base ${feature.iconColor}`} />
              </div>
              
              {/* Text Meta Content */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}