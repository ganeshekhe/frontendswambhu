

import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { mobile });
      alert("OTP sent");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "OTP failed");
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        mobile,
        otp,
        newPassword,
      });
      alert("Password reset successful!");
      setStep(1);
      setMobile("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-pink-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
          Forgot Password
        </h2>

        {step === 1 ? (
          <>
            <input
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-pink-500 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <button
              onClick={resetPassword}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

