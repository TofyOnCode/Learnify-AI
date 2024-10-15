import React, { useState } from 'react';
import { FaRocket, FaStar, FaCrown } from 'react-icons/fa';

function PricingCard({ title, price, features, isPopular, isFree, icon }) {
  return (
    <div className={`bg-gray-800 p-8 rounded-lg shadow-lg ${isPopular ? 'border-2 border-green-400' : ''}`}>
      {isPopular && <div className="text-green-400 font-semibold mb-2">Najbolj priljubljen</div>}
      <div className="text-green-400 text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <div className="text-4xl font-bold mb-6 text-white">{isFree ? 'Brezplačno' : `${price} €`}{!isFree && <span className="text-xl text-gray-400 font-normal">/mesec</span>}</div>
      <ul className="mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center mb-2 text-gray-300">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-2 px-4 rounded-md font-semibold ${isPopular ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'} hover:bg-green-700 transition duration-300`}>
        {isFree ? 'Začni brezplačno' : 'Izberi paket'}
      </button>
    </div>
  );
}

function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const pricingPlans = [
    {
      title: "Brezplačno",
      price: 0,
      features: ["Omejeno število nalog", "Osnovne razlage", "Brez časovne omejitve"],
      isPopular: false,
      isFree: true,
      icon: <FaRocket />
    },
    {
      title: "Osnovni",
      price: isAnnual ? 80 : 8,
      features: ["Neomejene inštrukcije", "Osnovna analitika napredka", "Email podpora"],
      isPopular: true,
      isFree: false,
      icon: <FaStar />
    },
    {
      title: "Premium",
      price: isAnnual ? 150 : 15,
      features: ["Vse iz osnovnega paketa", "Napredna analitika napredka", "Prednostna podpora", "Dodatne vaje in izzivi"],
      isPopular: false,
      isFree: false,
      icon: <FaCrown />
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-white">Izberi svoj paket</h2>
        <div className="flex justify-center mb-8">
          <button
            className={`px-4 py-2 rounded-l-md ${!isAnnual ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'}`}
            onClick={() => setIsAnnual(false)}
          >
            Mesečno
          </button>
          <button
            className={`px-4 py-2 rounded-r-md ${isAnnual ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'}`}
            onClick={() => setIsAnnual(true)}
          >
            Letno (2 meseca brezplačno)
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pricing;
