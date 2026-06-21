"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCodeBranch, faCompass, faBullseye, faLaptopCode, faShieldAlt, faTv, faZap } from "@fortawesome/free-solid-svg-icons";

export default function About() {
  const stats = [
    { label: "Client-Side Parsing", value: "100%", icon: faZap, desc: "Proses cepat tanpa beban server", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40" },
    { label: "Privasi Terjamin", value: "Aman", icon: faShieldAlt, desc: "Token & link IPTV tetap rahasia", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Pemutar Video", value: "Aktif", icon: faTv, desc: "Uji coba saluran langsung di web", color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0b0f19] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="text-center animate-fade-in flex flex-col gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100/50 dark:border-blue-900/30 shadow-xs">
            <FontAwesomeIcon icon={faLaptopCode} className="text-xl" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Tentang Proyek Ini
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            <strong className="text-blue-600 dark:text-blue-400 font-extrabold">M3U StreamEditor Pro</strong> adalah peralatan sumber terbuka (*open-source*) modern yang dirancang untuk membantu Anda memanipulasi, menyaring, dan mengelola struktur berkas daftar putar IPTV secara instan langsung dari peramban.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-2"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <FontAwesomeIcon icon={stat.icon} className="text-sm" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white mt-2">{stat.value}</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{stat.label}</span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 leading-normal">{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Mission Card */}
          <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/30">
                <FontAwesomeIcon icon={faBullseye} className="text-sm" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                Misi Kami
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              Menghadirkan pengalaman manipulasi data *playlist* IPTV yang intuitif, aman, dan tanpa bergantung pada server eksternal, memberikan kemudahan penuh bagi pengguna IPTV di seluruh dunia.
            </p>
          </div>

          {/* Local-First Architecture Card */}
          <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/30">
                <FontAwesomeIcon icon={faCodeBranch} className="text-sm" />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                Arsitektur Lokal
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              Seluruh proses *parsing* dan manipulasi data M3U dijalankan penuh di sisi klien (*client-side*), memastikan kerahasiaan tautan IPTV dan keamanan token privasi Anda tetap terjaga.
            </p>
          </div>
        </div>

        {/* Call to Action (GitHub Footer) */}
        <div className="text-center p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-sm max-w-xl mx-auto flex flex-col items-center gap-4 glass-panel">
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 flex items-center justify-center">
            <FontAwesomeIcon icon={faCompass} className="text-base" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
              Kontribusi & Eksplorasi
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
              Proyek ini dikembangkan secara bebas. Tinjau kode sumber, laporkan kendala, atau kirimkan pembaruan fitur langsung melalui repositori GitHub resmi kami.
            </p>
          </div>
          <a
            href="https://github.com/chesko21/m3u-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-extrabold text-white bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-2xl shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <FontAwesomeIcon icon={faGithub} className="text-base" />
            <span>Kunjungi Repositori GitHub</span>
          </a>
        </div>

      </div>
    </div>
  );
}