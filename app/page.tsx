"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useDropzone } from 'react-dropzone';
import { parseM3U, generateM3U, Channel } from "../lib/m3uParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload, faLink } from "@fortawesome/free-solid-svg-icons";
import SkeletonLoader from "../components/SkeletonLoader";
import Modal from "../components/Modal";

// Define interfaces
interface ChannelItemProps {
  channel: Channel;
  onEditClick: (channel: Channel) => void;
}

interface ModalContentProps {
  currentChannel: Channel | null;
  handleChangeChannelDetail: (key: keyof Channel, value: string) => void;
  handleSaveChanges: () => void;
}

// ChannelItem component
const ChannelItem = memo(({ channel, onEditClick }: ChannelItemProps) => {

  const displayName = channel.name.length > 8 ? `${channel.name.slice(0, 10)}...` : channel.name;

  return (
    <div className="flex flex-col items-center p-2 border border-gray-300 rounded shadow">
      {channel.logo ? (
        <img
          src={channel.logo}
          alt={channel.name}
          className="h-20 w-20 object-cover mb-2"
          loading="lazy"
        />
      ) : (
        <div className="h-20 w-20 bg-gray-300 flex items-center justify-center mb-2">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <span className="text-center font-bold">{displayName}</span>
      <button onClick={() => onEditClick(channel)} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-md">
        Edit
      </button>
    </div>
  );
});

// ModalContent component
const ModalContent = memo(({ currentChannel, handleChangeChannelDetail, handleSaveChanges }: ModalContentProps) => {
  if (!currentChannel) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Duration</label>
        <input
          type="text"
          value={currentChannel.duration ?? "-1"}
          onChange={(e) => handleChangeChannelDetail("duration", e.target.value)}
          className="border p-1 w-full rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Channel Name</label>
        <input
          type="text"
          value={currentChannel.name}
          onChange={(e) => handleChangeChannelDetail("name", e.target.value)}
          className="border p-1 w-full rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">TVG ID</label>
        <input
          type="text"
          value={currentChannel.tvgId || ""}
          onChange={(e) => handleChangeChannelDetail("tvgId", e.target.value)}
          className="border p-1 w-full rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">TVG Logo</label>
        <input
          type="text"
          value={currentChannel.logo}
          onChange={(e) => handleChangeChannelDetail("logo", e.target.value)}
          className="border p-1 w-full rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Group Title</label>
        <input
          type="text"
          value={currentChannel.group}
          onChange={(e) => handleChangeChannelDetail("group", e.target.value)}
          className="border p-1 w-full rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">License Type</label>
        <input
          type="text"
          value={currentChannel.licenseType || ""}
          onChange={(e) => handleChangeChannelDetail("licenseType", e.target.value)}
          className="border p-1 w-full rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">License Key</label>
        <input
          type="text"
          value={currentChannel.licenseKey || ""}
          onChange={(e) => handleChangeChannelDetail("licenseKey", e.target.value)}
          className="border p-1 w-full rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">HTTP Referer</label>
        <input
          type="text"
          value={currentChannel.referer || ""}
          onChange={(e) => handleChangeChannelDetail("referer", e.target.value)}
          className="border p-1 w-full rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stream URL</label>
        <input
          type="text"
          value={currentChannel.url}
          onChange={(e) => handleChangeChannelDetail("url", e.target.value)}
          className="border p-1 w-full rounded-md"
        />
      </div>

      <button
        onClick={handleSaveChanges}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Save Changes
      </button>
    </div>
  );
});

// Main Page component
export default function Page() {
  const [channels, setChannels] = useState < Channel[] > ([]);
  const [fileName, setFileName] = useState < string > ("");
  const [urlInput, setUrlInput] = useState < string > ("");
  const [error, setError] = useState < string | null > (null);
  const [loading, setLoading] = useState < boolean > (false);
  const [parsing, setParsing] = useState < boolean > (false);

  const [isModalOpen, setModalOpen] = useState < boolean > (false);
  const [currentChannel, setCurrentChannel] = useState < Channel | null > (null);

  const [selectedGroup, setSelectedGroup] = useState < string | null > (null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    console.log("File selected:", uploadedFile.name);

    const reader = new FileReader();
    reader.onloadstart = () => {
      console.log("Reading file...");
      setParsing(true);
    };
    reader.onload = (e) => {
      const content = e.target?.result as string;
      console.log("File content:", content);
      try {
        const parsedChannels = parseM3U(content);
        const uniqueChannels = parsedChannels.filter(
          (channel, index, self) =>
            index === self.findIndex((c) => c.tvgId === channel.tvgId && c.url === channel.url)
        );
        setChannels(uniqueChannels);
        setError(null);
      } catch (error) {
        setError("Invalid M3U file format");
      } finally {
        setParsing(false);
      }
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
      setError("Failed to read file");
      setParsing(false);
    };
    reader.readAsText(uploadedFile);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/plain': ['.m3u'],
    },
    onDrop,
  });

  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setParsing(true);

    try {
      const response = await fetch(urlInput);
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const content = await response.text();
      if (!content) throw new Error("No content received from the URL");
      const parsedChannels = parseM3U(content);
      const uniqueChannels = parsedChannels.filter(
        (channel, index, self) =>
          index === self.findIndex((c) => c.tvgId === channel.tvgId && c.url === channel.url)
      );
      setChannels(uniqueChannels);
      setFileName("playlist_from_url.m3u");
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch M3U file from URL: ${err.message}`);
      } else {
        setError("Failed to fetch M3U file from URL: An unknown error occurred.");
      }
    } finally {
      setLoading(false);
      setParsing(false);
    }
  }, [urlInput]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleUrlSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUrlSubmit]);

  const handleEditClick = useCallback((channel: Channel) => {
    setCurrentChannel({ ...channel });
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setCurrentChannel(null);
  }, []);

  const handleChangeChannelDetail = useCallback((key: keyof Channel, value: string) => {
    setCurrentChannel((prev) => prev ? { ...prev, [key]: value } : null);
  }, []);

  const handleSaveChanges = useCallback(() => {
    if (currentChannel) {
      setChannels((prevChannels) =>
        prevChannels.map((channel) =>
          channel.tvgId === currentChannel.tvgId ? { ...currentChannel } : channel
        )
      );
      handleModalClose();
    }
  }, [currentChannel, handleModalClose]);

  const handleDownload = useCallback(() => {
    try {
      const m3uContent = generateM3U(channels);
      const blob = new Blob([m3uContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName || "playlist.m3u";
      link.click();
    } catch (error) {
      setError("Failed to generate M3U file");
    }
  }, [channels, fileName]);

  const groupedChannels = useMemo(() => {
    return channels.reduce((acc, channel) => {
      const group = channel.group || "Ungrouped";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(channel);
      return acc;
    }, {} as Record<string, Channel[]>);
  }, [channels]);

  const groupNames = useMemo(() => Object.keys(groupedChannels), [groupedChannels]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-white shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">M3U Playlist Manager</h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div
            {...getRootProps()}
            className="cursor-pointer inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md  shadow hover:bg-blue-700 transition"
          >
            <input {...getInputProps()} aria-label="Upload M3U file" />
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Choose M3U File
          </div>

          <div className="flex-grow">
            <input
              type="text"
              placeholder="Enter M3U URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="M3U URL input"
            />
          </div>

          <button
            onClick={handleUrlSubmit}
            className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition ${loading ? "cursor-not-allowed opacity-75" : ""
              }`}
            aria-label="Load M3U from URL"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            {loading ? "Loading..." : "Load"}
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white w-full md:w-auto px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={channels.length === 0}
            aria-label="Download M3U file"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download M3U
          </button>
        </div>

        {parsing && (
          <div className="mb-4 text-blue-500 text-center">
            <p>Loading and parsing channels, please wait...</p>
          </div>
        )}
      </div>

      {loading || parsing ? (
        <SkeletonLoader />
      ) : channels.length > 0 ? (
        <div className="flex-1 flex">
          <div className="w-1/4 p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Groups</h2>
            <ul>
              {groupNames.map((group) => (
                <li
                  key={group}
                  className={`p-2 cursor-pointer ${selectedGroup === group
                      ? "bg-blue-600"
                      : "hover:bg-blue-800"
                    } rounded-md transition-colors`}
                  onClick={() => setSelectedGroup(group)}
                >
                  {group}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-r border-gray-300"></div>

          <div className="w-3/4 p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Channels</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {selectedGroup && groupedChannels[selectedGroup]?.map((channel, index) => (
                <ChannelItem
                  key={`${channel.tvgId || 'no-tvgId'}-${channel.url || 'no-url'}-${index}`}
                  channel={channel}
                  onEditClick={handleEditClick}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-500">No channels available.</span>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Edit Channel Details">
        <ModalContent
          currentChannel={currentChannel}
          handleChangeChannelDetail={handleChangeChannelDetail}
          handleSaveChanges={handleSaveChanges}
        />
      </Modal>
    </div>
  );
}