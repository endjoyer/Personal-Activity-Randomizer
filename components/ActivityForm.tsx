'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addSection, addActivity } from '../redux/sectionsSlice';

const ActivityForm = () => {
  const [input, setInput] = useState('');
  const selectedSection = useSelector((state: RootState) => state.sections.selectedSection);
  const dispatch = useDispatch();

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      if (selectedSection) {
        dispatch(addActivity({ sectionId: selectedSection, activityName: input }));
      } else {
        dispatch(addSection(input));
      }
      setInput('');
    }
  };

  return (
    <div className="p-4">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleAdd}
        placeholder={selectedSection ? 'Добавить активность в раздел' : 'Добавить раздел'}
      />
    </div>
  );
};

export default ActivityForm;
