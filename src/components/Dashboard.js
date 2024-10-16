import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaHistory, FaGraduationCap, FaPlay, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import { RiCalculatorLine } from 'react-icons/ri';
import { GiChemicalDrop, GiAtom } from 'react-icons/gi';
import { IoLanguage } from 'react-icons/io5';
import Tooltip from './Tooltip';
import ProgressBar from './ProgressBar';
import openaiService from '../services/openai';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import UserInfoForm from './UserInfoForm';
import UpgradeModal from './UpgradeModal';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const MIN_REQUEST_INTERVAL = 3000; // 3 sekunde med zahtevami
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const subjects = [
    { name: 'Matematika', icon: <RiCalculatorLine />, description: 'Matematične naloge in koncepti' },
    { name: 'Kemija', icon: <GiChemicalDrop />, description: 'Kemijske formule in reakcije' },
    { name: 'Angleščina', icon: <IoLanguage />, description: 'Učenje angleškega jezika' },
    { name: 'Fizika', icon: <GiAtom />, description: 'Fizikalni zakoni in pojavi' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setChatHistory(userDoc.data().chatHistory || []);
        } else {
          setShowUserInfoForm(true);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUserInfoComplete = async (userInfo) => {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      ...userInfo,
      remainingQuestions: 5,
      progress: 0,
      chatHistory: [],
      createdAt: new Date()
    });
    setShowUserInfoForm(false);
    setUserData(await getDoc(userDocRef).then(doc => doc.data()));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      alert(`Prosimo, počakajte ${Math.ceil((MIN_REQUEST_INTERVAL - (now - lastRequestTime)) / 1000)} sekund pred naslednjo zahtevo.`);
      return;
    }

    if (message.trim()) {
      if (userData.remainingQuestions > 0) {
        setIsLoading(true);
        setLastRequestTime(now);
        try {
          const userMessage = { role: 'user', content: message };
          const newChatHistory = [...chatHistory, userMessage];
          setChatHistory(newChatHistory);
          
          // Dodajanje konteksta in zahteve za slovenski jezik
          const contextMessage = `Predmet: ${selectedSubject}. Prosim, odgovorite v slovenščini. Vprašanje: ${message}`;
          
          const aiResponse = await openaiService.generateResponse(contextMessage, chatHistory);
          const aiMessage = { role: 'assistant', content: aiResponse };
          newChatHistory.push(aiMessage);
          setChatHistory(newChatHistory);
          
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            remainingQuestions: userData.remainingQuestions - 1,
            chatHistory: newChatHistory,
            progress: (userData.progress || 0) + 1
          });
          
          setUserData(prev => ({
            ...prev,
            remainingQuestions: prev.remainingQuestions - 1,
            progress: (prev.progress || 0) + 1
          }));
          
          setMessage('');
        } catch (error) {
          console.error('Napaka:', error);
          alert('Prišlo je do napake. Prosimo, poskusite ponovno.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setShowUpgradeModal(true);
      }
    }
  }, [message, userData, user, lastRequestTime, chatHistory, selectedSubject]);

  if (loading) return <div>Nalaganje...</div>;
  if (!user) return <div>Prosimo, prijavite se.</div>;
  if (showUserInfoForm) return <UserInfoForm onComplete={handleUserInfoComplete} />;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4">
        <div className="mb-4">
          <span className="font-semibold">Preostala vprašanja: {userData?.remainingQuestions || 0}</span>
          <ProgressBar progress={userData?.progress || 0} />
        </div>
        <h2 className="text-xl font-bold mb-2">Predmeti</h2>
        <ul>
          {subjects.map((subject) => (
            <li
              key={subject.name}
              className={`flex items-center p-2 cursor-pointer ${
                selectedSubject === subject.name ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setSelectedSubject(subject.name)}
            >
              {subject.icon}
              <span className="ml-2">{subject.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Vnesite svoje vprašanje..."
              className="flex-1 p-2 rounded-l-lg bg-gray-700 text-white"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white py-2 px-4 rounded-r-lg hover:bg-blue-700 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Pošiljam...' : 'Pošlji'}
            </button>
          </form>
        </div>
      </div>
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-2">Orodja</h2>
        <ul>
          <li className="flex items-center p-2 cursor-pointer hover:bg-gray-700">
            <FaPlus />
            <span className="ml-2">Novo vprašanje</span>
          </li>
          <li className="flex items-center p-2 cursor-pointer hover:bg-gray-700">
            <FaHistory />
            <span className="ml-2">Zgodovina</span>
          </li>
          <li className="flex items-center p-2 cursor-pointer hover:bg-gray-700">
            <FaGraduationCap />
            <span className="ml-2">Učni načrt</span>
          </li>
          <li className="flex items-center p-2 cursor-pointer hover:bg-gray-700">
            <FaPlay />
            <span className="ml-2">Vaje</span>
          </li>
        </ul>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Trenutni predmet</h3>
          <div className="bg-gray-700 p-2 rounded-lg">
            <h4 className="font-bold">{selectedSubject}</h4>
            <p className="text-sm">{subjects.find(s => s.name === selectedSubject)?.description}</p>
          </div>
        </div>
      </div>
      <Tooltip />
      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
