'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '../redux/store';
import {
  selectSection,
  moveActivity,
  fetchSections,
  deleteSection,
  updateSection,
  updateActivity,
  deleteActivity,
  updateActivityOrder,
  setBulkAdd,
} from '../redux/sectionsSlice';
import RenamePopup from './RenamePopup';
import Loader from './Loader';

const SectionsList = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState('');
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [isActivity, setIsActivity] = useState(false);
  const sections = useSelector((state: RootState) => state.sections.sections);
  const selectedSectionId = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const loading = useSelector((state: RootState) => state.sections.loading);
  const menuRef = useRef<HTMLDivElement>(null);
  const renamePopupRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const handleSelectSection = (sectionId: string) => {
    dispatch(selectSection(sectionId));
  };

  const handleRemoveSection = (sectionId: string) => {
    dispatch(deleteSection(sectionId));
    setIsMenuOpen({});
  };

  const handleRemoveActivity = (sectionId: string, activityId: string) => {
    dispatch(deleteActivity({ sectionId, activityId }));
    setIsMenuOpen({});
  };

  const handleRenameSection = (sectionId: string, newName: string) => {
    dispatch(updateSection({ sectionId, newName }));
    setEditingId(null);
  };

  const handleRenameActivity = (
    sectionId: string,
    activityId: string,
    newName: string
  ) => {
    dispatch(updateActivity({ sectionId, activityId, newName }));
    setEditingId(null);
  };

  const handleRenameClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string,
    name: string,
    isActivity: boolean
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const top = rect.bottom - 50 + window.scrollY;
    const left = rect.left + window.scrollX;
    setEditingId(id);
    setCurrentName(name);
    setIsActivity(isActivity);
    setPopupPosition({ top, left });
    setIsMenuOpen({});
  };

  const toggleSectionMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const toggleActivityMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    activityId: string
  ) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => ({ ...prev, [activityId]: !prev[activityId] }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (
      source.droppableId !== destination.droppableId ||
      source.index === destination.index
    ) {
      return;
    }

    const section = sections.find((s) => s._id === source.droppableId);
    if (!section) return;
    const newActivities = Array.from(section.activities);
    const [removed] = newActivities.splice(source.index, 1);
    newActivities.splice(destination.index, 0, removed);

    dispatch(
      moveActivity({
        sectionId: source.droppableId,
        fromIndex: source.index,
        toIndex: destination.index,
      })
    );

    dispatch(
      updateActivityOrder({
        sectionId: source.droppableId,
        orderedActivities: newActivities.map((a) => a._id),
      })
    );
  };

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-full">
      {loading ? (
        <Loader />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          {sections.map((section) => (
            <div
              key={section._id}
              className="bg-white shadow rounded mb-2 relative activity-form"
            >
              <div
                onClick={() => {
                  handleSelectSection(section._id);
                  toggleSection(section._id);
                }}
                className={`flex gap-4 p-4 justify-between items-center cursor-pointer${
                  section._id === selectedSectionId ? ' font-bold' : ''
                }`}
              >
                <span
                  className={`transform transition-transform ${
                    expandedSections[section._id] ? 'rotate-90' : ''
                  }`}
                >
                  &#9654;
                </span>
                <span>{section.name}</span>
                <button
                  onClick={(event) => toggleSectionMenu(event, section._id)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  ⋮
                </button>
                {isMenuOpen[section._id] && (
                  <div
                    className="origin-top-right absolute right-0 mt-28 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                    ref={menuRef}
                  >
                    <ul>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => dispatch(setBulkAdd(true))}
                      >
                        {t('addList')}
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(event) => {
                          handleRenameClick(
                            event,
                            section._id,
                            section.name,
                            false
                          );
                        }}
                      >
                        {t('rename')}
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRemoveSection(section._id)}
                      >
                        {t('delete')}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {expandedSections[section._id] && (
                <Droppable droppableId={section._id}>
                  {(provided) => (
                    <div
                      className={'p-4 pt-0'}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {section.activities.map((activity, index) => (
                        <Draggable
                          key={activity._id}
                          draggableId={activity._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`flex gap-2 p-2 my-1 bg-gray-100 rounded first:mt-0 last:mb-0 ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <span className="block">{index + 1}.</span>{' '}
                              {activity.name}
                              <button
                                onClick={(event) =>
                                  toggleActivityMenu(event, activity._id)
                                }
                                className="text-gray-500 hover:text-gray-700 ml-auto pl-2 pr-2 h-fit"
                              >
                                ⋮
                              </button>
                              {isMenuOpen[activity._id] && (
                                <div
                                  className="origin-top-right absolute right-0 mt-28 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                  ref={menuRef}
                                >
                                  <ul>
                                    <li
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={(event) => {
                                        handleRenameClick(
                                          event,
                                          activity._id,
                                          activity?.name,
                                          true
                                        );
                                        setCurrentSectionId(section._id);
                                      }}
                                    >
                                      {t('rename')}
                                    </li>
                                    <li
                                      className="p-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        handleRemoveActivity(
                                          section._id,
                                          activity._id
                                        )
                                      }
                                    >
                                      {t('delete')}
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          ))}
          {editingId && (
            <div ref={renamePopupRef}>
              <RenamePopup
                currentName={currentName}
                onSave={
                  isActivity
                    ? (newName) =>
                        handleRenameActivity(
                          currentSectionId,
                          editingId,
                          newName
                        )
                    : (newName) => handleRenameSection(editingId, newName)
                }
                onCancel={() => setEditingId(null)}
                top={popupPosition.top}
                left={popupPosition.left}
              />
            </div>
          )}
        </DragDropContext>
      )}
    </div>
  );
};

export default SectionsList;
