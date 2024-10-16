import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaHistory, FaImage, FaCamera, FaTimes } from 'react-icons/fa';
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
import { storage } from '../firebase'; // Dodajte to v vaš firebase.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from "firebase/storage";

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [showUserInfoForm, setShowUserInfoForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [selectedTool, setSelectedTool] = useState('Novo vprašanje');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState({});
  const [currentChat, setCurrentChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const MIN_REQUEST_INTERVAL = 3000; // 3 sekunde med zahtevami
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const subjects = [
    { name: 'Matematika', icon: <RiCalculatorLine /> },
    { name: 'Kemija', icon: <GiChemicalDrop /> },
    { name: 'Fizika', icon: <GiAtom /> },
    { name: 'Angleščina', icon: <IoLanguage /> },
  ];

  const tools = [
    { name: 'Novo vprašanje', icon: <FaPlus /> },
    { name: 'Zgodovina', icon: <FaHistory /> },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          // Zagotovimo, da je chatHistory objekt in da so vsi vnosi seznami pogovorov
          const safeHistory = data.chatHistory || {};
          Object.keys(safeHistory).forEach(key => {
            if (!Array.isArray(safeHistory[key])) {
              safeHistory[key] = [];
            } else {
              safeHistory[key] = safeHistory[key].filter(chat => 
                chat && typeof chat === 'object' && Array.isArray(chat.messages)
              );
            }
          });
          setChatHistory(safeHistory);
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
      totalQuestions: 5,
      progress: 0,
      chatHistory: {},
      createdAt: new Date()
    });
    setShowUserInfoForm(false);
    setUserData(await getDoc(userDocRef).then(doc => doc.data()));
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setCurrentChat([]);
    setCurrentChatId(null);
    setSelectedTool('Novo vprašanje');
  };

  const handleNewQuestion = () => {
    setCurrentChat([]);
    setCurrentChatId(null);
    setMessage('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setSelectedImage(downloadURL);
      } catch (error) {
        console.error("Napaka pri nalaganju slike:", error);
      }
    }
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => {
        console.error("Napaka pri dostopu do kamere: ", err);
        alert("Ni mogoče dostopati do kamere. Preverite dovoljenja.");
      });
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setSelectedImage(imageDataUrl);
    setShowCamera(false);
    
    // Ustavimo video stream
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  };

  const uploadImage = async (imageFile) => {
    const imageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      alert(`Prosimo, počakajte ${Math.ceil((MIN_REQUEST_INTERVAL - (now - lastRequestTime)) / 1000)} sekund pred naslednjo zahtevo.`);
      return;
    }

    if (message.trim() || selectedImage) {
      if (userData.remainingQuestions > 0) {
        setIsLoading(true);
        setLastRequestTime(now);
        try {
          let userMessage = { role: 'user', content: message };
          let imageUrl = null;
          if (selectedImage) {
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            const imageFile = new File([blob], "image.jpg", { type: "image/jpeg" });
            
            imageUrl = await uploadImage(imageFile);
            userMessage.image = imageUrl;
          }
          const newChat = [...currentChat, userMessage];
          setCurrentChat(newChat);
          
          const contextMessage = `Predmet: ${selectedSubject}. Prosim, odgovorite v slovenščini. ${message}`;
          
          let aiResponse;
          if (imageUrl) {
            // Uporabi GPT-4 za sporočila s slikami in OCR
            const aiPrompt = `${contextMessage}\n\nSlika vsebuje matematično enačbo. Prosim, analiziraj prepoznano enačbo, popravi morebitne napake v prepoznavi in reši enačbo. Obrazloži svoj postopek.`;
            aiResponse = await openaiService.generateResponseWithImage(aiPrompt, newChat);
          } else {
            // Uporabi GPT-3.5 Turbo za tekstovna sporočila
            aiResponse = await openaiService.generateResponse(contextMessage, newChat);
          }
          
          const aiMessage = { role: 'assistant', content: aiResponse };
          newChat.push(aiMessage);
          setCurrentChat(newChat);
          
          const newChatId = currentChatId || Date.now().toString();
          const newChatHistory = {
            ...chatHistory,
            [selectedSubject]: [
              ...(chatHistory[selectedSubject] || []),
              { id: newChatId, messages: newChat }
            ]
          };
          
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            chatHistory: newChatHistory,
            remainingQuestions: userData.remainingQuestions - 1
          });
          
          setChatHistory(newChatHistory);
          setCurrentChatId(newChatId);
          setUserData(prev => ({
            ...prev,
            remainingQuestions: prev.remainingQuestions - 1
          }));
          
          setMessage('');
          setSelectedImage(null);
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

    if (selectedImage) {
      try {
        const response = await openaiService.generateResponseWithImage(message, currentChat, selectedImage);
        // ... ostala koda ...
      } catch (error) {
        console.error("Napaka:", error);
      }
    }
  }, [message, selectedImage, userData, user, lastRequestTime, currentChat, selectedSubject, chatHistory, currentChatId]);

  const handleToolChange = (tool) => {
    setSelectedTool(tool);
    if (tool === 'Novo vprašanje') {
      handleNewQuestion();
    }
  };

  const handleHistoryItemClick = (subject, chatId) => {
    setSelectedSubject(subject);
    const chat = chatHistory[subject].find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat.messages);
      setCurrentChatId(chatId);
      setSelectedTool('Novo vprašanje');
    }
  };

  const handleSubjectClick = (subject) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderMessage = (msg, index) => (
    <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
        {msg.image && <img src={msg.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-2" />}
        <p>{msg.content}</p>
      </div>
    </div>
  );

  if (loading) return <div>Nalaganje...</div>;
  if (!user) return <div>Prosimo, prijavite se.</div>;
  if (showUserInfoForm) return <UserInfoForm onComplete={handleUserInfoComplete} />;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {userData && (
        <div className="bg-gray-800 text-white p-4 text-center">
          <p className="text-lg font-bold">
            Pozdravljeni, {userData.name}! Dobrodošli na vaši nadzorni plošči.
          </p>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
          <div className="mb-4">
            <span className="font-semibold">Preostala vprašanja: {userData?.remainingQuestions || 0}</span>
            <ProgressBar 
              remainingQuestions={userData?.remainingQuestions || 0} 
              totalQuestions={userData?.totalQuestions || 5}
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Predmeti</h2>
          <ul>
            {subjects.map((subject) => (
              <li
                key={subject.name}
                className={`flex items-center p-2 cursor-pointer ${
                  selectedSubject === subject.name ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleSubjectChange(subject.name)}
              >
                {subject.icon}
                <span className="ml-2">{subject.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {currentChat.map((msg, index) => renderMessage(msg, index))}
          </div>
          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="flex mb-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Vnesite svoje vprašanje..."
                  className="flex-1 p-2 rounded-l-lg bg-gray-700 text-white"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-gray-600 text-white py-2 px-4 hover:bg-gray-500 transition duration-300"
                >
                  <FaImage />
                </button>
                <button 
                  type="button"
                  onClick={handleCameraCapture}
                  className="bg-gray-600 text-white py-2 px-4 hover:bg-gray-500 transition duration-300"
                >
                  <FaCamera />
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white py-2 px-4 rounded-r-lg hover:bg-blue-700 transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Pošiljam...' : 'Pošlji'}
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {selectedImage && (
                <div className="mt-2 relative">
                  <img src={selectedImage} alt="Izbrana slika" className="max-w-full h-auto rounded-lg" />
                  <button 
                    onClick={removeSelectedImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-300"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </form>
            {showCamera && (
              <div className="mt-2">
                <video ref={videoRef} className="max-w-full h-auto rounded-lg" />
                <button 
                  onClick={captureImage}
                  className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Zajemi sliko
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Orodja</h2>
          <ul>
            {tools.map((tool) => (
              <li
                key={tool.name}
                className={`flex items-center p-2 cursor-pointer ${
                  selectedTool === tool.name ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => handleToolChange(tool.name)}
              >
                {tool.icon}
                <span className="ml-2">{tool.name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Trenutni predmet</h3>
            <div className="bg-gray-700 p-2 rounded-lg">
              <h4 className="font-bold">{selectedSubject}</h4>
            </div>
          </div>
          {selectedTool === 'Zgodovina' && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Zgodovina pogovorov</h3>
              {Object.entries(chatHistory).map(([subject, chats]) => (
                <div key={subject}>
                  <h4 
                    className="font-bold text-blue-400 mb-2 cursor-pointer hover:text-blue-300"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    {subject}
                  </h4>
                  {expandedSubjects[subject] && Array.isArray(chats) && chats.map((chat, index) => (
                    <div 
                      key={chat?.id || index}
                      className="bg-gray-700 rounded-lg p-2 mb-2 cursor-pointer hover:bg-gray-600 transition duration-300"
                      onClick={() => handleHistoryItemClick(subject, chat?.id)}
                    >
                      <p className="text-sm truncate">
                        {index + 1}. {chat?.messages?.[0]?.content || 'Prazen pogovor'}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
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
