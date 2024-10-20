'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@nextui-org/button';
import { AppDispatch, RootState } from '../redux/store';
import {
  addNewSection,
  addNewActivity,
  updateSection,
} from '../redux/sectionsSlice';

const ActivityForm = () => {
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const isBulkAdd = useSelector((state: RootState) => state.sections.isBulkAdd);
  const selectedSection = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const sections = useSelector((state: RootState) => state.sections.sections);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const dispatchActivity = async (sectionId: string, activityName: string) => {
    if (sectionId === 'all-activities') return;
    await dispatch(addNewActivity({ sectionId, activityName })).unwrap();
  };

  useEffect(() => {
    if (isBulkAdd) {
      setIsEditing(true);
      const sectionActivities =
        sections
          .find((section) => section._id === selectedSection)
          ?.activities.map(
            (activity, index) => `${index + 1}. ${activity.name}`
          ) || [];
      setInput(sectionActivities.join('\n'));
    } else {
      setIsEditing(false);
      setInput('');
    }
  }, [isBulkAdd, selectedSection, sections]);

  const handleSaveClick = async () => {
    if (input.trim() !== '' && selectedSection) {
      const activities = input
        .split('\n')
        .map((line) => line.replace(/^\s*\d*[-. ]?\s*/, '').trim())
        .filter((line) => line.length > 0 && !line.match(/^[-. ]+$/));

      try {
        const response = await fetch(
          `/api/sections/${selectedSection}/activities/bulkUpdate`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              activities: activities.map((name) => ({ name })),
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to update activities');
        }

        const updatedSection = await response.json();

        dispatch(updateSection(updatedSection));
      } catch (error) {
        console.error('Error saving activities:', error);
      }
    }
  };

  const handleAddClick = async () => {
    if (input.trim() !== '') {
      if (selectedSection) {
        if (selectedSection === 'all-activities') return;
        if (isBulkAdd) {
          const activities = input
            .split('\n')
            .map((line) => line.replace(/^\s*\d*[-. ]?\s*/, '').trim())
            .filter((line) => line.length > 0 && !line.match(/^[-. ]+$/));

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
    <div className="activity-form w-full pt-3 pb-10 flex items-center flex-col gap-2 mobil:p-10 mobil:pt-5">
      <h3 className="text-lg font-semibold">
        {selectedSection
          ? isEditing
            ? t('editList')
            : isBulkAdd
            ? t('addActivities')
            : t('addActivity')
          : t('addSection')}
      </h3>
      <div className="flex flex-col items-center gap-4 gap-2 w-full">
        {isBulkAdd || isEditing ? (
          <textarea
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight resize focus:outline-none focus:shadow-outline mw-5 h-80 w-72 lg:w-[32rem]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        ) : (
          <input
            className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
          />
        )}
        <Button
          className={`bg-gradient-to-tr from-green-500 to-blue-400 text-white shadow-lg hover:opacity-90 min-w-28 text-white font-bold py-2 px-4 rounded transition-transform duration-300 focus:outline-none`}
          type="button"
          onClick={() => {
            if (isEditing) {
              handleSaveClick();
            } else {
              handleAddClick();
            }
          }}
        >
          {isEditing ? t('save') : t('add')}
        </Button>
      </div>
    </div>
  );
};

export default ActivityForm;
