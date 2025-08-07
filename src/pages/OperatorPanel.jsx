

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { io } from "socket.io-client"; // 👈 added

const BASE_URL = import.meta.env.VITE_BASE_URL;


const OperatorPanel = () => {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadingAppId, setUploadingAppId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusCounts, setStatusCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const docLabels = {
    tenthMarksheet: "10th Marksheet",
    tenthCertificate: "10th Certificate",
    twelfthMarksheet: "12th Marksheet",
    twelfthCertificate: "12th Certificate",
    graduationDegree: "Graduation Degree",
    pgCertificate: "PG Certificate",
    domicile: "Domicile Certificate",
    casteValidity: "Caste Validity",
    otherDocument: "Other Document",
  };

  useEffect(() => {
    if (user?.token) {
      fetchApplications();

      // 👇 Setup socket.io connection
      const socket = io(BASE_URL);

      // 👇 Listen to real-time events from backend
      socket.on("applicationUpdated", fetchApplications);
      socket.on("formPdfUploaded", fetchApplications);
      socket.on("applicationRejected", fetchApplications);

      return () => socket.disconnect();
    }
  }, [user?.token]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "refreshApplications" && e.newValue === "true") {
        fetchApplications();
        localStorage.removeItem("refreshApplications");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const apps = res.data.reverse();
      setApplications(apps);
      countStatus(apps);
    } catch (err) {
      console.error("❌ Error fetching apps:", err);
    }
  };

  const countStatus = (apps) => {
    const counts = { All: apps.length };
    apps.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    setStatusCounts(counts);
  };

  const handleFileChange = (e, appId) => {
    setSelectedFiles((prev) => ({ ...prev, [appId]: e.target.files[0] }));
  };

  const handleUpload = async (appId) => {
    const file = selectedFiles[appId];
    if (!file || file.type !== "application/pdf")
      return alert("Please select a valid PDF file");
    try {
      const formData = new FormData();
      formData.append("formPdf", file);
      setUploadingAppId(appId);
      await axios.put(`${BASE_URL}/api/applications/${appId}/upload-pdf`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("PDF uploaded successfully");
      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[appId];
        return updated;
      });
      setUploadingAppId(null);
      fetchApplications();
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed");
      setUploadingAppId(null);
    }
  };

  const handleReject = async (appId) => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason?.trim()) return alert("Rejection reason is required");
    try {
      await axios.put(
        `${BASE_URL}/api/applications/${appId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Application rejected");
      fetchApplications();
    } catch (err) {
      console.error("❌ Reject error:", err);
      alert("Rejection failed");
    }
  };

  const openProfile = async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSelectedProfile(res.data);
      setShowProfileModal(true);
    } catch (err) {
      console.error("❌ Error loading user profile", err);
      alert("Failed to load profile");
    }
  };

  const closeProfile = () => {
    setSelectedProfile(null);
    setShowProfileModal(false);
  };

  const handleDownloadAllDocs = async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/applications/${userId}/download-all`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(res.data.message || "Documents downloaded successfully");
    } catch (err) {
      console.error("❌ Download all docs failed:", err);
      alert("Failed to download all documents");
    }
  };

  const handleDeleteDoc = async (fieldName) => {
    if (!window.confirm(`Are you sure you want to delete ${docLabels[fieldName]}?`)) return;
    try {
      const res = await axios.delete(
        `${BASE_URL}/api/users/profile/document/${selectedProfile._id}/${fieldName}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setSelectedProfile(res.data.user);
      alert(`${docLabels[fieldName]} deleted successfully.`);
      fetchApplications();
    } catch (err) {
      console.error("❌ Delete document failed:", err);
      alert("Failed to delete document.");
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/files/${filename}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download file.");
    }
  };

  const statusOptions = [
    "All",
    // "Pending",
    "Submitted",
    "In Review",
    "Pending Confirmation",
    "Confirmed",
    "Completed",
    "Rejected",
  ];

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      app.user?.name?.toLowerCase().includes(searchLower) ||
      app.user?.mobile?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // ... rest of your UI code remains unchanged
  // ✅ Layout, modal, buttons, download, view, delete logic – untouched

  return (
   <div className="max-w-7xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-16">
      <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 flex items-center gap-2">
        👨‍💻 <span>Operator Panel</span>
        
        </h2>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or mobile"
          className="px-4 py-2 border rounded-md w-64 focus:ring-2 focus:ring-indigo-400 outline-none transition-all shadow-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-md border font-medium text-sm transition-all duration-300 ${
            statusFilter === status
              ? "bg-indigo-600 text-white border-indigo-600 shadow"
              : "bg-white text-indigo-600 border-indigo-400 hover:bg-indigo-50"
          }`}
            >
              {status} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <p className="text-gray-500 text-base">No applications found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-indigo-50 text-indigo-800 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 border">Applicant</th>
                <th className="px-4 py-3 border">Service</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">User Profile</th>
                <th className="px-4 py-3 border">Upload Dummy Form</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-all">
                  <td className="px-4 py-3 border">
                    {app.user?.name}
                    <br />
                    <span className="text-xs text-gray-500">{app.user?.mobile}</span>
                  </td>
                  <td className="px-4 py-3 border">{app.service?.name}</td>
                  <td className="px-4 py-3 border">{app.status}</td>
                  <td className="px-4 py-3 border">
                    <button
                      onClick={() => openProfile(app.user?._id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm w-full mb-1 transition"
                    >
                      View Profile
                    </button>
                    <button
                          onClick={() => handleDownloadAllDocs(app.user?._id)}
                             className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm w-full transition"
                                  >
                                     Download All Docs
                             </button>

                  </td>
                  <td className="px-4 py-3 border space-y-2">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e, app._id)}
                        className="block w-full text-sm text-gray-700 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition"
                      
                    />
                    <button
                      onClick={() => handleUpload(app._id)}
                      disabled={uploadingAppId === app._id || !selectedFiles[app._id]}
                      className={`px-3 py-1 rounded w-full text-sm ${
                    uploadingAppId === app._id || !selectedFiles[app._id]
                      ? "bg-indigo-300 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  }`}
                    >
                      {uploadingAppId === app._id ? "Uploading..." : "Upload"}
                    </button>
                  </td>
                  <td className="px-4 py-3 border space-y-1 text-center">
                    {app.status !== "Confirmed" && app.status !== "Rejected" && (
                      <button
                        onClick={() => handleReject(app._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 w-full text-sm transition"
                      >
                        Reject
                      </button>
                    )}
                    {app.rejectReason && (
                      <div className="text-red-600 text-xs">
                        <b>Reason:</b> {app.rejectReason}
                      </div>
                    )}
                    {app.correctionComment && (
                      <div className="text-red-600 text-xs">
                        <b>Correction:</b> {app.correctionComment}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {showProfileModal && selectedProfile && (
  <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white/95 p-6 rounded-2xl shadow-2xl max-w-lg w-full relative border border-gray-200 overflow-hidden">
      
      {/* Close Button */}
      <button
        onClick={closeProfile}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-all duration-300 text-2xl font-bold"
      >
        ×
      </button>

      {/* Header */}
      <h3 className="text-3xl font-extrabold mb-4 text-indigo-700 border-b pb-2">
        👤 User Profile
      </h3>

      {/* Basic Info */}
      <div className="space-y-2 text-gray-800 text-base">
        <p><strong>Name:</strong> {selectedProfile.name}</p>
        <p><strong>Gender:</strong> {selectedProfile.gender}</p>
        <p><strong>DOB:</strong> {new Date(selectedProfile.dob).toLocaleDateString()}</p>
        <p><strong>Caste:</strong> {selectedProfile.caste}</p>
      </div>

      {/* Documents */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-pink-700 mb-3">📄 Documents</h4>
        <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-2">
          {Object.entries(docLabels).map(([key, label]) => {
            const file = selectedProfile[key];
            if (!file) return null;
            return (
              <div 
                key={key} 
                className="flex justify-between items-center p-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="font-medium">{label}</span>
                <div className="flex items-center space-x-3">
                  <a
                    href={`${BASE_URL}/api/files/${file.filename || file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDownload(file.filename || file)}
                    className="text-green-600 hover:text-green-800 text-sm transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(key)}
                    className="text-red-600 hover:text-red-800 text-sm transition-colors flex items-center"
                    title={`Delete ${label}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default OperatorPanel;



