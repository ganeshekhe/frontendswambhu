
// import React from "react";
// import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-100 text-gray-700 border-t border-gray-300 mt-10">
//       <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

//         {/* Column 1 - Logo & About */}
//         <div>
//           <h2 className="text-2xl font-semibold text-pink-600 mb-2">CEP</h2>
//           <p className="text-sm leading-relaxed text-gray-600">
//             All government services in one place. Fill out applications, upload documents and get certificates – all from the comfort of your home.
//           </p>
//         </div>

//         {/* Column 2 - Useful Links */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
//           <ul className="space-y-2 text-sm">
//             <li><a href="/" className="hover:text-pink-600 transition">🏠 Home</a></li>
//             <li><a href="/application-form" className="hover:text-pink-600 transition">📝 Apply for Service</a></li>
//             <li><a href="/login" className="hover:text-pink-600 transition">🔐 Login</a></li>
//             <li><a href="/signup" className="hover:text-pink-600 transition">👤 Create Account</a></li>
//           </ul>
//         </div>

//         {/* Column 3 - Contact & Social */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
//           <ul className="space-y-2 text-sm text-gray-600">
//             <li className="flex items-center gap-2">
//               <FaMapMarkerAlt className="text-pink-500" />
//               Alandi, Pune, Maharashtra
//             </li>
//             <li className="flex items-center gap-2">
//               <FaPhoneAlt className="text-pink-500" />
//               +91 98765 43210
//             </li>
//             <li className="flex items-center gap-2">
//               <FaEnvelope className="text-pink-500" />
//               support@mahaeseva.in
//             </li>
//           </ul>

//           <div className="flex gap-4 mt-4">
//             <a href="#" className="text-gray-600 hover:text-pink-600">
//               <FaFacebookF />
//             </a>
//             <a href="#" className="text-gray-600 hover:text-pink-600">
//               <FaTwitter />
//             </a>
//             <a href="#" className="text-gray-600 hover:text-pink-600">
//               <FaLinkedinIn />
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="text-center py-4 text-sm text-gray-500 border-t border-gray-200">
//         © {new Date().getFullYear()} Ganesh Ekhe All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 animate-fadeIn">

        {/* Column 1 - Logo & About */}
        <div>
          <h2 className="text-3xl font-bold text-pink-500 mb-4 tracking-wide">CEP</h2>
          <p className="text-sm leading-relaxed text-gray-300">
            All government services in one place. Fill out applications, upload documents and get certificates – all from the comfort of your home.
          </p>
        </div>

        {/* Column 2 - Useful Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-pink-500 pb-1">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            {[
              { label: "🏠 Home", href: "/" },
              { label: "📝 Apply for Service", href: "/application-form" },
              { label: "🔐 Login", href: "/login" },
              { label: "👤 Create Account", href: "/signup" },
            ].map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  className="hover:text-pink-400 hover:pl-2 transition-all duration-300 block"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 - Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-pink-500 pb-1">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-pink-400 mt-1" />
              <span>
                <strong>Address:</strong><br />
                Swayambhu Online Services,<br />
                Vita Road, near Rathod Petrol Pump,<br />
                Tq Sonpeth, Dist Parbhani - 431516
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaPhoneAlt className="text-pink-400 mt-1" />
              <span>
                <strong>Contact:</strong><br />
                Vishnu Khate - 9689992252<br />
                Shubham Bhandekar - 9834883059
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-pink-400" />
              swayambhupvt.ltd@gmail.com
            </li>
          </ul>

          <div className="flex gap-4 mt-6">
            {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 bg-white text-gray-700 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-md"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-4 text-sm text-gray-400 border-t border-gray-700 mt-10">
        © {new Date().getFullYear()} Ganesh Ekhe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
