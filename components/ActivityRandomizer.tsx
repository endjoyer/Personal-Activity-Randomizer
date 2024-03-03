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
    (section) => section._id === selectedSection
  )?.activities;

  const handleRandomize = () => {
    if (selectedActivities && selectedActivities.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedActivities.length);
      setRandomActivity(selectedActivities[randomIndex].name);
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleRandomize}
      >
        Рандомайзер
      </button>
      <div className="mt-4">
        {selectedSection ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold">Случайная активность:</h3>
            <p className="text-xl">
              {randomActivity || 'Нажмите кнопку для выбора'}
            </p>
          </div>
        ) : (
          <p className="text-center">Выберите раздел</p>
        )}
      </div>
    </div>
  );
};

export default ActivityRandomizer;
