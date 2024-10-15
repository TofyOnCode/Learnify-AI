import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

const Dashboard = () => {
  console.log("Dashboard: Komponenta se je začela izvajati");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard: Preverjam stanje avtentikacije...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Dashboard: Stanje avtentikacije se je spremenilo", currentUser);
      if (currentUser) {
        setUser(currentUser);
      } else {
        console.log("Dashboard: Ni prijavljenega uporabnika, preusmerjam na prijavo");
        navigate('/prijava');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    console.log("Dashboard: Uporabnik ni naložen, prikazujem prazen zaslon");
    return null;
  }

  console.log("Dashboard: Prikazujem nadzorno ploščo za uporabnika", user.email);
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Nadzorna plošča</h1>
        <p className="text-white text-center mb-6">Dobrodošli, {user.email}!</p>
        {/* Tukaj dodajte vsebino nadzorne plošče */}
      </div>
    </div>
  );
};

export default Dashboard;
