'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
  selectSection,
  addNewSection,
  addNewActivity,
} from '../redux/sectionsSlice';

const ActivityForm = () => {
  const [input, setInput] = useState('');
  const selectedSection = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const dispatch = useDispatch();

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
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

  const handleResetSelection = () => {
    dispatch(selectSection(null));
  };

  return (
    <div className="p-4 flex items-center gap-2">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleAdd}
        placeholder={
          selectedSection ? 'Добавить активность в раздел' : 'Добавить раздел'
        }
      />
      {selectedSection && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleResetSelection}
        >
          Сбросить
        </button>
      )}
    </div>
  );
};

export default ActivityForm;
