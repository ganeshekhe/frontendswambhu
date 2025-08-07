// // client/src/context/ServiceContext.jsx

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// export const ServiceContext = createContext();

// export const ServiceProvider = ({ children }) => {
//   const [services, setServices] = useState([]);
//   const [filteredServices, setFilteredServices] = useState([]);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/service`);
//         setServices(res.data);
//         setFilteredServices(res.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       }
//     };
//     fetchServices();
//   }, []);

//   const filterServices = (searchQuery) => {
//     const result = services.filter((service) =>
//       service.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredServices(result);
//   };

//   return (
//     <ServiceContext.Provider value={{ services: filteredServices, filterServices }}>
//       {children}
//     </ServiceContext.Provider>
//   );
// };

// // ✅ Custom Hook
// export const useServices = () => useContext(ServiceContext);
