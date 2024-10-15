import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    name: "Maja N.",
    role: "Študentka",
    content: "Learnify AI mi je pomagal izboljšati oceno iz matematike za 2 oceni v samo enem mesecu. Neverjetno!"
  },
  {
    name: "Luka K.",
    role: "Srednješolec",
    content: "Končno razumem matematiko! Learnify AI razlaga tako, da lahko vse razumem."
  },
  {
    name: "Ana P.",
    role: "Osnovnošolka",
    content: "Matematika je zdaj moj najljubši predmet, hvala Learnify AI!"
  },
  {
    name: "Marko S.",
    role: "Starš",
    content: "Kot starš sem navdušen nad napredkom mojega otroka. Learnify AI je res odlična investicija."
  },
  {
    name: "Nina B.",
    role: "Učiteljica",
    content: "Learnify AI je odlično dopolnilo k mojemu poučevanju. Učenci so bolj motivirani in dosegajo boljše rezultate."
  },
  {
    name: "Jure T.",
    role: "Gimnazijec",
    content: "S pomočjo Learnify AI sem se uspešno pripravil na maturo iz matematike. Res priporočam!"
  },
  {
    name: "Eva M.",
    role: "Študentka",
    content: "Learnify AI mi je pomagal premagati strah pred matematiko. Zdaj se počutim samozavestno pri reševanju nalog."
  },
  {
    name: "Tim K.",
    role: "Osnovnošolec",
    content: "Matematika je postala zabavna! Learnify AI naredi učenje kot igro."
  },
  {
    name: "Sara P.",
    role: "Dijakinja",
    content: "Z Learnify AI sem izboljšala svoje ocene in pridobila samozavest pri matematiki."
  }
];

function TestimonialCard({ name, role, content }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
      <p className="text-gray-300 mb-4">{content}</p>
      <div className="font-semibold text-green-400">{name}</div>
      <div className="text-gray-500">{role}</div>
    </div>
  );
}

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Kaj pravijo naši uporabniki</h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-2">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full"
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
              )
            }
          >
            &#10094;
          </button>
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full"
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
              )
            }
          >
            &#10095;
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {[...Array(testimonials.length - 2)].map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 mx-1 rounded-full ${
                currentIndex === index ? 'bg-green-500' : 'bg-gray-500'
              }`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
