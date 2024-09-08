'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from "@nextui-org/button";
import { AppDispatch, RootState } from '../redux/store';
import { addNewSection, addNewActivity } from '../redux/sectionsSlice';

const ActivityForm = () => {
  const [input, setInput] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const isBulkAdd = useSelector((state: RootState) => state.sections.isBulkAdd);
  const selectedSection = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const dispatchActivity = async (sectionId: string, activityName: string) => {
    if (sectionId === "all-activities") return;
    await dispatch(addNewActivity({ sectionId, activityName })).unwrap();
  };

  const handleAddClick = async () => {
    if (input.trim() !== '') {
      if (selectedSection) {
        if (selectedSection === "all-activities") return;
        if (isBulkAdd) {
          const activities = input
            .split('\n')
            .map((line) => line.replace(/^\s*\d*[-. ]?\s*/, '').trim()) // Удаляем числа и символы в начале строки
            .filter((line) => line.length > 0 && !line.match(/^[-. ]+$/)); // Игнорируем строки, состоящие только из символов пунктуации

          for (const activity of activities) {
            await dispatchActivity(selectedSection, activity);
          }
        } else {
          await dispatchActivity(selectedSection, input);
        }
      } else {
        dispatch(addNewSection(input));
      }
      setInput('');
    }
  };

  return (
    <div className="activity-form max-w-full pt-3 pb-10 flex items-center flex-col gap-2 sm:p-10 sm:pt-5">
      <h3 className="text-lg font-semibold">
        {selectedSection
          ? isBulkAdd
            ? t('addActivities')
            : t('addActivity')
          : t('addSection')}
      </h3>
      <div className="flex flex-col items-center gap-4 mobil:gap-2 mobil:flex-row">
        {isBulkAdd ? (
          <textarea
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight resize focus:outline-none focus:shadow-outline w-72 h-80"
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
        <Button
          className={`bg-gradient-to-tr from-green-500 to-blue-400 text-white shadow-lg hover:opacity-90 min-w-28 text-white font-bold py-2 px-4 rounded transition-transform duration-300 focus:outline-none ${isClicked ? 'scale-90' : ''
            }`}
          type="button"
          onClick={() => {
            handleAddClick();
            setIsClicked(true);
            setTimeout(() => setIsClicked(false), 300);
          }}
        >
          {t('add')}
        </Button>
      </div>
    </div>
  );
};

export default ActivityForm;
