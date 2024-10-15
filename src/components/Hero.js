import React from 'react';

function Hero() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Učenje matematike, <span className="text-green-400">zdaj lažje kot kadarkoli</span>
        </h1>
        <p className="text-xl mb-12 max-w-3xl mx-auto">
          Začni z uporabo Learnify AI, prvega AI tutorja v Sloveniji. Za ceno ene ure dobiš cel mesec inštrukcij. Če ne izboljšaš ocene pri matematiki za vsaj 2 oceni, ti vrnemo denar!
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105">
            PREIZKUSI BREZPLAČNO
          </button>
          <button className="bg-gray-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-600 transition duration-300 transform hover:scale-105">
            NAROČI LEARNIFY AI
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
