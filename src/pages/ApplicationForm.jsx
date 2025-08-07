

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const ApplicationForm = () => {
  const { serviceId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(serviceId || "");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [userCaste, setUserCaste] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user?.token) {
      const headers = { Authorization: `Bearer ${user.token}` };

      axios.get("http://localhost:5000/api/users/me", { headers })
        .then(res => setUserCaste(res.data.caste || "General"))
        .catch(err => console.error("Error fetching user caste:", err));
    }
  }, [user]);

  useEffect(() => {
    if (user?.token && userCaste) {
      const headers = { Authorization: `Bearer ${user.token}` };

      axios.get("http://localhost:5000/api/services", { headers })
        .then(res => {
          setServices(res.data);
          if (serviceId) handleServiceChange(serviceId, res.data, userCaste);
        })
        .catch(err => console.error("Error fetching services:", err));
    }
  }, [user, userCaste]);

  const handleServiceChange = (serviceIdValue, serviceList = services, casteValue = userCaste) => {
    setSelectedService(serviceIdValue);
    const service = serviceList.find(s => s._id === serviceIdValue);
    if (service && service.fees) {
      const casteKey = (casteValue || "General").toUpperCase();
      const matchingKey = Object.keys(service.fees).find(key => key.toUpperCase() === casteKey);
      const fee = matchingKey ? service.fees[matchingKey] : service.fees["General"] || 0;
      setSelectedPrice(fee);
    } else {
      setSelectedPrice(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/applications", {
        serviceId: selectedService,
        userId: user.id
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setShowPopup(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Submission failed");
    }
  };

  const closePopupAndNavigate = () => {
    setShowPopup(false);
    navigate("/user/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform hover:scale-[1.02] transition-transform duration-300"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Apply for a Service</h2>

        <select
          value={selectedService}
          onChange={e => handleServiceChange(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          required
        >
          <option value="">-- Select Service --</option>
          {services.map(service => (
            <option key={service._id} value={service._id}>{service.name}</option>
          ))}
        </select>

        <div className="mt-4 text-lg text-gray-700">
          <b>Fees:</b> ₹ {selectedPrice || "0"}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
        >
          Submit Application
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm mx-auto animate-fadeIn">
            <h3 className="text-xl font-bold text-green-600 mb-4">🎉 Application Submitted Successfully!
            </h3>
            <button
              onClick={closePopupAndNavigate}
              className="bg-green-500 text-white py-2 px-5 rounded-lg hover:bg-green-600 transition transform hover:scale-105"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;