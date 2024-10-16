import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (!user || !userData) return <div>Nalaganje...</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Profil uporabnika</h2>
          <div className="space-y-4">
            <p className="text-white"><span className="font-bold">Ime:</span> {userData.name}</p>
            <p className="text-white"><span className="font-bold">E-pošta:</span> {user.email}</p>
            <p className="text-white"><span className="font-bold">Šola:</span> {userData.school}</p>
            <p className="text-white"><span className="font-bold">Tip šole:</span> {userData.schoolType}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

