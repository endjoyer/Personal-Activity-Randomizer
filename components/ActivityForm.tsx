'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { addNewSection, addNewActivity } from '../redux/sectionsSlice';

const ActivityForm = () => {
  const [input, setInput] = useState('');
  const selectedSection = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleAddClick = () => {
    if (input.trim() !== '') {
      if (selectedSection) {
        dispatch(
          addNewActivity({ sectionId: selectedSection, activityName: input })
        );
      } else {
        dispatch(addNewSection(input));
      }
      setInput('');
    }
  };

  return (
    <div className="activity-form p-4 flex flex-col gap-2">
      <h3 className="text-lg font-semibold">
        {selectedSection ? 'Добавить активность' : 'Добавить раздел'}
      </h3>
      <div className="flex items-center gap-2">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleAddClick}
        >
          Добавить
        </button>
      </div>
    </div>
  );
};

export default ActivityForm;
