import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import infoIcon from '../public/images/info.svg';
import styles from './ActivityRandomizer.module.css';
import NotificationPopup from './NotificationPopup';
import {
  addUsedActivity,
  resetUsedActivities,
  toggleRepeatActivities,
  toggleWeightedRandom,
  updateAllActivitiesSectionName,
} from '@/redux/sectionsSlice';
import { loadState, saveState } from '@/utils/localStorageHelpers';
import { Button } from '@nextui-org/button';

const ActivityRandomizer = () => {
  const [randomActivity, setRandomActivity] = useState<string | null>(null);
  const [activityAnimationState, setActivityAnimationState] =
    useState('entered');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const weightedRandom = useSelector(
    (state: RootState) => state.sections.weightedRandom
  );
  const usedActivities = useSelector(
    (state: RootState) => state.sections.usedActivities
  );
  const repeatActivities = useSelector(
    (state: RootState) => state.sections.repeatActivities
  );
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
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedRepeatActivities = loadState('repeatActivities');
    const savedWeightedRandom = loadState('weightedRandom');

    if (savedRepeatActivities !== undefined) {
      dispatch(toggleRepeatActivities(savedRepeatActivities));
    }
    if (savedWeightedRandom !== undefined) {
      dispatch(toggleWeightedRandom(savedWeightedRandom));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(updateAllActivitiesSectionName(t('allActivities')));
  }, [i18n.language, dispatch, t]);

  const handleToggleRepeatActivities = () => {
    dispatch(toggleRepeatActivities(!repeatActivities));
    saveState('repeatActivities', !repeatActivities);
  };

  const handleToggleWeightedRandom = () => {
    dispatch(toggleWeightedRandom(!weightedRandom));
    saveState('weightedRandom', !weightedRandom);
  };

  const handleRandomize = () => {
    setActivityAnimationState('entering');
    setTimeout(() => setActivityAnimationState('entered'), 10);

    if (selectedActivities && selectedActivities.length > 0) {
      let availableActivities = selectedActivities;

      if (!repeatActivities) {
        availableActivities = selectedActivities.filter(
          (_, index) => !usedActivities.includes(index)
        );
      }

      if (availableActivities.length === 0) {
        dispatch(resetUsedActivities());
        availableActivities = selectedActivities;
      }

      let randomIndex;
      if (weightedRandom) {
        const weightedList = availableActivities.flatMap((activity, index) =>
          Array.from(
            { length: availableActivities.length - index },
            () => activity
          )
        );
        randomIndex = Math.floor(Math.random() * weightedList.length);
        const originalIndex = selectedActivities.indexOf(
          weightedList[randomIndex]
        );
        setRandomActivity(weightedList[randomIndex].name);
        dispatch(addUsedActivity(originalIndex));
      } else {
        randomIndex = Math.floor(Math.random() * availableActivities.length);
        const originalIndex = selectedActivities.indexOf(
          availableActivities[randomIndex]
        );
        setRandomActivity(availableActivities[randomIndex].name);
        dispatch(addUsedActivity(originalIndex));
      }
    }
  };

  const handleCopyToClipboard = () => {
    if (randomActivity) {
      navigator.clipboard.writeText(randomActivity);
      setNotificationVisible(true);
      setTimeout(() => setNotificationVisible(false), 1000);
    }
  };

  useEffect(() => {
    dispatch(resetUsedActivities());
  }, [selectedSection, dispatch]);

  return (
    <div className={`sm:p-10 sm:pt-5 ${styles.randomizerContainer}`}>
      <div className="mb-6">
        <p className="activity-form text-lg font-semibold">
          {selectedSectionName ? selectedSectionName : t('selectSection')}
        </p>
        {selectedSectionName && randomActivity && (
          <p
            title={t('activityCopyHint')}
            className={`activity-form ${styles.activityName} ${styles[activityAnimationState]}`}
            onClick={handleCopyToClipboard}
          >
            {randomActivity}
          </p>
        )}
      </div>
      <Button
        type="button"
        className={`activity-form bg-gradient-to-tl from-pink-500 to-yellow-500 text-white shadow-lg py-2 text-white font-bold rounded transition-transform duration-300 transform focus:outline-none ${
          isClicked ? 'scale-90' : ''
        } hover:opacity-90`}
        onClick={() => {
          handleRandomize();
          setIsClicked(true);
          setTimeout(() => setIsClicked(false), 300);
        }}
      >
        {t('randomizer')}
      </Button>
      <div className={styles.toggleWeightedRandom}>
        <label
          className="activity-form max-w-fit"
          title={t('weightedRandomTitle')}
        >
          <input
            type="checkbox"
            className="hover:cursor-pointer"
            checked={weightedRandom}
            onChange={handleToggleWeightedRandom}
          />
          {t('weightedRandom')}
          <Image
            src={infoIcon}
            alt={t('infoIcon')}
            height={17}
            className="inline-block ml-2 cursor-pointer"
            title={t('weightedRandomTitle')}
          />
        </label>
        <label className="activity-form max-w-fit">
          <input
            type="checkbox"
            className="hover:cursor-pointer"
            checked={!repeatActivities}
            onChange={handleToggleRepeatActivities}
          />
          {t('excludeRepeatActivities')}
        </label>
      </div>
      <NotificationPopup
        message={t('activityCopied')}
        visible={notificationVisible}
      />
    </div>
  );
};

export default ActivityRandomizer;
