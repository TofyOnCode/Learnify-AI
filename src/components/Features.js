import React from 'react';
import { FaCamera, FaLightbulb, FaPiggyBank } from 'react-icons/fa';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      <div className="text-green-400 text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function Features() {
  const features = [
    {
      icon: <FaCamera />,
      title: "Slikaj nalogo",
      description: "Preprosto fotografiraj svojo matematično nalogo ali uporabi vgrajeno matematično tipkovnico."
    },
    {
      icon: <FaLightbulb />,
      title: "Razumevanje postopkov",
      description: "Learnify AI te uči razumevanja postopkov reševanja, ne le podajanja odgovorov."
    },
    {
      icon: <FaPiggyBank />,
      title: "Cenovno ugodno",
      description: "Za samo 8 € na mesec dobiš neomejene inštrukcije, kar je do 25x ceneje od osebnih inštruktorjev."
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Zakaj Learnify AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
