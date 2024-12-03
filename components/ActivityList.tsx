import React from 'react';
import styles from './ActivityList.module.css';
import { useDispatch } from 'react-redux';
import { addSectionWithActivities } from '../redux/sectionsSlice';
import { sections } from '../utils/activitiesData';
import axios from 'axios';

const ActivityList = () => {
  const dispatch = useDispatch();

  const handleAddSection = async (sectionId: string) => {
    const selectedSection = sections.find(
      (section) => section._id === sectionId
    );
    if (selectedSection) {
      try {
        const response = await axios.post('/api/sections', {
          name: selectedSection.name,
        });
        const newSectionId = response.data._id;

        dispatch(
          addSectionWithActivities({
            ...selectedSection,
            _id: newSectionId,
          })
        );

        try {
          const updateResponse = await fetch(
            `/api/sections/${newSectionId}/activities/bulkUpdate`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                activities: selectedSection.activities.map((activity) => ({
                  name: activity.name,
                })),
              }),
            }
          );

          if (!updateResponse.ok) {
            throw new Error('Failed to update activities');
          }
        } catch (error) {
          console.error('Error saving activities:', error);
        }
      } catch (error) {
        console.error('Error adding section to user database', error);
      }
    }
  };

  return (
    <div className={styles.activityList}>
      <h2>Available Sections</h2>
      <ul>
        {sections.map((section) => (
          <li key={section._id} className={styles.activityItem}>
            <h3 className={styles.activityTitle}>{section.name}</h3>
            <p className={styles.activityDescription}>
              {section.activities.map((activity) => activity.name).join(', ')}
            </p>
            <button
              className={styles.addButton}
              onClick={() => handleAddSection(section._id)}
            >
              Add Section
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
