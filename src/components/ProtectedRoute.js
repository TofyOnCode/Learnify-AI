import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ProtectedRoute: Preverjam stanje avtentikacije...");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("ProtectedRoute: Stanje avtentikacije se je spremenilo", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    console.log("ProtectedRoute: Nalaganje...");
    return <div>Nalaganje...</div>;
  }

  if (!user) {
    console.log("ProtectedRoute: Ni prijavljenega uporabnika, preusmerjam na prijavo");
    return <Navigate to="/prijava" replace />;
  }

  console.log("ProtectedRoute: Uporabnik je prijavljen, prikazujem zaščiteno vsebino");
  return children;
};

export default ProtectedRoute;
