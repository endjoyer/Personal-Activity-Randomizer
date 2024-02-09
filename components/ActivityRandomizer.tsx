import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ActivityRandomizer = () => {
  const [randomActivity, setRandomActivity] = useState<string | null>(null);
  const selectedSection = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const sections = useSelector((state: RootState) => state.sections.sections);
  const selectedActivities = sections.find(
    (section) => section.id === selectedSection
  )?.activities;

  const handleRandomize = () => {
    if (selectedActivities && selectedActivities.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedActivities.length);
      setRandomActivity(selectedActivities[randomIndex].name);
    }
  };

  return (
    <div>
      <button onClick={handleRandomize}>Рандомайзер</button>
      {selectedSection ? (
        <div>
          <h3>Случайная активность:</h3>
          <p>{randomActivity || 'Нажмите кнопку для выбора'}</p>
        </div>
      ) : (
        <p>Выберите раздел</p>
      )}
    </div>
  );
};

export default ActivityRandomizer;
