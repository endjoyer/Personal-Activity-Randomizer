'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addSection, addActivity } from '../redux/sectionsSlice';

const ActivityForm = () => {
  const [input, setInput] = useState('');
  const selectedSection = useSelector((state: RootState) => state.sections.selectedSection);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (selectedSection) {
      dispatch(addActivity({ sectionId: selectedSection, activityName: input }));
    } else {
      dispatch(addSection(input));
    }
    setInput('');
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={selectedSection ? 'Добавить активность в раздел' : 'Добавить раздел'}
      />
      <button onClick={handleAdd}>{selectedSection ? 'Добавить активность' : 'Добавить раздел'}</button>
    </div>
  );
};

export default ActivityForm;
