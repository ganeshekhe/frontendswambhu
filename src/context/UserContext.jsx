


import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserProfile = async (decodedUser, token) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${decodedUser.id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({
        id: decodedUser.id,
        name: res.data.name,
        mobile: res.data.mobile,
        role: decodedUser.role,
        gender: res.data.gender,
        dob: res.data.dob,
        profilePic: res.data.profilePic || null,

        // ✅ All documents
        tenthCertificate: res.data.tenthCertificate || null,
        tenthMarksheet: res.data.tenthMarksheet || null,
        twelfthCertificate: res.data.twelfthCertificate || null,
        twelfthMarksheet: res.data.twelfthMarksheet || null,
        graduationDegree: res.data.graduationDegree || null,
        domicile: res.data.domicile || null,
        pgCertificate: res.data.pgCertificate || null,
        casteValidity: res.data.casteValidity || null,
        otherDocument: res.data.otherDocument || null,

        token,
      });
    } catch (error) {
      console.error("❌ Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        fetchUserProfile(decoded, token);
      } catch (error) {
        console.error("❌ Invalid token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const login = async (token) => {
    try {
      const decoded = jwt_decode(token);
      localStorage.setItem("token", token);
      await fetchUserProfile(decoded, token);
    } catch (error) {
      console.error("❌ Invalid token in login:", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Correctly exported hook
export const useUser = () => useContext(UserContext);
