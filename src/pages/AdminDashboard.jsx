import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


function AdminPanel() {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [fees, setFees] = useState({
    SC: 0,
    ST: 0,
    OBC: 0,
    General: 0,
    Other: 0,
  });
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [editedNotice, setEditedNotice] = useState("");
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("applications");
  const [statusFilter, setStatusFilter] = useState("All");
  const [certificateFiles, setCertificateFiles] = useState({});
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);

  const authHeaders = user?.token
    ? { Authorization: `Bearer ${user.token}` }
    : {};

  const countByStatus = (status) => {
    if (status === "All") return applications.length;
    return applications.filter(
      (app) => app.status?.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const filteredApplications =
    statusFilter === "All"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  useEffect(() => {
    if (!user?.token) return;
    const fetchData = async () => {
      try {
        const [appRes, userRes, serviceRes, noticeRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/applications`, { headers: authHeaders }),
          axios.get(`${BASE_URL}/api/users`, { headers: authHeaders }),
          axios.get(`${BASE_URL}/api/services`, { headers: authHeaders }),
          axios.get(`${BASE_URL}/api/notices`),
        ]);
        setApplications(appRes.data.reverse());
        setUsers(userRes.data);
        setServices(serviceRes.data);
        setNotices(noticeRes.data);
      } catch (err) {
        console.error("Admin data fetch error:", err);
      }
    };
    fetchData();
    fetchHeroSlides();
  }, [user]);

  const fetchHeroSlides = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/heroslides`);
      setHeroSlides(res.data);
    } catch (err) {
      console.error("Failed to fetch hero slides", err);
    }
  };

  const handleAddOrUpdateService = async () => {
    if (!newService.trim()) return alert("Please enter service name");
    try {
      const serviceData = { name: newService, fees };
      if (editingService) {
        await axios.put(
          `${BASE_URL}/api/services/${editingService._id}`,
          serviceData,
          { headers: authHeaders }
        );
      } else {
        await axios.post(`${BASE_URL}/api/services`, serviceData, {
          headers: authHeaders,
        });
      }
      setNewService("");
      setFees({ SC: 0, ST: 0, OBC: 0, General: 0, Other: 0 });
      setEditingService(null);
      const res = await axios.get(`${BASE_URL}/api/services`, {
        headers: authHeaders,
      });
      setServices(res.data);
    } catch (err) {
      console.error("Failed to save service", err);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/api/services/${id}`, {
        headers: authHeaders,
      });
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  const handleEditClick = (service) => {
    setNewService(service.name);
    setFees(service.fees || { SC: 0, ST: 0, OBC: 0, General: 0, Other: 0 });
    setEditingService(service);
  };

  const handleCertificateFileSelect = (appId, file) => {
    setCertificateFiles((prev) => ({ ...prev, [appId]: file }));
  };

  const handleCertificateUpload = async (e, appId) => {
    e.preventDefault();
    const file = certificateFiles[appId];
    if (!file) return alert("Please select a certificate file");
    const formData = new FormData();
    formData.append("certificate", file);
    try {
      await axios.put(
        `${BASE_URL}/api/applications/${appId}/certificate`,
        formData,
        {
          headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
        }
      );
      alert("Certificate uploaded successfully!");
      const appRes = await axios.get(`${BASE_URL}/api/applications`, {
        headers: authHeaders,
      });
      setApplications(appRes.data.reverse());
      setCertificateFiles((prev) => {
        const copy = { ...prev };
        delete copy[appId];
        return copy;
      });
    } catch (err) {
      console.error("Certificate upload failed:", err);
    }
  };

  const handleHeroUpload = async (e) => {
    e.preventDefault();
    if (!heroTitle.trim() || !heroSubtitle.trim() || !heroImage)
      return alert("Please fill all fields");
    const formData = new FormData();
    formData.append("title", heroTitle);
    formData.append("subtitle", heroSubtitle);
    formData.append("image", heroImage);
    try {
      await axios.post(`${BASE_URL}/api/heroslides`, formData, {
        headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
      });
      alert("Hero banner uploaded successfully!");
      setHeroTitle("");
      setHeroSubtitle("");
      setHeroImage(null);
      fetchHeroSlides();
    } catch (err) {
      console.error("Hero upload failed:", err);
    }
  };

  const handleHeroDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/heroslides/${id}`, {
        headers: authHeaders,
      });
      fetchHeroSlides();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleAddNotice = async () => {
    try {
     const res = await axios.post(`${BASE_URL}/api/notices`, {

        title: newNotice,
      });
      setNotices([...notices, res.data]);
      setNewNotice("");
    } catch (err) {
      console.error("Error adding notice", err);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/notices/${id}`);
      setNotices(notices.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notice", err);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/notices/${id}`, {
        title: editedNotice,
      });
      setNotices(
        notices.map((n) => (n._id === id ? { ...n, title: res.data.title } : n))
      );
      setEditingNoticeId(null);
      setEditedNotice("");
    } catch (err) {
      console.error("Error updating notice", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${BASE_URL}/api/users/${userId}/role`,
        { role: newRole },
        { headers: authHeaders }
      );
      alert("Role updated successfully!");
    } catch (err) {
      console.error("Role update failed", err);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: authHeaders }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="p-25 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedTab("applications")}
          className={`px-4 py-2 rounded ${
            selectedTab === "applications"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setSelectedTab("users")}
          className={`px-4 py-2 rounded ${
            selectedTab === "users"
              ? "bg-green-700 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setSelectedTab("services")}
          className={`px-4 py-2 rounded ${
            selectedTab === "services"
              ? "bg-purple-700 text-white"
              : "bg-purple-500 text-white"
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setSelectedTab("notices")}
          className={`px-4 py-2 rounded ${
            selectedTab === "notices"
              ? "bg-orange-700 text-white"
              : "bg-orange-500 text-white"
          }`}
        >
          Notices
        </button>
        <button
          onClick={() => setSelectedTab("banners")}
          className={`px-4 py-2 rounded ${
            selectedTab === "banners"
              ? "bg-pink-700 text-white"
              : "bg-pink-500 text-white"
          }`}
        >
          Banner
        </button>
      </div>

      {selectedTab === "banners" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload Hero Banner</h2>
          <form onSubmit={handleHeroUpload} className="space-y-4 max-w-md">
            <input
              type="text"
              placeholder="Title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              // required
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              // required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroImage(e.target.files[0])}
              className="w-full"
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded"
            >
              Upload Banner
            </button>
          </form>

          <h3 className="text-lg font-medium mt-8 mb-4">Uploaded Banners</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {heroSlides.map((slide) => (
              <div
                key={slide._id}
                className="border rounded overflow-hidden shadow relative"
              >
                <img
                  src={`${BASE_URL}/api/files/${slide.image?.filename}`}
                  alt={slide.title}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-3">
                  <h4 className="font-bold text-lg">{slide.title}</h4>
                  <p className="text-sm">{slide.subtitle}</p>
                </div>
                <button
                  onClick={() => handleHeroDelete(slide._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* notice tab */}

      {selectedTab === "notices" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Notices</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter notice"
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
            <button
              onClick={handleAddNotice}
              className="bg-orange-600 text-white px-4 py-1 rounded"
            >
              Add Notice
            </button>
          </div>

          <ul className="space-y-3">
            {notices.map((notice) => (
              <li
                key={notice._id}
                className="flex items-center justify-between bg-gray-100 p-3 rounded shadow"
              >
                {editingNoticeId === notice._id ? (
                  <input
                    type="text"
                    value={editedNotice}
                    onChange={(e) => setEditedNotice(e.target.value)}
                    className="border px-2 py-1 rounded w-full mr-2"
                  />
                ) : (
                  <span className="text-gray-800">{notice.title}</span>
                )}

                <div className="flex gap-2">
                  {editingNoticeId === notice._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(notice._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNoticeId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingNoticeId(notice._id);
                          setEditedNotice(notice.title);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNotice(notice._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {selectedTab === "applications" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Applications</h2>

          <div className="flex gap-3 mb-4 flex-wrap">
            {[
              "All",
             
               "Submitted",
               "Pending Confirmation",
              "In Review",
              "Confirmed",
              "Completed",
              "Rejected",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded border ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                }`}
              >
                {status} ({countByStatus(status)})
              </button>
            ))}
          </div>

          {filteredApplications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app._id}
                  className="border rounded p-4 shadow bg-white"
                >
                  <p>
                    <b>User:</b> {app.user?.name || "N/A"} (
                    {app.user?.mobile || "N/A"})
                  </p>
                  <p>
                    <b>Service:</b> {app.service?.name || "N/A"}
                  </p>
                  <p>
                    <b>Status:</b>{" "}
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusUpdate(app._id, e.target.value)
                      }
                      className="ml-2 border rounded px-2 py-1"
                    >
                      <option value="Pending">Submited</option>
                      <option value="In Review">In Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                       <option value="Pending Confirmation">Pending Confirmation</option>
                    </select>
                  </p>
                  <p>
                    <b>Submitted At:</b>{" "}
                    {new Date(app.createdAt).toLocaleString()}
                  </p>

                  {app.status === "Completed" && (
                    <div className="mt-2">
                      <form
                        onSubmit={(e) => handleCertificateUpload(e, app._id)}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) =>
                            handleCertificateFileSelect(
                              app._id,
                              e.target.files[0]
                            )
                          }
                          className="border rounded px-2 py-1"
                        />
                        <button
                          type="submit"
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Upload Certificate
                        </button>
                      </form>

                      {app.certificateUrl && (
                        <a
                          href={`${BASE_URL}${app.certificateUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline mt-1 block"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USERS TAB */}
      {selectedTab === "users" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u._id} className="border rounded p-2">
                  <p>
                    <b>Name:</b> {u.name}
                  </p>
                  <p>
                    <b>Mobile:</b> {u.mobile}
                  </p>
                  <p>
                    <b>Role:</b>{" "}
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="ml-2 border rounded"
                    >
                      <option value="user">user</option>
                      <option value="operator">operator</option>
                      <option value="admin">admin</option>
                    </select>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedTab === "services" && (
        <div className="p-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Manage Services</h2>

          <div className="border p-4 rounded mb-4">
            <input
              type="text"
              placeholder="Service name"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="border px-2 py-1 rounded w-full mb-2"
            />

            {Object.keys(fees).map((cast) => (
              <div key={cast} className="mb-2">
                <label className="mr-2 font-medium">{cast} Fee:</label>
                <input
                  type="number"
                  value={fees[cast]}
                  onChange={(e) =>
                    setFees({ ...fees, [cast]: Number(e.target.value) })
                  }
                  className="border px-2 py-1 rounded w-32"
                />
              </div>
            ))}

            <button
              onClick={handleAddOrUpdateService}
              className="bg-purple-600 text-white px-4 py-2 rounded mt-2"
            >
              {editingService ? "Update Service" : "Add Service"}
            </button>
          </div>

          <ul className="space-y-2">
            {services.map((srv) => (
              <li
                key={srv._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{srv.name}</p>
                  <p className="text-sm text-gray-600">
                    Fees:{" "}
                    {Object.entries(srv.fees || {})
                      .map(([cast, fee]) => `${cast}: ₹${fee}`)
                      .join(", ")}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditClick(srv)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
