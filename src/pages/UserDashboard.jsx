import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Check, FileText, Download, AlertCircle } from "lucide-react";
import { saveAs } from "file-saver";
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FILE_URL = `${BASE_URL}/files/`; // remove /api/files if BASE_URL ends with /api


const UserDashboard = () => {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [corrections, setCorrections] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetchApps();

      const socket = io(BASE_URL);

      socket.on("applicationStatusUpdated", fetchApps);
      socket.on("newApplication", fetchApps);
      socket.on("certificateUploaded", fetchApps);

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/applications/user`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch user applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (appId) => {
    try {
      await axios.put(
        `${BASE_URL}/api/applications/${appId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Application confirmed!");
      fetchApps();
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Failed to confirm application.");
    }
  };

  const handleCorrectionChange = (appId, value) => {
    setCorrections((prev) => ({ ...prev, [appId]: value }));
  };

  const submitCorrection = async (appId) => {
    const reason = corrections[appId];
    if (!reason || reason.trim() === "") {
      alert("Please enter correction reason.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/applications/${appId}/correction`,
        { comment: reason },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Correction sent to operator.");
      fetchApps();
    } catch (err) {
      console.error("Correction submit failed:", err);
      alert("Failed to send correction.");
    }
  };

  const downloadCertificate = async (filename, appId) => {
    try {
      const res = await axios.get(`${FILE_URL}${filename}`, {
        responseType: "blob",
      });
      saveAs(res.data, `certificate-${appId}.pdf`);
    } catch (err) {
      console.error("Certificate download error:", err);
      alert("Failed to download certificate.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-800 mb-8">
        📋 Your Applications
      </h2>

      {loading ? (
        <div className="text-center text-indigo-600 animate-pulse">Loading applications...</div>
      ) : applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-indigo-600 text-white text-left">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Dummy Form</th>
                <th className="px-4 py-3">Certificate</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{app.service?.name || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border ${
                        app.status === "Rejected"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : app.status === "Pending Confirmation"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : app.status === "Confirmed"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      {app.status === "Rejected" && <AlertCircle size={12} />}
                      {app.status}
                    </span>
                    {app.rejectReason && (
                      <div className="text-red-600 text-xs mt-1">
                        <b>Reason:</b> {app.rejectReason}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {app.formPdf?.filename ? (
                      <a
                        href={`${FILE_URL}${app.formPdf.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FileText size={14} /> View PDF
                      </a>
                    ) : (
                      <span className="text-gray-400">Not uploaded</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {app.status === "Completed" && app.certificate?.filename ? (
                      <button
                        onClick={() => downloadCertificate(app.certificate.filename, app._id)}
                        className="text-green-600 hover:underline flex items-center gap-1"
                      >
                        <Download size={14} /> Download
                      </button>
                    ) : (
                      <span className="text-gray-400">Not available</span>
                    )}
                  </td>

                  <td className="px-4 py-3 space-y-2">
                    {app.status === "Pending Confirmation" && (
                      <>
                        <button
                          onClick={() => handleConfirm(app._id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-md flex items-center justify-center gap-2 transition"
                        >
                          <Check size={16} /> Confirm
                        </button>

                        <textarea
                          rows={2}
                          placeholder="Write correction comment..."
                          value={corrections[app._id] || ""}
                          onChange={(e) => handleCorrectionChange(app._id, e.target.value)}
                          className="w-full border border-gray-300 px-2 py-1 text-xs rounded-md"
                        />
                        <button
                          onClick={() => submitCorrection(app._id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-md flex items-center justify-center gap-2 transition"
                        >
                          <AlertCircle size={16} /> Send Correction
                        </button>
                      </>
                    )}

                    {app.status === "Rejected" && app.rejectReason && (
                      <div className="text-xs text-red-600 mt-2">
                        <b>Rejected:</b> {app.rejectReason}
                      </div>
                    )}

                    {app.status === "Confirmed" && (
                      <div className="text-green-600 text-xs flex items-center gap-1">
                        <Check size={14} /> Confirmed
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
