


import React from "react";

const steps = [
  "Update Profile",
  "Select Service",
  "Submit & Revivew ",
  "Get Certificate",
];

const StepsSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-10 tracking-wide">
          How It Works
        </h2>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="text-3xl font-bold mb-4 transition-all duration-300">
                Step {index + 1}
              </div>
              <p className="text-lg leading-relaxed font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
