import React, { useState, useEffect, useRef } from "react";
import { initAuth, googleSignIn, logout } from "../lib/firebase";
import { User } from "firebase/auth";
import { 
  Folder, 
  Search, 
  UploadCloud, 
  Trash2, 
  LogOut, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  FileCode, 
  File, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  Lock
} from "lucide-react";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
  webViewLink?: string;
}

export default function GoogleDriveTerminal() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, cachedToken) => {
        setUser(currentUser);
        setToken(cachedToken);
        setNeedsAuth(false);
        fetchFiles(cachedToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files from Google Drive
  const fetchFiles = async (accessToken: string, query = "") => {
    setIsLoadingFiles(true);
    setErrorMessage("");
    try {
      let url = "https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,size,iconLink,webViewLink)";
      if (query) {
        url += `&q=name+contains+'${encodeURIComponent(query)}'+and+trashed+=+false`;
      } else {
        url += "&q=trashed+=+false";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          handleLogout();
          throw new Error("Session expired. Please sign in again.");
        }
        throw new Error("Failed to load Google Drive files.");
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred while loading files.");
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage("");
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        fetchFiles(result.accessToken);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage("Authentication failed or cancelled.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setFiles([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      fetchFiles(token, searchQuery);
    }
  };

  // Upload file routine
  const uploadFileToDrive = async (file: File) => {
    if (!token) return;
    setUploadProgress("uploading");
    try {
      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", file);

      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      setUploadProgress("success");
      setTimeout(() => setUploadProgress("idle"), 3000);
      fetchFiles(token); // refresh file explorer
    } catch (err: any) {
      console.error(err);
      setUploadProgress("error");
      setErrorMessage(err.message || "Upload failed.");
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFileToDrive(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileToDrive(e.target.files[0]);
    }
  };

  // Safe deletion routine
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!token) return;
    
    // Explicit mandatory confirmation
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}" from your Google Drive? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the file.");
      }

      // Filter deleted file out of local state
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete file.");
    }
  };

  // Format file sizes
  const formatBytes = (bytes?: string) => {
    if (!bytes) return "Unknown size";
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return "Unknown size";
    if (num === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return parseFloat((num / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Determine lucide icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-cyan-400" />;
    if (mimeType.startsWith("video/")) return <Video className="w-5 h-5 text-purple-400" />;
    if (mimeType.startsWith("text/") || mimeType.includes("document") || mimeType.includes("pdf")) {
      return <FileText className="w-5 h-5 text-indigo-400" />;
    }
    if (mimeType.includes("javascript") || mimeType.includes("json") || mimeType.includes("html") || mimeType.includes("css")) {
      return <FileCode className="w-5 h-5 text-emerald-400" />;
    }
    return <File className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="w-full bg-[#0d091a]/85 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl relative select-none">
      
      {/* Dynamic top bar decoration */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500" />
      
      {/* Card Header */}
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
              Secure Cloud Drive Portal
            </h3>
            <p className="font-mono text-[9px] text-white/50 uppercase tracking-widest mt-0.5">
              Live Google Workspace Integration System
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl font-mono text-[10px] text-white/80 w-fit">
            <img 
              src={user.photoURL || undefined} 
              alt={user.displayName || "User"} 
              className="w-5 h-5 rounded-full border border-[#ff4d00]/30"
              referrerPolicy="no-referrer"
            />
            <span className="truncate max-w-[120px] font-bold">{user.displayName}</span>
            <button
              onClick={handleLogout}
              className="p-1 hover:bg-white/10 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer ml-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Panel Content */}
      <div className="p-6">
        
        {needsAuth ? (
          /* Sign-In Request Panel */
          <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
            <div className="p-4 bg-white/5 border border-white/10 rounded-full animate-pulse-soft">
              <Lock className="w-10 h-10 text-cyan-400" />
            </div>
            
            <div className="max-w-md flex flex-col gap-2">
              <h4 className="font-display font-bold text-base text-white uppercase tracking-wider">
                Authentication Required
              </h4>
              <p className="font-sans text-xs text-white/60 leading-relaxed">
                Connect your personal Google Drive account to explore files, search records, or drag-and-drop secure uploads directly to your cloud directory.
              </p>
            </div>

            {/* Official style Sign-In with Google button */}
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="relative flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-sans font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#ff4d00]" />
              ) : (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
              )}
              <span>{isLoggingIn ? "SECURELY LOGGING IN..." : "Sign in with Google"}</span>
            </button>
          </div>
        ) : (
          /* File Explorer Interface */
          <div className="space-y-6">
            
            {/* Top Toolbar: Search + Manual File Upload Button */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <form onSubmit={handleSearch} className="md:col-span-8 flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search folder database..."
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 outline-none rounded-xl py-2.5 pl-10 pr-4 font-mono text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-white font-mono text-xs uppercase px-5 rounded-xl transition-all cursor-pointer"
                >
                  Query
                </button>
              </form>

              {/* Upload Action */}
              <div className="md:col-span-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress === "uploading"}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-mono text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploadProgress === "uploading" ? "Uploading..." : "Upload File"}</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                isDragging
                  ? "border-cyan-400 bg-cyan-500/5"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud className={`w-8 h-8 ${isDragging ? "text-cyan-400 animate-bounce" : "text-white/30"}`} />
                <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Drag and Drop files here to upload instantly
                </p>
                <p className="text-[9px] text-white/30 font-sans">
                  Supports any secure cloud document format
                </p>
              </div>
            </div>

            {/* File List Table / Grid */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
              <div className="bg-white/5 px-4 py-2 flex items-center justify-between font-mono text-[9px] text-white/40 uppercase tracking-widest font-bold border-b border-white/15">
                <span>DIRECTORY RECORDS</span>
                <span>ACTIONS</span>
              </div>

              {isLoadingFiles ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest animate-pulse">Querying Drive Node...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
                  <Folder className="w-8 h-8 text-white/20" />
                  <p className="font-mono text-xs text-white/50 uppercase tracking-wider">No files found</p>
                  <p className="text-[10px] text-white/30 font-sans">Upload your first asset to secure this folder.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getFileIcon(file.mimeType)}
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs text-white font-semibold truncate max-w-[200px] sm:max-w-md">
                            {file.name}
                          </span>
                          <span className="text-[9px] font-mono text-white/40 tracking-wider">
                            {file.mimeType.split("/")[1]?.toUpperCase() || "BIN"} // {formatBytes(file.size)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Open file web link */}
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 border border-white/10 hover:border-cyan-400/40 rounded-lg text-white/60 hover:text-cyan-400 transition-colors"
                            title="Open in Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Safe Delete button */}
                        <button
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          className="p-2 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-lg text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload status messages */}
            {uploadProgress === "success" && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl font-mono text-[10px] text-emerald-400 uppercase tracking-wide">
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                <span>Upload completely compiled and secured.</span>
              </div>
            )}

            {uploadProgress === "error" && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl font-mono text-[10px] text-red-400 uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Upload sequence failed. Try again.</span>
              </div>
            )}
          </div>
        )}

        {/* Localized Error Box */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 p-3 rounded-xl font-mono text-[10px] text-red-400 uppercase">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="leading-normal">{errorMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}

// Simple internal check circle component for ease
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m22 4-10 10.01-3-3" />
    </svg>
  );
}
