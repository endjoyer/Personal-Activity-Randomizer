import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useTranslation } from 'react-i18next';
import styles from './ActivityRandomizer.module.css';
import {
  addUsedActivity,
  resetUsedActivities,
  toggleRepeatActivities,
  toggleWeightedRandom,
} from '@/redux/sectionsSlice';
import { loadState, saveState } from '@/utils/localStorageHelpers';

const ActivityRandomizer = () => {
  const [randomActivity, setRandomActivity] = useState<string | null>(null);
  const [activityAnimationState, setActivityAnimationState] =
    useState('entered');
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
  const { t } = useTranslation();

  // Загружаем состояние чекбоксов из localStorage при монтировании компонента
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

  // Обработчики для переключения чекбоксов и сохранения их состояния в localStorage
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

      // Фильтруем уже выданные активности, если повторение отключено
      if (!repeatActivities) {
        availableActivities = selectedActivities.filter(
          (_, index) => !usedActivities.includes(index)
        );
      }

      // Если доступных активностей нет, сбрасываем список и начинаем сначала
      if (availableActivities.length === 0) {
        dispatch(resetUsedActivities());
        availableActivities = selectedActivities;
      }

      let randomIndex;
      if (weightedRandom) {
        // Создаем взвешенный список активностей
        const weightedList = availableActivities.flatMap((activity, index) =>
          Array.from(
            { length: availableActivities.length - index },
            () => activity
          )
        );
        // Выбираем случайный индекс из взвешенного списка
        randomIndex = Math.floor(Math.random() * weightedList.length);
        // Находим индекс выбранной активности в исходном массиве
        const originalIndex = selectedActivities.indexOf(
          weightedList[randomIndex]
        );
        setRandomActivity(weightedList[randomIndex].name);
        // Добавляем индекс выбранной активности в список использованных
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

  // Эффект для сброса списка использованных активностей при смене раздела
  useEffect(() => {
    dispatch(resetUsedActivities());
  }, [selectedSection, dispatch]);

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
            title={t('weightedRandomTitle')}
            type="checkbox"
            className="activity-form hover:cursor-pointer"
            checked={weightedRandom}
            onChange={handleToggleWeightedRandom}
          />
          {t('weightedRandom')}
        </label>
        <label>
          <input
            type="checkbox"
            className="activity-form hover:cursor-pointer"
            checked={!repeatActivities}
            onChange={handleToggleRepeatActivities}
          />
          {t('excludeRepeatActivities')}
        </label>
      </div>
    </div>
  );
};

export default ActivityRandomizer;
