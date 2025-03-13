"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { parseM3U, generateM3U, Channel } from "../lib/m3uParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload, faLink } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import SkeletonLoader from "../components/SkeletonLoader"; 

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parsing, setParsing] = useState<boolean>(false);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({
    logo: 100,
    logoUrl: 150,
    name: 150,
    group: 150,
    url: 200,
    referer: 150,
    licenseType: 150,
    licenseKey: 150,
  });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFileName(uploadedFile.name);
    event.target.value = "";

    const reader = new FileReader();
    reader.onloadstart = () => { setParsing(true); };
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        setChannels(parseM3U(content));
        setError(null);
      } catch (error) {
        setError("Invalid M3U file format");
      } finally {
        setParsing(false);
      }
    };
    reader.readAsText(uploadedFile);
  }, []);

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
      if (!response.ok) throw new Error("Network response was not ok");
      const content = await response.text();
      setChannels(parseM3U(content));
      setFileName("playlist_from_url.m3u");
    } catch (err) {
      setError("Failed to fetch M3U file from URL");
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

  const handleChange = useCallback((index: number, key: keyof Channel, value: string) => {
    setChannels((prev) =>
      prev.map((channel, i) => (i === index ? { ...channel, [key]: value } : channel))
    );
  }, []);

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

  // Resize Column Logic
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleResizeStart = (columnKey: string, event: React.MouseEvent) => {
    resizingColumn.current = columnKey;
    startX.current = event.clientX;
    startWidth.current = columnWidths[columnKey];
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResize = (event: MouseEvent) => {
    if (resizingColumn.current) {
      const newWidth = startWidth.current + (event.clientX - startX.current);
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn.current!]: Math.max(50, newWidth),
      }));
    }
  };

  const handleResizeEnd = () => {
    resizingColumn.current = null;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="p-4 bg-white shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-center">M3U Playlist Manager</h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        {/* File Upload and URL Input Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Choose M3U File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".m3u"
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Upload M3U file"
          />

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
            className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition ${
              loading ? "cursor-not-allowed opacity-75" : ""
            }`}
            aria-label="Load M3U from URL"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faLink} className="mr-2" />
            {loading ? "Loading..." : "Load"}
          </button>
        </div>

        {/* Download Button */}
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

        {/* Parsing Indicator */}
        {parsing && (
          <div className="mb-4 text-blue-500 text-center">
            <p>Loading and parsing channels, please wait...</p>
          </div>
        )}
      </div>

      {/* Channel List Table */}
      {loading || parsing ? (
        <SkeletonLoader /> // Tampilkan Skeleton Loader saat loading atau parsing
      ) : channels.length > 0 ? (
        <div className="flex-1 overflow-auto bg-white">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                {["Logo", "Logo URL", "Name", "Group", "URL", "Referer", "License Type", "License Key"].map((header, index) => (
                  <th
                    key={header}
                    className="border p-2 text-left relative"
                    style={{ width: columnWidths[Object.keys(columnWidths)[index]] }}
                  >
                    {header}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-gray-400 hover:bg-gray-600"
                      onMouseDown={(e) => handleResizeStart(Object.keys(columnWidths)[index], e)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((channel, index) => (
                <tr key={index} className="border hover:bg-gray-100 transition">
                  <td className="border p-2" style={{ width: columnWidths.logo }}>
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt="Channel logo"
                        className="h-10 w-10 object-cover border"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="border p-2" style={{ width: columnWidths.logoUrl }}>
                    <input
                      type="text"
                      placeholder="Logo URL"
                      value={channel.logo || ""}
                      onChange={(e) => handleChange(index, "logo", e.target.value)}
                      className="border p-1 w-full rounded-md transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                      data-tip="Edit Logo URL"
                      data-for="tooltip"
                    />
                  </td>
                  <td className="border p-2" style={{ width: columnWidths.name }}>
                    <input
                      type="text"
                      value={channel.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                      className="border p-1 w-full rounded-md transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                      data-tip="Edit Channel Name"
                      data-for="tooltip"
                    />
                  </td>
                  <td className="border p-2" style={{ width: columnWidths.group }}>
                    <input
                      type="text"
                      value={channel.group}
                      onChange={(e) => handleChange(index, "group", e.target.value)}
                      className="border p-1 w-full rounded-md transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                      data-tip="Edit Group"
                      data-for="tooltip"
                    />
                  </td>
                  <td className="border p-2" style={{ width: columnWidths.url }}>
                    <input
                      type="text"
                      value={channel.url}
                      onChange={(e) => handleChange(index, "url", e.target.value)}
                      className="border p-1 w-full rounded-md transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                      data-tip="Edit URL"
                      data-for="tooltip"
                    />
                  </td>
                  <td className="border p-2" style={{ width: columnWidths.referer }}>
                    <input
                      type="text"
                      value={channel.referer || ""}
                      onChange={(e) => handleChange(index, "referer", e.target.value)}
                      className="border p-1 w-full rounded-md transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                      data-tip="Edit Referer"
                      data-for="tooltip"
                    />
                  </td>
                  <td className="border p-2" style={{ width: columnWidths.licenseType }}>
                    <input
                      type="text"
                      placeholder="License Type"
                      value={channel.licenseType || ""}
                      onChange={(e) => handleChange(index, "licenseType", e.target.value)}
                      className="border p-1 w-full rounded-md transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                      data-tip="Edit License Type"
                      data-for="tooltip"
                    />
                  </td>
                  <td className="border p-2" style={{ width: columnWidths.licenseKey }}>
                    <input
                      type="text"
                      placeholder="License Key"
                      value={channel.licenseKey || ""}
                      onChange={(e) => handleChange(index, "licenseKey", e.target.value)}
                      className="border p-1 w-full rounded-md transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                      data-tip="Edit License Key"
                      data-for="tooltip"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Tooltip Component */}
      <Tooltip id="tooltip" place="top" effect="solid">
        masukan konfigurasi anda
      </Tooltip>
    </div>
  );
}