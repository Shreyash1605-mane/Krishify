import React, { useState } from 'react';

const initialReminders = [
  { id: 1, text: 'Fertilize tomato plants', completed: false },
  { id: 2, text: 'Check irrigation system', completed: true },
  { id: 3, text: 'Order more seeds', completed: false },
];

const RemindersWidget: React.FC = () => {
  const [reminders, setReminders] = useState(initialReminders);

  const toggleReminder = (id: number) => {
    setReminders(
      reminders.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };
  
  // Sort reminders to show incomplete ones first, for better focus
  const sortedReminders = [...reminders].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg text-gray-700 mb-2">Reminders</h3>
      <ul className="space-y-2">
        {sortedReminders.map(r => (
          <li key={r.id} className="text-sm text-gray-600 flex items-center">
            <input 
              type="checkbox" 
              checked={r.completed}
              onChange={() => toggleReminder(r.id)}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
            />
            <span className={r.completed ? 'line-through text-gray-400' : ''}>{r.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemindersWidget;