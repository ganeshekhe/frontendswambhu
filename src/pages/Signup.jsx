
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    mobile: "",
    gender: "",
    caste: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "❌ Full Name is required";
    if (!form.dob) errs.dob = "❌ Date of Birth is required";
    else {
      const age = new Date().getFullYear() - new Date(form.dob).getFullYear();
      if (age < 10) errs.dob = "❌ Minimum age must be 10 years";
    }
    if (!form.gender) errs.gender = "❌ Please select your gender";
    if (!form.caste) errs.caste = "❌ Please select your caste";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = "❌ Enter valid 10-digit mobile starting with 6-9";
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}/.test(form.password))
      errs.password = "❌ Password must have uppercase, lowercase, number & be at least 6 characters";

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
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("✅ Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-orange-100 to-pink-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-5">
        <h2 className="text-3xl font-bold text-center text-orange-600">Signup</h2>

        {["name", "dob", "gender", "caste", "mobile", "password"].map((field) => (
          <div key={field}>
            {field === "gender" || field === "caste" ? (
              <select
                name={field}
                value={form[field]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select {field}</option>
                {field === "gender" && (
                  <>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </>
                )}
                {field === "caste" && (
                  <>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="OBC">OBC</option>
                    <option value="General">General</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type={field === "dob" ? "date" : field === "password" ? "password" : "text"}
                name={field}
                placeholder={
                  field === "mobile"
                    ? "10-digit Mobile"
                    : field === "password"
                    ? "Password (6+ chars)"
                    : field === "name"
                    ? "Full Name"
                    : ""
                }
                value={form[field]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}
            {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
