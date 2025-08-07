

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = "❌ Enter valid 10-digit mobile number";
    if (!form.password || form.password.length < 6)
      errs.password = "❌ Password must be at least 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data);
      const role = res.data.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "operator") navigate("/operator");
      else navigate("/user");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-200 to-orange-100">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-tr from-pink-600 to-orange-500 text-white flex flex-col justify-center items-center p-10 rounded-2xl shadow-2xl">
          <img src="/logo.jpg" alt="Logo" className="w-28 h-28 mb-4 rounded-full shadow-lg border-4 border-white" />
          <h2 className="text-4xl font-extrabold mb-2 tracking-wide">Welcome to <span className="text-yellow-300">CEP</span></h2>
          <p className="text-center text-lg font-medium mb-6">Your Common Exam Portal</p>
          <div className="flex space-x-6">
            <a href="#" className="bg-white text-pink-600 p-3 rounded-full hover:bg-pink-600 hover:text-white transition shadow-lg">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="bg-white text-pink-600 p-3 rounded-full hover:bg-pink-600 hover:text-white transition shadow-lg">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="bg-white text-pink-600 p-3 rounded-full hover:bg-pink-600 hover:text-white transition shadow-lg">
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="md:w-1/2 p-10 flex justify-center items-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4">
            <h2 className="text-2xl font-bold text-center text-pink-600">Login</h2>

            <input
              type="text"
              name="mobile"
              placeholder="10-digit Mobile"
              value={form.mobile}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-blue-500">
                Forgot Password?
              </Link>
              <Link to="/signup" className="text-pink-600 font-medium hover:underline">
                New user? Sign up
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

