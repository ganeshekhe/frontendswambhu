import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

// Use backend URL from environment variables or fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://swambhu-backend.onrender.com/api";

const UserProfile = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    caste: "",
  });

  const [uploadedDocs, setUploadedDocs] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Document fields and their labels
  const documentFields = [
    "tenthCertificate",
    "tenthMarksheet",
    "twelfthCertificate",
    "twelfthMarksheet",
    "graduationDegree",
    "domicile",
    "pgCertificate",
    "casteValidity",
    "otherDocument",
  ];

  const labelMap = {
    tenthCertificate: "10th Certificate",
    tenthMarksheet: "10th Marksheet",
    twelfthCertificate: "12th Certificate",
    twelfthMarksheet: "12th Marksheet",
    graduationDegree: "Graduation Degree",
    domicile: "Domicile",
    pgCertificate: "PG Certificate",
    casteValidity: "Caste Validity",
    otherDocument: "Other Document",
  };

  // Fetch user profile on mount or when user changes
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/users/${user.id}/profile`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = res.data;

        setFormData({
          name: data.name || "",
          gender: data.gender || "",
          dob: data.dob ? data.dob.substring(0, 10) : "",
          caste: data.caste || "",
        });

        // Attach full file URLs for docs
        const docs = { ...data };
        documentFields.forEach((field) => {
          if (docs[field]?.filename) {
            docs[field].filepath = `${BASE_URL}/api/files/${docs[field].filename}`;
          }
        });

        if (docs.profilePic?.filename) {
          setProfilePic(`${BASE_URL}/api/files/${docs.profilePic.filename}`);
        }

        setUploadedDocs(docs);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle text/select input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle document file input change
  const handleFileChange = (fieldName, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB)");
      return;
    }
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  // Handle profile picture change with preview URL
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB)");
      return;
    }
    setFiles((prev) => ({ ...prev, profilePic: file }));
    setProfilePic(URL.createObjectURL(file));
  };

  // Delete a document
  const handleDeleteDoc = async (fieldName) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await axios.delete(`${BASE_URL}/api/users/profile/document/${fieldName}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUploadedDocs(res.data.user);
      setMessage("Document deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete document.");
    }
  };

  // Submit profile form including files
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("gender", formData.gender);
    form.append("dob", formData.dob);
    form.append("caste", formData.caste);

    Object.entries(files).forEach(([field, file]) => {
      form.append(field, file);
    });

    try {
      setLoading(true);
      const res = await axios.put(`${BASE_URL}/api/users/profile`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const updatedUser = res.data.user;

      // Update uploaded docs URLs
      const updatedDocs = { ...updatedUser };
      documentFields.forEach((field) => {
        if (updatedUser[field]?.filename) {
          updatedDocs[field].filepath = `${BASE_URL}/api/files/${updatedUser[field].filename}`;
        }
      });

      if (updatedUser.profilePic?.filename) {
        setProfilePic(`${BASE_URL}/api/files/${updatedUser.profilePic.filename}`);
      }

      setUploadedDocs(updatedDocs);
      setFiles({});
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">My Profile</h2>

      {message && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <img
              src={profilePic || "/default-user.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-pink-500 shadow-lg object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
              <span role="img" aria-label="edit">
                ✏️
              </span>
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Caste</label>
            <select
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="General">General</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Documents */}
        <div className="border p-4 rounded-lg bg-pink-50 mt-4">
          <h4 className="font-semibold text-pink-700 mb-2">📄 Documents</h4>

          {documentFields.map((field) => (
            <div key={field} className="mb-3">
              <label className="text-sm block mb-1">{labelMap[field]}</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(field, e.target.files[0])}
                className="block w-full border p-2 rounded"
              />

              {uploadedDocs[field]?.filename && (
                <div className="mt-1 flex flex-col md:flex-row md:items-center md:justify-between text-sm bg-white p-2 rounded shadow">
                  <span className="text-gray-600 mb-1 md:mb-0">📌 {uploadedDocs[field].filename}</span>
                  <div className="flex items-center space-x-4">
                    <a
                      href={`${BASE_URL}/api/files/${uploadedDocs[field].filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteDoc(field)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete 🗑
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700 shadow"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
