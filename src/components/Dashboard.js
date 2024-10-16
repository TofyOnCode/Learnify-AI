import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaHistory, FaGraduationCap, FaPlay, FaInfoCircle, FaQuestionCircle } from 'react-icons/fa';
import { RiCalculatorLine } from 'react-icons/ri';
import { GiChemicalDrop, GiAtom } from 'react-icons/gi';
import { IoLanguage } from 'react-icons/io5';
import Tooltip from './Tooltip';
import ProgressBar from './ProgressBar';
import openaiService from '../services/openai';

const Dashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [message, setMessage] = useState('');
  const [remainingQuestions, setRemainingQuestions] = useState(5);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [showTutorial, setShowTutorial] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const MIN_REQUEST_INTERVAL = 3000; // 3 sekunde med zahtevami

  const subjects = [
    { name: 'Matematika', icon: <RiCalculatorLine />, description: 'Matematične naloge in koncepti' },
    { name: 'Kemija', icon: <GiChemicalDrop />, description: 'Kemijske formule in reakcije' },
    { name: 'Angleščina', icon: <IoLanguage />, description: 'Učenje angleškega jezika' },
    { name: 'Fizika', icon: <GiAtom />, description: 'Fizikalni zakoni in pojavi' },
  ];

  useEffect(() => {
    if (showTutorial) {
      // Tukaj bi prikazali vodič za nove uporabnike
      setTimeout(() => setShowTutorial(false), 5000);
    }
  }, [showTutorial]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      alert(`Prosimo, počakajte ${Math.ceil((MIN_REQUEST_INTERVAL - (now - lastRequestTime)) / 1000)} sekund pred naslednjo zahtevo.`);
      return;
    }

    if (message.trim() && remainingQuestions > 0) {
      setIsLoading(true);
      setLastRequestTime(now);
      try {
        const userMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMessage]);
        
        const aiResponse = await openaiService.generateResponse(message);
        const aiMessage = { role: 'assistant', content: aiResponse };
        setChatHistory(prev => [...prev, aiMessage]);
        
        setMessage('');
        setRemainingQuestions(prev => prev - 1);
      } catch (error) {
        console.error('Napaka pri generiranju odgovora:', error);
        alert('Prišlo je do napake. Prosimo, poskusite ponovno.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [message, remainingQuestions, lastRequestTime]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Levi stolpec */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-6 flex items-center justify-center hover:bg-blue-700 transition duration-300">
          <FaPlus className="mr-2" /> NOV POGOVOR
        </button>
        <div className="flex-grow">
          <h2 className="text-lg font-semibold mb-4">AI INŠTRUKTOR</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {subjects.map((subject) => (
              <Tooltip key={subject.name} content={subject.description}>
                <button
                  onClick={() => setSelectedSubject(subject.name)}
                  className={`flex items-center justify-center p-2 rounded-full ${
                    selectedSubject === subject.name ? 'bg-blue-600' : 'bg-gray-700'
                  } hover:bg-blue-500 transition duration-300`}
                >
                  {subject.icon}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <button className="flex items-center text-gray-400 hover:text-white mb-2 transition duration-300">
            <FaGraduationCap className="mr-2" /> Matura AI
          </button>
          <button className="flex items-center text-gray-400 hover:text-white transition duration-300">
            <FaHistory className="mr-2" /> Zgodovina pogovorov
          </button>
        </div>
      </div>

      {/* Glavni del */}
      <div className="flex-grow p-6 relative overflow-y-auto">
        {showTutorial && (
          <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white p-4 rounded-b-lg">
            Dobrodošli! Kliknite tukaj za kratek vodič po platformi.
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">Hej Timon, dobrodošel! 👋</h1>
        <p className="mb-6">Začni tako, da naložiš sliko naloge ali pogledaš primer vprašanja.</p>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {msg.content}
              </span>
            </div>
          ))}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tvoje sporočilo... (ne vpisuj osebnih podatkov)"
              className="w-full bg-gray-700 text-white p-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Pošiljam...' : 'Pošlji'}
            </button>
          </form>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Odgovarjal ti bo AI model, zato so napake in presenečenja mogoča. Sporoči nam svoje mnenje.
        </p>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">PREIZKUSI PRIMERE VPRAŠANJ:</h3>
          <div className="flex gap-2">
            <button className="bg-gray-700 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 transition duration-300">
              Linearna funkcija
            </button>
            <button className="bg-gray-700 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 transition duration-300">
              Kotne funkcije
            </button>
            <button className="bg-gray-700 text-white py-1 px-3 rounded-lg text-sm hover:bg-gray-600 transition duration-300">
              Odvod
            </button>
          </div>
        </div>
      </div>

      {/* Desni stolpec */}
      <div className="w-64 bg-gray-800 p-4">
        <div className="mb-4">
          <span className="font-semibold">Preostala vprašanja: {remainingQuestions}/{totalQuestions}</span>
          <ProgressBar progress={(remainingQuestions / totalQuestions) * 100} />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 transition duration-300">
          NADGRADI RAČUN
        </button>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center">
            <FaPlay className="mr-1" /> ZVOKI ZA UČENJE
          </span>
          <FaInfoCircle className="cursor-pointer hover:text-blue-400 transition duration-300" />
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Današnji napredek:</h4>
          <ProgressBar progress={60} /> {/* Primer napredka */}
        </div>
        <button className="mt-4 w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center">
          <FaQuestionCircle className="mr-2" /> Pomoč
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
