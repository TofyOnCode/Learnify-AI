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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Vaše ime"
        required
      />
      <input
        type="text"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        placeholder="Ime šole"
        required
      />
      <select
        value={schoolType}
        onChange={(e) => setSchoolType(e.target.value)}
        required
      >
        <option value="">Izberite tip šole</option>
        <option value="osnovna">Osnovna šola</option>
        <option value="srednja">Srednja šola</option>
        <option value="poklicna">Poklicna šola</option>
        <option value="tehnicna">Tehnična šola</option>
        <option value="gimnazija">Gimnazija</option>
      </select>
      <button type="submit">Shrani</button>
    </form>
  );
};

export default UserInfoForm;
