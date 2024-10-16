import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebase';
import Logo from '../../assets/logo.png'; // Prepričajte se, da je pot do logotipa pravilna

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
    }
  };

  return (
    <header className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Learnify AI logotip" className="h-10 mr-3" />
        </Link>
        <nav className="flex items-center">
          {user ? (
            <>
              <Link to="/nadzorna-plosca" className="text-white hover:text-green-400 transition duration-300 mr-6">Nadzorna plošča</Link>
              <Link to="/profil" className="text-white hover:text-green-400 transition duration-300 mr-6">Profil</Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300 font-semibold"
              >
                Odjava
              </button>
            </>
          ) : (
            <>
              <Link to="/prijava" className="text-white hover:text-green-400 transition duration-300 mr-6">Prijava</Link>
              <Link to="/registracija" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-300 font-semibold">Preizkusi brezplačno</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
