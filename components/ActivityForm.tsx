'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '../redux/store';
import { addNewSection, addNewActivity } from '../redux/sectionsSlice';

const ActivityForm = () => {
  const [input, setInput] = useState('');
  const isBulkAdd = useSelector((state: RootState) => state.sections.isBulkAdd);
  const selectedSection = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleAddClick = () => {
    if (input.trim() !== '') {
      if (selectedSection) {
        if (isBulkAdd) {
          const activities = input
            .split('\n')
            .map((line) => line.replace(/^\s*\d*[-. ]?\s*/, '').trim()) // Удаляем числа и символы в начале строки
            .filter((line) => line.length > 0 && !line.match(/^[-. ]+$/)); // Игнорируем строки, состоящие только из символов пунктуации

          activities.forEach((activity) => {
            dispatch(
              addNewActivity({
                sectionId: selectedSection,
                activityName: activity,
              })
            );
          });
        } else {
          dispatch(
            addNewActivity({ sectionId: selectedSection, activityName: input })
          );
        }
      } else {
        dispatch(addNewSection(input));
      }
      setInput('');
    }
  };

  return (
    <div className="activity-form max-w-full p-10 pt-5 flex flex-col gap-2">
      <h3 className="text-lg font-semibold">
        {selectedSection
          ? isBulkAdd
            ? t('addActivities')
            : t('addActivity')
          : t('addSection')}
      </h3>
      <div className="flex items-center gap-2">
        {isBulkAdd ? (
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight resize focus:outline-none focus:shadow-outline"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
          />
        ) : (
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
          />
        )}
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded active:shadow-lg active:bg-green-500 focus:shadow-outline transition-all duration-300"
          type="button"
          onClick={handleAddClick}
        >
          {t('add')}
        </button>
      </div>
    </div>
  );
};

export default ActivityForm;
