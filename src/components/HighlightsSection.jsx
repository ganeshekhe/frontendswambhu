import React from "react";

const features = [
  { title: "Fast Processing", icon: "⚡" },
  { title: "100% Secure", icon: "🔐" },
  { title: "Expert Operators", icon: "👨‍💻" },
  { title: "24x7 Access", icon: "🌐" },
];

const HighlightsSection = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="bg-white shadow p-6 rounded-xl hover:shadow-md"
          >
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-semibold text-lg">{f.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;