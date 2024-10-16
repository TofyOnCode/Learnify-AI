import React, { useState } from 'react';
import { FaStar, FaCrown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UpgradeModal = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      title: "Osnovni",
      price: 8,
      icon: <FaStar className="text-yellow-400" />,
      features: [
        "Neomejene inštrukcije",
        "Osnovna analitika napredka",
        "Email podpora"
      ]
    },
    {
      title: "Premium",
      price: 15,
      icon: <FaCrown className="text-purple-400" />,
      features: [
        "Vse iz osnovnega paketa",
        "Napredna analitika napredka",
        "Prednostna podpora",
        "Dodatne vaje in izzivi"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Nadgradite svoj paket</h2>
        <p className="mb-6 text-gray-300">Presegli ste število vprašanj za vaš trenutni paket. Nadgradite za neomejeno število vprašanj!</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-700 p-4 rounded-lg text-center cursor-pointer transition duration-300 ${selectedPlan === plan.title ? 'border-2 border-green-500' : 'hover:bg-gray-600'}`}
              onClick={() => setSelectedPlan(plan.title)}
            >
              <div className="text-3xl mb-2">{plan.icon}</div>
              <h3 className="font-bold text-white">{plan.title}</h3>
              <p className="text-green-400 font-bold">{plan.price} €/mesec</p>
            </div>
          ))}
        </div>
        {selectedPlan && (
          <div className="mb-6">
            <h4 className="font-bold text-white mb-2">{selectedPlan} paket vključuje:</h4>
            <ul className="list-disc list-inside text-gray-300">
              {plans.find(plan => plan.title === selectedPlan).features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-between">
          <Link 
            to="/pricing" 
            className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 ${!selectedPlan && 'opacity-50 cursor-not-allowed'}`}
            onClick={(e) => !selectedPlan && e.preventDefault()}
          >
            Izberi paket
          </Link>
          <button onClick={onClose} className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300">
            Zapri
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
