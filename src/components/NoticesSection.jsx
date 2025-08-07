
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MdOutlineAnnouncement,
  MdNotificationsActive,
  MdCampaign,
  MdEventNote,
} from "react-icons/md";

const noticeIcons = [
  MdOutlineAnnouncement,
  MdNotificationsActive,
  MdCampaign,
  MdEventNote,
];

const NoticesSection = () => {
  const [notices, setNotices] = useState([]);
  const [mode, setMode] = useState("vertical");

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://swambhu-backend.onrender.com";

  useEffect(() => {
    const fetchNotices = async () => {
      try {
  const res = await axios.get(`${BASE_URL}/api/notices`);
        setNotices(res.data);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      }
    };

    fetchNotices();
  }, []);

  const getRandomIcon = (index) => {
    const Icon = noticeIcons[index % noticeIcons.length];
    return <Icon className="text-blue-500 mt-1 text-xl animate-pulse" />;
  };

  return (
    <section className="bg-white py-10 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        📰 Latest Notices
      </h2>

      {/* Mode Switch */}
      <div className="flex justify-center gap-3 mb-6">
        {["vertical", "horizontal", "carousel", "fade"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 border rounded ${
              mode === m ? "bg-blue-100 font-semibold" : ""
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Mode: Vertical */}
      {mode === "vertical" && (
        <div
          className="max-w-4xl mx-auto overflow-hidden rounded-lg shadow-inner border border-gray-200"
          style={{ height: "200px", position: "relative" }}
        >
          <div
            className="scroll-container space-y-4 pr-3 overflow-y-auto hover:scrollbar-thin"
            style={{ animation: "scrollTopToBottom 20s linear infinite" }}
          >
            {notices.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No notices available.
              </p>
            ) : (
              notices.map((notice, index) => (
                <div
                  key={notice._id}
                  className="flex items-start gap-3 p-3 bg-gray-100 hover:bg-blue-100 transition-all duration-300 rounded-md shadow"
                >
                  {getRandomIcon(index)}
                  <p className="text-gray-800 font-medium">{notice.title}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mode: Horizontal */}
      {mode === "horizontal" && (
        <div className="overflow-hidden whitespace-nowrap bg-gray-100 border border-gray-300 rounded-md py-3 px-2">
          <div
            style={{
              display: "inline-block",
              animation: "scrollLeft 15s linear infinite",
            }}
          >
            {notices.map((notice, index) => {
              const Icon = noticeIcons[index % noticeIcons.length];
              return (
                <span
                  key={notice._id}
                  className="inline-flex items-center text-gray-800 font-medium mr-10"
                >
                  <Icon className="text-blue-500 mr-2 animate-bounce" />
                  {notice.title}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode: Carousel */}
      {mode === "carousel" && (
        <div className="max-w-xl mx-auto">
          {notices.slice(0, 5).map((notice, index) => {
            const Icon = noticeIcons[index % noticeIcons.length];
            return (
              <div
                key={notice._id}
                className="bg-gray-100 p-4 mb-4 rounded shadow transition-all animate-slide"
                style={{
                  animationDelay: `${index * 2}s`,
                  animationDuration: "10s",
                  animationIterationCount: "infinite",
                }}
              >
                <div className="flex gap-3 items-start">
                  <Icon className="text-blue-500 text-xl animate-ping" />
                  <p className="text-gray-800 font-medium">{notice.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode: Fade */}
      {mode === "fade" && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-4">
          {notices.map((notice, index) => {
            const Icon = noticeIcons[index % noticeIcons.length];
            return (
              <div
                key={notice._id}
                className="opacity-0 animate-fadeInOnce bg-gray-100 p-4 rounded shadow"
              >
                <div className="flex gap-3 items-start">
                  <Icon className="text-blue-500 text-xl animate-wiggle" />
                  <p className="text-gray-800 font-medium">{notice.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Styles */}
      <style>
        {`
          @keyframes scrollTopToBottom {
            0% { transform: translateY(0%); }
            100% { transform: translateY(-100%); }
          }
          @keyframes scrollLeft {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          @keyframes slide {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
          @keyframes fadeInOnce {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }

          .scroll-container:hover {
            animation-play-state: paused;
          }

          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #a0aec0;
            border-radius: 6px;
          }

          .scrollbar-thin::-webkit-scrollbar-track {
            background-color: #edf2f7;
          }

          .animate-slide {
            animation: slide 10s ease-in-out infinite;
          }

          .animate-fadeInOnce {
            animation: fadeInOnce 1s ease-out forwards;
          }

          .animate-wiggle {
            animation: wiggle 1s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default NoticesSection;
