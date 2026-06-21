"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useDropzone } from 'react-dropzone';
import { parseM3U, generateM3U, Channel } from "../lib/m3uParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUpload, 
  faDownload, 
  faLink, 
  faSearch, 
  faTimes, 
  faBars, 
  faChevronLeft, 
  faInfoCircle, 
  faExclamationTriangle,
  faPlay,
  faPlus,
  faTrash,
  faTv,
  faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import { get, set, del } from 'idb-keyval';
import SkeletonLoader from "../components/SkeletonLoader";
import Modal from "../components/Modal";
import dynamic from "next/dynamic";

// Dynamic import to prevent hydration error from react-player (accessing browser window)
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface ChannelItemProps {
  channel: Channel;
  index: number;
  isActive: boolean;
  onEditClick: (channel: Channel, index: number) => void;
  onPlayClick: (channel: Channel) => void;
}

interface ModalContentProps {
  currentChannel: Channel | null;
  handleChangeChannelDetail: (key: keyof Channel, value: string) => void;
  handleSaveChanges: () => void;
  handleDeleteChannel?: () => void;
  isEditingExisting?: boolean;
}

// Simple debounce hook for search performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ChannelItem = memo(({ channel, index, isActive, onEditClick, onPlayClick }: ChannelItemProps) => {
  const [imageError, setImageError] = useState(false);
  const displayName = channel.name.length > 25 ? `${channel.name.slice(0, 23)}...` : channel.name;

  useEffect(() => {
    setImageError(false);
  }, [channel.logo]);

  // Determine protocol badge
  const protocol = useMemo(() => {
    if (!channel.url) return "";
    try {
      const url = new URL(channel.url);
      const ext = url.pathname.split('.').pop()?.toLowerCase();
      if (ext === "m3u8") return "HLS";
      if (ext === "mpd") return "DASH";
      if (ext === "mp4" || ext === "mkv") return ext.toUpperCase();
      return "MPEG-TS";
    } catch {
      return "IPTV";
    }
  }, [channel.url]);

  return (
    <div className={`group relative flex flex-col justify-between p-4 border rounded-2xl transition-all duration-300 bg-white dark:bg-gray-900 ${
      isActive 
        ? "border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-500/20 shadow-md glow-blue" 
        : "border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-blue-500/20 dark:hover:border-blue-500/10 hover:scale-[1.01]"
    }`}>
      
      {/* Protocol Badge */}
      <span className="absolute top-3 right-3 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700/50">
        {protocol}
      </span>

      <div className="flex flex-col items-center">
        {/* Logo Frame */}
        <div className="h-16 w-16 mb-3 flex-shrink-0 relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {channel.logo && !imageError ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="h-full w-full object-contain p-1.5 transition-transform duration-300"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-[10px] font-bold tracking-wider uppercase">NO LOGO</span>
          )}
          
          {/* Overlay Play Button on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlayClick(channel);
              }}
              className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
              aria-label="Play Stream Preview"
            >
              <FontAwesomeIcon icon={faPlay} className="text-xs ml-0.5" />
            </button>
          </div>
        </div>

        {/* Channel Name */}
        <span className="text-center font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100 mb-1 truncate w-full px-1" title={channel.name}>
          {displayName}
        </span>
        
        {/* Category Label */}
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-full mb-4">
          {channel.group || "Uncategorized"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full mt-auto">
        <button 
          onClick={() => onPlayClick(channel)} 
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            isActive 
              ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700" 
              : "bg-blue-50/50 hover:bg-blue-600 text-blue-600 hover:text-white border-blue-100/50 hover:border-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400 dark:hover:text-white"
          }`}
        >
          Preview
        </button>
        <button 
          onClick={() => onEditClick(channel, index)} 
          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-xl border border-gray-100 dark:border-gray-700/50 transition-all cursor-pointer"
        >
          Edit
        </button>
      </div>
    </div>
  );
});

ChannelItem.displayName = "ChannelItem";

const ModalContent = memo(({ currentChannel, handleChangeChannelDetail, handleSaveChanges, handleDeleteChannel, isEditingExisting }: ModalContentProps) => {
  if (!currentChannel) return null;

  const inputClass = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-900 dark:text-white transition-all duration-200 text-xs sm:text-sm font-medium";
  const labelClass = "block text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase mb-1.5";

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Duration (Detik)</label>
          <input
            type="text"
            value={currentChannel.duration ?? "-1"}
            onChange={(e) => handleChangeChannelDetail("duration", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Nama Saluran</label>
          <input
            type="text"
            value={currentChannel.name}
            onChange={(e) => handleChangeChannelDetail("name", e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>TVG ID</label>
          <input
            type="text"
            value={currentChannel.tvgId || ""}
            onChange={(e) => handleChangeChannelDetail("tvgId", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>URL Logo Ikon</label>
          <input
            type="text"
            value={currentChannel.logo}
            onChange={(e) => handleChangeChannelDetail("logo", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Nama Grup Kategori</label>
          <input
            type="text"
            value={currentChannel.group}
            onChange={(e) => handleChangeChannelDetail("group", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Tipe Lisensi (License Type)</label>
          <input
            type="text"
            value={currentChannel.licenseType || ""}
            onChange={(e) => handleChangeChannelDetail("licenseType", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Kunci Lisensi (License Key)</label>
          <input
            type="text"
            value={currentChannel.licenseKey || ""}
            onChange={(e) => handleChangeChannelDetail("licenseKey", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>HTTP Referer</label>
          <input
            type="text"
            value={currentChannel.referer || ""}
            onChange={(e) => handleChangeChannelDetail("referer", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>URL Streaming Aliran</label>
        <input
          type="text"
          value={currentChannel.url}
          onChange={(e) => handleChangeChannelDetail("url", e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex gap-3 mt-2">
        {isEditingExisting && (
          <button
            onClick={handleDeleteChannel}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/30 border border-red-100 dark:border-red-900/30 px-4 py-3 rounded-xl shadow-sm active:scale-[0.99] transition-all font-bold text-xs sm:text-sm cursor-pointer"
          >
            Hapus
          </button>
        )}
        <button
          onClick={handleSaveChanges}
          className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-md shadow-blue-500/10 active:scale-[0.99] transition-all font-bold text-xs sm:text-sm cursor-pointer"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
});

ModalContent.displayName = "ModalContent";

function isM3UContent(content: string): boolean {
  return content.includes("#EXTM3U") || content.includes("#EXTINF");
}

function extractM3UFromText(content: string): string {
  if (isM3UContent(content)) return content;
  const m3uMatch = content.match(/(?:^|\n)(#EXTM3U[\s\S]*)/);
  return m3uMatch ? m3uMatch[1] : content;
}

function parseChannels(content: string): Channel[] {
  const m3uContent = extractM3UFromText(content);
  const parsedChannels = parseM3U(m3uContent);
  if (!parsedChannels || parsedChannels.length === 0) {
    throw new Error("Format berkas playlist tidak valid.");
  }
  return parsedChannels.filter(
    (channel, index, self) =>
      index === self.findIndex((c) => c.url === channel.url && c.name === channel.name)
  );
}

async function fetchM3UFromUrl(url: string): Promise<string> {
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url.trim())}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Server merespon dengan status: ${response.status}`);
  }
  return await response.text();
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parsing, setParsing] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showMobileGroups, setShowMobileGroups] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Tabbed interface state for Upload
  const [activeUploadTab, setActiveUploadTab] = useState<"file" | "url">("file");

  // Video preview player state
  const [activePlayChannel, setActivePlayChannel] = useState<Channel | null>(null);
  const [playError, setPlayError] = useState(false);

  const [sessionRestored, setSessionRestored] = useState(false);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Restore session on mount
    const restoreSession = async () => {
      try {
        setParsing(true);
        const savedChannels = await get('m3u_channels');
        const savedFileName = await get('m3u_fileName');
        const savedUrlInput = await get('m3u_urlInput');
        
        if (savedChannels && Array.isArray(savedChannels) && savedChannels.length > 0) {
          setChannels(savedChannels);
          if (savedFileName) setFileName(savedFileName);
          if (savedUrlInput) setUrlInput(savedUrlInput);
          setStatusMessage("Sesi sebelumnya berhasil dipulihkan.");
        }
      } catch (err) {
        console.error("Gagal memulihkan sesi:", err);
      } finally {
        setParsing(false);
        setSessionRestored(true);
      }
    };
    restoreSession();
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Save session when state changes, but ONLY after initial restore is complete
  useEffect(() => {
    if (sessionRestored) {
      if (channels.length > 0) {
        set('m3u_channels', channels).catch(console.error);
        set('m3u_fileName', fileName).catch(console.error);
        set('m3u_urlInput', urlInput).catch(console.error);
      } else {
        del('m3u_channels').catch(console.error);
        del('m3u_fileName').catch(console.error);
        del('m3u_urlInput').catch(console.error);
      }
    }
  }, [channels, fileName, urlInput, sessionRestored]);

  // Reset playback errors when active channel changes
  useEffect(() => {
    setPlayError(false);
  }, [activePlayChannel?.url]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    if (uploadedFile.size > 50 * 1024 * 1024) {
      setError("Ukuran berkas melebihi batas 50MB. Harap bagi daftar putar Anda.");
      return;
    }

    setFileName(uploadedFile.name);
    setError(null);
    setSearchTerm("");
    const reader = new FileReader();
    
    reader.onloadstart = () => {
      setStatusMessage("Membaca berkas lokal...");
      setParsing(true);
    };

    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        if (!isM3UContent(content)) {
          throw new Error("Berkas tidak mengandung penanda valid #EXTM3U.");
        }
        const uniqueChannels = parseChannels(content);
        setChannels(uniqueChannels);
        setSelectedGroup(null);
        setStatusMessage(`Berhasil memuat ${uniqueChannels.length} saluran.`);
      } catch (err: any) {
        setError(err?.message || "Format struktur berkas M3U tidak valid.");
        setFileName("");
      } finally {
        setParsing(false);
      }
    };

    reader.onerror = () => {
      setError("Gagal memproses pembacaan berkas pada sistem.");
      setParsing(false);
    };
    reader.readAsText(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/*': ['.m3u', '.m3u8'] },
    maxFiles: 1,
    onDrop,
  });

  const handleUrlSubmit = useCallback(async () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl || !trimmedUrl.startsWith("http")) {
      setError("Masukkan endpoint URL web protokol yang aman (http/https).");
      return;
    }

    setLoading(true);
    setError(null);
    setParsing(true);
    setStatusMessage("Menghubungkan ke playlist stream...");

    try {
      const content = await fetchM3UFromUrl(trimmedUrl);
      if (!content.trim()) throw new Error("Menerima konten kosong.");

      const urlParts = trimmedUrl.split('/');
      const urlFileName = urlParts[urlParts.length - 1].split('?')[0];
      setFileName(urlFileName || "shared_playlist.m3u");

      const uniqueChannels = parseChannels(content);
      setChannels(uniqueChannels);
      setSelectedGroup(null);
      setStatusMessage(`Berhasil mensinkronisasi ${uniqueChannels.length} saluran.`);
    } catch (err: any) {
      setError(err?.message || "Gagal mengambil data playlist dari tautan web.");
    } finally {
      setLoading(false);
      setParsing(false);
    }
  }, [urlInput]);

  const handleEditClick = useCallback((channel: Channel, index: number) => {
    setEditingIndex(index);
    setCurrentChannel({ ...channel });
    setModalOpen(true);
  }, []);

  const handleAddNewChannel = useCallback(() => {
    setEditingIndex(-1); // -1 signifies a new channel
    setCurrentChannel({
      name: "Saluran Baru",
      url: "",
      logo: "",
      group: "Uncategorized",
      duration: "-1",
      extinf: ""
    });
    setModalOpen(true);
  }, []);

  const handlePlayClick = useCallback((channel: Channel) => {
    setActivePlayChannel(channel);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setCurrentChannel(null);
    setEditingIndex(null);
  }, []);

  const handleChangeChannelDetail = useCallback((key: keyof Channel, value: string) => {
    setCurrentChannel((prev) => prev ? { ...prev, [key]: value } : null);
  }, []);

  const handleSaveChanges = useCallback(() => {
    if (!currentChannel) return;
    if (editingIndex === -1) {
      setChannels((prev) => [...prev, currentChannel]);
      setStatusMessage("Berhasil menambahkan saluran baru.");
    } else if (editingIndex !== null) {
      setChannels((prev) => {
        const updated = [...prev];
        updated[editingIndex] = currentChannel;
        return updated;
      });
      // Update active player details if currently previewed
      if (activePlayChannel && activePlayChannel.url === currentChannel.url) {
        setActivePlayChannel(currentChannel);
      }
      setStatusMessage("Detail saluran berhasil disimpan.");
    }
    handleModalClose();
  }, [currentChannel, editingIndex, activePlayChannel, handleModalClose]);

  const handleDeleteChannel = useCallback(() => {
    if (editingIndex !== null && editingIndex !== -1) {
      setChannels(prev => {
        const newChannels = [...prev];
        newChannels.splice(editingIndex, 1);
        return newChannels;
      });
      
      // If deleting the active channel, close the player
      if (activePlayChannel && currentChannel && activePlayChannel.url === currentChannel.url) {
        setActivePlayChannel(null);
      }
      
      setStatusMessage("Saluran berhasil dihapus.");
      handleModalClose();
    }
  }, [editingIndex, currentChannel, activePlayChannel, handleModalClose]);

  const handleDownload = useCallback(() => {
    try {
      const m3uContent = generateM3U(channels);
      const blob = new Blob([m3uContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName || "synchronized_playlist.m3u";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError("Kesalahan fatal saat mengencode format berkas M3U.");
    }
  }, [channels, fileName]);

  const handleLoadDemo = useCallback(() => {
    setParsing(true);
    setStatusMessage("Memuat saluran playlist demo...");
    
    const demoM3UText = `#EXTM3U

#EXTINF:-1 tvg-id="NASA.TV" tvg-logo="https://raw.githubusercontent.com/chesko21/smart_tv/master/assets/images/maskable.png" group-title="Science & Space",NASA TV Live Stream
https://ntvlive.nasa.gov/hls/live.m3u8

#EXTINF:-1 tvg-id="France24.EN" tvg-logo="https://static.france24.com/meta_default_image.png" group-title="News Channels",France 24 English HD
https://static.france24.com/media/session/FR24_EN_LO_HLS/live_hd.m3u8

#EXTINF:-1 tvg-id="RedBullTV.EN" tvg-logo="https://img.redbull.com/images/w_220/q_auto,f_auto/redbullcom/2020/4/22/t2nptj2yujrctk1g8b8t/red-bull-tv-logo" group-title="Sports & Action",Red Bull TV Live
https://rbmn-live.akamaized.net/hls/live/590964/RBMN-GENERIC-IND/master.m3u8`;

    setTimeout(() => {
      try {
        const uniqueChannels = parseChannels(demoM3UText);
        setChannels(uniqueChannels);
        setFileName("demo_playlist.m3u");
        setSelectedGroup(null);
        setError(null);
        setStatusMessage("Berhasil memuat 3 saluran demo publik.");
      } catch (err: any) {
        setError("Gagal memproses data demo.");
      } finally {
        setParsing(false);
      }
    }, 800);
  }, []);

  const handleClearPlaylist = useCallback(() => {
    setChannels([]);
    setFileName("");
    setUrlInput("");
    setError(null);
    setSelectedGroup(null);
    setActivePlayChannel(null);
    setStatusMessage("Daftar saluran dibersihkan.");
  }, []);

  const filteredChannels = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return channels;
    const term = debouncedSearchTerm.toLowerCase();
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.group && c.group.toLowerCase().includes(term)) ||
        (c.tvgId && c.tvgId.toLowerCase().includes(term))
    );
  }, [channels, debouncedSearchTerm]);

  const groupedChannels = useMemo(() => {
    const acc: Record<string, Channel[]> = {};
    for (let i = 0; i < filteredChannels.length; i++) {
      const c = filteredChannels[i];
      const g = c.group || "Ungrouped";
      if (!acc[g]) acc[g] = [];
      acc[g].push(c);
    }
    return acc;
  }, [filteredChannels]);

  const groupNames = useMemo(() => Object.keys(groupedChannels).sort(), [groupedChannels]);

  const handleGroupSelect = useCallback((group: string | null) => {
    setSelectedGroup(group);
    setShowMobileGroups(false);
  }, []);

  const currentChannels = useMemo(() => {
    if (!selectedGroup) return filteredChannels;
    return groupedChannels[selectedGroup] || [];
  }, [selectedGroup, filteredChannels, groupedChannels]);

  if (!mounted) return <div className="p-6"><SkeletonLoader variant="channel" /></div>;

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-[#f8fafc] dark:bg-[#0b0f19]">
      {/* Messages banner */}
      {(error || statusMessage) && (
        <div className="px-4 lg:px-6 pt-4 flex flex-col gap-2 flex-shrink-0 bg-white dark:bg-gray-900">
          {error && (
            <div className="p-3.5 bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-2xl flex items-center justify-between gap-3 animate-fade-in shadow-xs">
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-bold text-xs">
                <FontAwesomeIcon icon={faExclamationTriangle} className="flex-shrink-0 text-sm" />
                <p>{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 cursor-pointer">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center justify-between gap-2.5 text-blue-600 dark:text-blue-400 text-xs font-bold animate-fade-in shadow-xs">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 text-sm" />
                <p>{statusMessage}</p>
              </div>
              <button onClick={() => setStatusMessage("")} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 p-1 cursor-pointer">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Top Header Control Area (Visible only when list is populated) */}
      {channels.length > 0 && (
        <div className="w-full p-4 lg:px-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 flex flex-col">
              <span className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">File Active</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[160px] sm:max-w-[240px]" title={fileName}>
                {fileName}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100/30 dark:border-blue-900/20 flex flex-col">
              <span className="text-[9px] uppercase font-extrabold text-blue-500 tracking-wider">Total Streams</span>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">{channels.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-grow sm:w-64 max-w-sm">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Cari saluran atau grup..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9! pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all text-xs font-semibold"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                </button>
              )}
            </div>

            {/* Add Channel Button */}
            <button
              onClick={handleAddNewChannel}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Tambah Saluran</span>
            </button>

            {/* Export Button */}
            <button
              onClick={handleDownload}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Ekspor M3U</span>
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClearPlaylist}
              className="bg-red-50 dark:bg-red-950/20 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 text-red-600 px-3.5 py-2 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-1.5 border border-red-100/50 dark:border-red-900/30 active:scale-98 cursor-pointer"
              title="Tutup playlist aktif"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              <span>Mulai Ulang</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Frame Section */}
      {parsing ? (
        <div className="flex-1 p-6 bg-[#f8fafc] dark:bg-slate-950/20"><SkeletonLoader variant="channel" /></div>
      ) : channels.length > 0 ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative w-full h-full">
          {isMobile && (
            <>
              <button
                className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-xl active:scale-95 transition-transform cursor-pointer"
                onClick={() => setShowMobileGroups(!showMobileGroups)}
                aria-label="Toggle Category Groupings Overlay"
              >
                <FontAwesomeIcon icon={showMobileGroups ? faChevronLeft : faBars} className="w-4 h-4" />
              </button>
              {showMobileGroups && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" onClick={() => setShowMobileGroups(false)} />
              )}
            </>
          )}

          {/* Left Category Navigation Sidebar */}
          <div
            className={`${
              isMobile ? showMobileGroups ? 'translate-x-0' : '-translate-x-full' : 'translate-x-0'
            } fixed lg:static top-0 left-0 z-50 lg:z-auto h-full w-64 xl:w-72 flex-shrink-0 p-4 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800/80 transition-transform duration-250 ease-in-out shadow-xl lg:shadow-none`}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50 dark:border-gray-800">
              <div>
                <h2 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 tracking-widest uppercase">Grup Kategori</h2>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{groupNames.length} kategori terdeteksi</p>
              </div>
              {isMobile && (
                <button onClick={() => setShowMobileGroups(false)} className="p-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-pointer">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                    selectedGroup === null
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 border border-transparent"
                  }`}
                  onClick={() => handleGroupSelect(null)}
                >
                  <span className="truncate">Semua Saluran</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold ${selectedGroup === null ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                    {filteredChannels.length}
                  </span>
                </button>
              </li>
              {groupNames.map((group) => {
                const isSelected = selectedGroup === group;
                return (
                  <li key={group}>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 border border-transparent"
                      }`}
                      onClick={() => handleGroupSelect(group)}
                    >
                      <span className="truncate">{group}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold ${isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                        {groupedChannels[group].length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Middle Content Grid */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#f8fafc] dark:bg-[#0b0f19]/40 flex flex-col">
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {selectedGroup ? selectedGroup : 'Semua Saluran Terbaca'}
              </h2>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                Menampilkan {currentChannels.length} dari {filteredChannels.length} saluran hasil filter
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {currentChannels.map((channel, idx) => (
                <ChannelItem
                  key={`${channel.url}-${idx}`}
                  channel={channel}
                  index={channels.findIndex(c => c.url === channel.url && c.name === channel.name)}
                  isActive={activePlayChannel?.url === channel.url && activePlayChannel?.name === channel.name}
                  onEditClick={handleEditClick}
                  onPlayClick={handlePlayClick}
                />
              ))}
            </div>
            
            {currentChannels.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-xs gap-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 p-6 shadow-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300">Tidak ada saluran yang cocok dengan pencarian Anda</span>
                <button onClick={() => setSearchTerm("")} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">Reset Pencarian</button>
              </div>
            )}
          </div>

          {/* Live Preview Panel Sidebar / Bottom Sheet */}
          {activePlayChannel && (
            <>
              {/* Mobile Backdrop */}
              <div 
                className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity" 
                onClick={() => setActivePlayChannel(null)} 
              />
              
              <div className="fixed bottom-0 left-0 right-0 lg:static w-full lg:w-96 bg-white dark:bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-800/80 flex flex-col h-[65vh] lg:h-full flex-shrink-0 animate-slide-in-top lg:animate-slide-in-right shadow-[0_-20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.5)] lg:shadow-xl z-50 lg:z-10 rounded-t-3xl lg:rounded-none transition-transform duration-300">
                
                {/* Mobile Drag Handle Indicator */}
                <div className="lg:hidden w-full flex justify-center pt-3 pb-1">
                  <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="p-4 pt-2 lg:pt-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 rounded-t-3xl lg:rounded-none">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FontAwesomeIcon icon={faTv} className="text-xs" />
                    </div>
                    <span className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Stream Preview</span>
                  </div>
                  <button 
                    onClick={() => setActivePlayChannel(null)} 
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    aria-label="Tutup pemutar"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* Player Wrapper */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden relative shadow-inner group border border-gray-100 dark:border-gray-800">
                  <ReactPlayer
                    url={activePlayChannel.url}
                    controls
                    playing
                    width="100%"
                    height="100%"
                    config={{
                      file: {
                        forceHLS: activePlayChannel.url.toLowerCase().includes('.m3u8'),
                        forceDASH: activePlayChannel.url.toLowerCase().includes('.mpd'),
                        attributes: {
                          crossOrigin: "anonymous"
                        }
                      }
                    }}
                    onError={() => {
                      setPlayError(true);
                    }}
                    onPlay={() => setPlayError(false)}
                  />
                  {playError && (
                    <div className="absolute inset-0 bg-gray-950/95 flex flex-col items-center justify-center p-6 text-center text-xs">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 text-lg mb-2" />
                      <p className="text-gray-200 font-bold mb-1">Gagal memuat tayangan</p>
                      <p className="text-gray-400 text-[10px] leading-relaxed max-w-[240px]">
                        Tautan stream mungkin kedaluwarsa, tidak aktif, atau terblokir oleh keamanan browser (CORS).
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Channel Details */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    {activePlayChannel.logo && (
                      <div className="w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-1 flex-shrink-0">
                        <img 
                          src={activePlayChannel.logo} 
                          alt="" 
                          className="w-full h-full object-contain"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-extrabold text-blue-500 tracking-wider bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/30">
                        {activePlayChannel.group || "Uncategorized"}
                      </span>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1.5 truncate leading-snug">{activePlayChannel.name}</h3>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Stream URL</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={activePlayChannel.url} 
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-xl font-mono text-[9px] text-gray-500 dark:text-gray-400 focus:outline-none cursor-text select-all"
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(activePlayChannel, channels.findIndex(c => c.url === activePlayChannel.url && c.name === activePlayChannel.name))}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 font-bold py-2 rounded-xl text-xs border border-gray-100 dark:border-gray-700/50 transition-all text-center cursor-pointer"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
          )}
        </div>
      ) : (
        /* Empty / Hero Landing Page Redesign */
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-[#f8fafc] dark:bg-[#0b0f19]/40 overflow-y-auto">
          <div className="w-full max-w-md flex flex-col gap-6 my-auto">
            {/* Header Hero Section */}
            <div className="text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
                <FontAwesomeIcon icon={faTv} className="text-xl" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Kelola IPTV Playlist Anda Secara Instan
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium leading-relaxed">
                M3U StreamEditor Pro adalah alat berbasis klien untuk merapikan, mengedit, dan memutar pratinjau daftar putar M3U Anda dengan cepat dan aman.
              </p>
            </div>

            {/* Tabbed Action Card Container */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl shadow-xl overflow-hidden glass-panel">
              {/* Tab Selector Header */}
              <div className="flex border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-950/20 p-1.5 gap-1">
                <button
                  onClick={() => { setActiveUploadTab("file"); setError(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                    activeUploadTab === "file"
                      ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs border border-gray-100 dark:border-gray-700/50"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/20"
                  }`}
                >
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                  Unggah Berkas M3U
                </button>
                <button
                  onClick={() => { setActiveUploadTab("url"); setError(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                    activeUploadTab === "url"
                      ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs border border-gray-100 dark:border-gray-700/50"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/20"
                  }`}
                >
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  Sinkron Tautan URL
                </button>
              </div>

              {/* Tab Content Panel */}
              <div className="p-6">
                {activeUploadTab === "file" ? (
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer w-full py-10 px-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                      isDragActive 
                        ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-blue-500/40 hover:bg-gray-50/50 dark:hover:bg-gray-800/20'
                    }`}
                  >
                    <input {...getInputProps()} aria-label="Upload playlist container" />
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mb-3">
                      <FontAwesomeIcon icon={faUpload} />
                    </div>
                    <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Klik untuk memilih atau seret berkas ke sini
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                      Mendukung format berkas .m3u dan .m3u8 (Maksimal 50MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <FontAwesomeIcon icon={faLink} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="text"
                        placeholder="Masukkan URL playlist streaming IPTV (.m3u/.m3u8)..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full pl-9! pr-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all text-xs font-semibold"
                      />
                    </div>
                    <button
                      onClick={handleUrlSubmit}
                      disabled={loading || !urlInput.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold transition-all text-xs shadow-md shadow-blue-500/10 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:shadow-none active:scale-[0.99] cursor-pointer"
                    >
                      {loading ? "Menghubungkan..." : "Sinkronisasi Tautan"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Load Demo Feature */}
            <div className="text-center animate-fade-in delay-200">
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold mb-2">Belum Memiliki Playlist?</p>
              <button
                onClick={handleLoadDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 border border-blue-100/50 dark:border-blue-900/30 shadow-xs hover:shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                <span>Coba Dengan Playlist Demo (Instan)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal Window Container */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        title={editingIndex === -1 ? "Tambah Saluran IPTV Baru" : "Edit Parameter Saluran"}
        subtitle={editingIndex === -1 ? "Masukkan detail streaming saluran baru untuk ditambahkan" : "Modifikasi detail parameter meta saluran yang dipilih"}
      >
        <ModalContent
          currentChannel={currentChannel}
          handleChangeChannelDetail={handleChangeChannelDetail}
          handleSaveChanges={handleSaveChanges}
          handleDeleteChannel={handleDeleteChannel}
          isEditingExisting={editingIndex !== null && editingIndex !== -1}
        />
      </Modal>
    </div>
  );
}