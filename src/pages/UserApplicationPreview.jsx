import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const UserApplicationPreview = () => {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const res = await axios.get("http://localhost:5000/api/applications/my", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setApplications(res.data);
  };

  const handleConfirm = async (id) => {
    await axios.put(`http://localhost:5000/api/applications/${id}/confirm`, {}, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchApplications();
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Application Preview & Confirmation</h2>
      {applications.map(app => (
        <div key={app._id} className="border p-4 mb-4">
          <p><strong>Service:</strong> {app.serviceName}</p>
          {app.formPdfPath && (
            <iframe src={`http://localhost:5000${app.formPdfPath}`} className="w-full h-96 my-4" title="Form PDF" />
          )}
          {app.status === "Pending Confirmation" && (
            <button onClick={() => handleConfirm(app._id)} className="bg-green-600 text-white px-4 py-2 rounded">
              Confirm Application
            </button>
          )}
          <p className="text-sm text-gray-600 mt-2">Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
};

export default UserApplicationPreview;
