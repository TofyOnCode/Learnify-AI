
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import Logo from '../../assets/logo.png'; // Prepričajte se, da je pot do logotipa pravilna

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Gesli se ne ujemata');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/nadzorna-plosca');
    } catch (error) {
      setError('Napaka pri registraciji. Poskusite znova.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-start pt-4 items-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Logo" className="h-12" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-4">Ustvarite račun</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 focus:border-green-500 focus:bg-gray-600 focus:ring-2 focus:ring-green-500 text-base outline-none text-white transition duration-200"
                placeholder="Potrdite geslo"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline transition duration-200"
              >
                Registracija
              </button>
            </div>
          </form>
        </div>
        <div className="bg-gray-700 py-3 text-center">
          <p className="text-sm text-gray-300">
            Že imate račun?{' '}
            <Link to="/prijava" className="text-green-400 font-semibold hover:text-green-300">
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
