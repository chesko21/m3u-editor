"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane, faCheckCircle, faClock, faMapMarkerAlt, faLifeRing, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay for premium experience
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0b0f19] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="text-center animate-fade-in flex flex-col gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100/50 dark:border-blue-900/30 shadow-xs">
            <FontAwesomeIcon icon={faEnvelope} className="text-base" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Hubungi Kami
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg mx-auto">
            Punya pertanyaan, umpan balik, atau ingin melaporkan kendala teknis? Hubungi kami langsung melalui formulir di bawah ini.
          </p>
        </div>

        {submitted ? (
          /* Premium Success State Card */
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-8 sm:p-12 rounded-3xl shadow-xl text-center flex flex-col items-center gap-5 max-w-md mx-auto animate-scale-in glass-panel">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center border-2 border-emerald-100/30 animate-bounce">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                Pesan Terkirim!
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-400 font-medium leading-relaxed">
                Terima kasih atas umpan balik Anda. Tim kami telah menerima pesan Anda dan akan merespon segera jika diperlukan.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 text-xs font-extrabold rounded-2xl transition-all cursor-pointer"
            >
              <span>Kirim Pesan Baru</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </button>
          </div>
        ) : (
          /* Dual-column Form Layout */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-xl overflow-hidden glass-panel">
            {/* Form Column */}
            <div className="md:col-span-3 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800/80">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-900 dark:text-white transition-all text-xs sm:text-sm font-semibold"
                      placeholder="Nama lengkap"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-900 dark:text-white transition-all text-xs sm:text-sm font-semibold"
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-900 dark:text-white transition-all text-xs sm:text-sm font-semibold resize-none"
                    placeholder="Tuliskan pesan atau laporan kendala Anda di sini..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 active:scale-[0.99] disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 cursor-pointer"
                >
                  <FontAwesomeIcon icon={loading ? faLifeRing : faPaperPlane} className={`text-xs ${loading ? "animate-spin" : ""}`} />
                  <span>{loading ? "Mengirim..." : "Kirim Pesan"}</span>
                </button>
              </form>
            </div>

            {/* Info Column */}
            <div className="md:col-span-2 bg-gray-50/50 dark:bg-gray-950/20 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-6">
                <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-widest">
                  Info Kontak
                </h3>
                
                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 dark:text-gray-300">Surat Elektronik</p>
                      <p className="text-gray-400 dark:text-gray-500 mt-0.5">support@streamedit.pro</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 dark:text-gray-300">Jam Operasional</p>
                      <p className="text-gray-400 dark:text-gray-500 mt-0.5">Senin - Jumat | 09:00 - 17:00 WIB</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700 dark:text-gray-300">Lokasi Proyek</p>
                      <p className="text-gray-400 dark:text-gray-500 mt-0.5">Yogyakarta, Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100/30 dark:border-blue-900/20 rounded-2xl flex flex-col gap-1.5">
                <h4 className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Dukungan Github
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed font-semibold">
                  Jika Anda menemukan masalah teknis, disarankan untuk membuka tiket Issue di halaman GitHub proyek ini.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}