import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-orange-100 to-white py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Apply for Govt. Services Online
          </h1>
          <p className="text-gray-600 mb-6">
            Get your PAN, Aadhar, Domicile, Income, and more documents processed
            quickly and securely from anywhere.
          </p>
         
        </div>
        <div className="md:w-1/2 flex justify-end">
  <img
    src="/logo.jpg"
    alt="eSeva Hero"
    className="w-[300px] rounded-2xl shadow-lg"
  />
</div>

      </div>
    </section>
  );
};

export default HeroSection;
