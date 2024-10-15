import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Dobrodošli v Learnify-AI</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Learnify-AI je vaša personalizirana platforma za učenje, ki uporablja umetno inteligenco za prilagajanje vašemu učnemu stilu in tempu.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/quiz" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center">
          Začni kviz
        </Link>
        <Link to="/progress" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center">
          Spremljaj napredek
        </Link>
      </div>
    </div>
  );
}

export default Home;

