import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useTranslation } from 'react-i18next';
import styles from './ActivityRandomizer.module.css';

const ActivityRandomizer = () => {
  const [randomActivity, setRandomActivity] = useState<string | null>(null);
  const [activityAnimationState, setActivityAnimationState] =
    useState('entered');
  const [weightedRandom, setWeightedRandom] = useState(false);
  const selectedSection = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const sections = useSelector((state: RootState) => state.sections.sections);
  const selectedActivities = sections.find(
    (section) => section._id === selectedSection
  )?.activities;
  const selectedSectionName = sections.find(
    (section) => section._id === selectedSection
  )?.name;
  const { t } = useTranslation();

  const handleRandomize = () => {
    setActivityAnimationState('entering');
    setTimeout(() => setActivityAnimationState('entered'), 10);

    if (selectedActivities && selectedActivities.length > 0) {
      let randomIndex;
      if (weightedRandom) {
        const weightedList = selectedActivities.flatMap((activity, index) =>
          Array.from(
            { length: selectedActivities.length - index },
            () => activity
          )
        );
        randomIndex = Math.floor(Math.random() * weightedList.length);
        setRandomActivity(weightedList[randomIndex].name);
      } else {
        randomIndex = Math.floor(Math.random() * selectedActivities.length);
        setRandomActivity(selectedActivities[randomIndex].name);
      }
    }
  };

  return (
    <div className={styles.randomizerContainer}>
      <button
        className={`${styles.randomizeButton} activity-form`}
        onClick={handleRandomize}
      >
        {t('randomizer')}
      </button>
      <div className={styles.randomActivityDisplay}>
        <p className="text-lg font-semibold">
          {selectedSectionName ? selectedSectionName : t('selectSection')}
        </p>
        {selectedSectionName && randomActivity && (
          <p
            className={`${styles.activityName} ${styles[activityAnimationState]}`}
          >
            {randomActivity}
          </p>
        )}
      </div>
      <div className={styles.toggleWeightedRandom}>
        <label>
          <input
            type="checkbox"
            className="activity-form"
            checked={weightedRandom}
            onChange={(e) => setWeightedRandom(e.target.checked)}
          />
          {t('weightedRandom')}
        </label>
      </div>
    </div>
  );
};

export default ActivityRandomizer;
