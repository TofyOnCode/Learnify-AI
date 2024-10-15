import React from 'react';

function QuizList() {
  // Mock podatki za prikaz
  const availableQuizzes = [
    { id: 1, subject: 'Matematika', difficulty: 'Lahko', questions: 10 },
    { id: 2, subject: 'Fizika', difficulty: 'Srednje', questions: 15 },
    { id: 3, subject: 'Slovenščina', difficulty: 'Težko', questions: 20 },
    { id: 4, subject: 'Angleščina', difficulty: 'Lahko', questions: 12 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Razpoložljivi kvizi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableQuizzes.map(quiz => (
          <div key={quiz.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{quiz.subject}</h3>
            <p className="text-gray-600 mb-4">Težavnost: {quiz.difficulty}</p>
            <p className="text-gray-600 mb-4">Število vprašanj: {quiz.questions}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Začni kviz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;

