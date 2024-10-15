import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import Logo from '../../assets/logo.png'; // Prepričajte se, da je pot do logotipa pravilna

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Uspešna prijava, preusmerjam na nadzorno ploščo");
      navigate('/nadzorna-plosca');
    } catch (error) {
      console.error("Napaka pri prijavi:", error);
      setError('Napaka pri prijavi. Preverite e-pošto in geslo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-start pt-16 items-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <img src={Logo} alt="Logo" className="h-12" />
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-6">Dobrodošli nazaj</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 focus:border-green-500 focus:bg-gray-600 focus:ring-2 focus:ring-green-500 text-base outline-none text-white transition duration-200"
                placeholder="E-poštni naslov"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 focus:border-green-500 focus:bg-gray-600 focus:ring-2 focus:ring-green-500 text-base outline-none text-white transition duration-200"
                placeholder="Geslo"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline transition duration-200"
              >
                Prijava
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-700 py-3 text-center">
          <p className="text-sm text-gray-300">
            Nimate računa?{' '}
            <Link to="/registracija" className="text-green-400 font-semibold hover:text-green-300">
              Registrirajte se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
