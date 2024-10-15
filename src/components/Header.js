import React from 'react';
import Logo from '../assets/logo.png';

function Header() {
  return (
    <header className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <img src={Logo} alt="Learnify AI logotip" className="h-10" />
        <nav className="flex items-center">
          <a href="#" className="text-white hover:text-green-400 transition duration-300 mr-6">Prijava</a>
          <a href="#" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300 font-semibold">Preizkusi brezplačno</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
