
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useUser } from "../context/UserContext";

// const AdminServices = () => {
//   const [services, setServices] = useState([]);
//   const [form, setForm] = useState({ title: "", description: "" });
//   const [editId, setEditId] = useState(null);
//   const { user } = useUser(); // 🔑 Get user + token from context

//   const fetchServices = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/services");
//       setServices(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching services:", err);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user?.token) {
//       alert("Not authenticated");
//       return;
//     }

//     const config = {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     };

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:5000/api/services/${editId}`, form, config);
//       } else {
//         await axios.post("http://localhost:5000/api/services", form, config);
//       }

//       setForm({ title: "", description: "" });
//       setEditId(null);
//       fetchServices();
//     } catch (err) {
//       console.error("❌ Error saving service:", err.response?.data || err.message);
//       alert("Error: " + (err.response?.data?.message || "Failed to save service"));
//     }
//   };

//   const handleEdit = (service) => {
//     setForm({ title: service.title, description: service.description });
//     setEditId(service._id);
//   };

//   const handleDelete = async (id) => {
//     if (!user?.token) {
//       alert("Not authenticated");
//       return;
//     }

//     if (confirm("Delete this service?")) {
//       try {
//         await axios.delete(`http://localhost:5000/api/services/${id}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         fetchServices();
//       } catch (err) {
//         alert("Error deleting service");
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Manage Services</h2>

//       <form onSubmit={handleSubmit} className="space-y-2 mb-6">
//         <input
//           type="text"
//           placeholder="Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           className="border px-4 py-2 w-full"
//           required
//         />
//         <textarea
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           className="border px-4 py-2 w-full"
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           {editId ? "Update" : "Add"} Service
//         </button>
//       </form>

//       <ul className="space-y-2">
//         {services.map((srv) => (
//           <li key={srv._id} className="border p-4 rounded flex justify-between items-center">
//             <div>
//               <h3 className="font-bold">{srv.title}</h3>
//               <p className="text-sm text-gray-600">{srv.description}</p>
//             </div>
//             <div className="space-x-2">
//               <button
//                 onClick={() => handleEdit(srv)}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(srv._id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminServices;
