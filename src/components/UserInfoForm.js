import React, { useState } from 'react';

const UserInfoForm = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [schoolType, setSchoolType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ name, school, schoolType });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Dobrodošli! Povejte nam več o sebi</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 focus:border-green-500 focus:bg-gray-600 focus:ring-2 focus:ring-green-500 text-base outline-none text-white transition duration-200"
                placeholder="Vaše ime"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 focus:border-green-500 focus:bg-gray-600 focus:ring-2 focus:ring-green-500 text-base outline-none text-white transition duration-200"
                placeholder="Ime šole"
                required
              />
            </div>
            <div>
              <select
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border-gray-600 focus:border-green-500 focus:bg-gray-600 focus:ring-2 focus:ring-green-500 text-base outline-none text-white transition duration-200"
                required
              >
                <option value="">Izberite tip šole</option>
                <option value="osnovna">Osnovna šola</option>
                <option value="srednja">Srednja šola</option>
                <option value="poklicna">Poklicna šola</option>
                <option value="tehnicna">Tehnična šola</option>
                <option value="gimnazija">Gimnazija</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline transition duration-200"
              >
                Shrani in nadaljuj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
