import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const res = await axios.post(url, form);
      if (isLogin) {
        login(res.data);
        if (res.data.user.role === "admin") navigate("/admin");
        else if (res.data.user.role === "operator") navigate("/operator");
        else navigate("/user");
        window.location.reload();
      } else {
        alert("Signup successful! You can now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-200 to-orange-100">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-tr from-pink-600 to-orange-500 text-white flex flex-col justify-center items-center p-10">
          <img src="/logo.png" alt="Logo" className="w-28 h-28 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Maha e-Seva Kendra</h2>
          <p className="text-center text-lg">
            Digital Services Portal for Citizens
          </p>
        </div>

        {/* Right Panel (Form) */}
        <div className="md:w-1/2 p-10">
          <h2 className="text-2xl font-semibold mb-6 text-pink-600 text-center">
            {isLogin ? "Login to Your Account" : "Create a New Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            )}

            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />

            {isLogin && (
              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-blue-600">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
            >
              {isLogin ? "Login" : "Signup"}
            </button>

            <p className="text-center text-sm mt-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 underline"
              >
                {isLogin ? "Signup" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
