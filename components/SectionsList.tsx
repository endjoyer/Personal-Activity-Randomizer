'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import caretRightIcon from '../public/images/caret-right.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useTranslation } from 'react-i18next';
import { AppDispatch, RootState } from '../redux/store';
import {
  selectSection,
  moveActivity,
  moveSection,
  fetchSections,
  deleteSection,
  updateNameSection,
  updateActivity,
  deleteActivity,
  updateActivityOrder,
  setBulkAdd,
  updateSectionOrder,
} from '../redux/sectionsSlice';
import RenamePopup from './RenamePopup';
import Loader from './Loader';

const SectionsList = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>(() => {
    const savedState = localStorage.getItem('expandedSections');
    return savedState ? JSON.parse(savedState) : {};
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState('');
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [isActivity, setIsActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sections = useSelector((state: RootState) => state.sections.sections);
  const selectedSectionId = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const renamePopupRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();

  const hasFetchedSections = useRef(false);

  useEffect(() => {
    if (!hasFetchedSections.current) {
      const fetchData = async () => {
        await dispatch(fetchSections());
        setIsLoading(false);
      };
      fetchData();
      hasFetchedSections.current = true;
    }
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

  const handleSelectSection = useCallback(
    (sectionId: string) => {
      dispatch(selectSection(sectionId));
    },
    [dispatch]
  );

  const handleRemoveSection = useCallback(
    (sectionId: string) => {
      dispatch(deleteSection(sectionId));
      setIsMenuOpen({});
    },
    [dispatch]
  );

  const handleRemoveActivity = useCallback(
    (sectionId: string, activityId: string) => {
      dispatch(deleteActivity({ sectionId, activityId }));
      setIsMenuOpen({});
    },
    [dispatch]
  );

  const handleEditList = useCallback(
    (sectionId: string) => {
      dispatch(selectSection(sectionId));
      setTimeout(() => {
        dispatch(setBulkAdd(true));
      }, 0);
    },
    [dispatch]
  );

  const handleRenameSection = useCallback(
    (sectionId: string, newName: string) => {
      dispatch(updateNameSection({ sectionId, newName }));
      setEditingId(null);
    },
    [dispatch]
  );

  const handleRenameActivity = useCallback(
    (sectionId: string, activityId: string, newName: string) => {
      dispatch(updateActivity({ sectionId, activityId, newName }));
      setEditingId(null);
    },
    [dispatch]
  );

  const handleRenameClick = useCallback(
    (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      id: string,
      name: string,
      isActivity: boolean
    ) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const top = rect.bottom - 130 + window.scrollY;
      const left = rect.left + window.scrollX;
      setEditingId(id);
      setCurrentName(name);
      setIsActivity(isActivity);
      setPopupPosition({ top, left });
      setIsMenuOpen({});
    },
    []
  );

  const toggleSectionMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
      event.stopPropagation();
      setIsMenuOpen((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
    },
    []
  );

  const toggleActivityMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, activityId: string) => {
      event.stopPropagation();
      setIsMenuOpen((prev) => ({ ...prev, [activityId]: !prev[activityId] }));
    },
    []
  );

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newState = { ...prev, [sectionId]: !prev[sectionId] };
      localStorage.setItem('expandedSections', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;

      if (
        source.droppableId === 'sections' &&
        destination.droppableId === 'sections'
      ) {
        dispatch(
          moveSection({ fromIndex: source.index, toIndex: destination.index })
        );

        const newSections = Array.from(sections);
        const [removed] = newSections.splice(source.index, 1);
        newSections.splice(destination.index, 0, removed);
        dispatch(updateSectionOrder(newSections.map((section) => section._id)));
      } else if (
        source.droppableId !== destination.droppableId ||
        source.index === destination.index
      ) {
        return;
      } else {
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
      }
    },
    [dispatch, sections]
  );

  if (isLoading) {
    return (
      <div className="relative w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="SECTIONS">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map((section, index) => (
                <Draggable
                  key={section._id}
                  draggableId={section._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white shadow rounded mb-2 relative activity-form"
                      onClick={() => {
                        handleSelectSection(section._id);
                      }}
                    >
                      <div
                        className={`flex gap-4 p-4 pr-3 pl-3 justify-between items-center`}
                      >
                        <span
                          className={`p-1 transform transition-transform cursor-pointer ${
                            expandedSections[section._id] ? 'rotate-90' : ''
                          }`}
                          onClick={() => {
                            toggleSection(section._id);
                          }}
                        >
                          <Image
                            src={caretRightIcon}
                            alt="Toggle Section"
                            width={25}
                            height={25}
                          />
                        </span>
                        <span
                          className={`text-center break-words overflow-hidden ${
                            section._id === 'all-activities'
                              ? 'absolute left-1/2 transform -translate-x-1/2'
                              : ''
                          } ${
                            section._id === selectedSectionId
                              ? ' font-bold'
                              : ''
                          }`}
                          title={section.name}
                        >
                          {section.name}
                        </span>
                        {section._id !== 'all-activities' && (
                          <button
                            onClick={(event) =>
                              toggleSectionMenu(event, section._id)
                            }
                            className="text-gray-500 hover:text-gray-700 p-1 pr-2 pl-2"
                          >
                            ⋮
                          </button>
                        )}
                        {isMenuOpen[section._id] && (
                          <div
                            className="activity-form origin-top-right absolute right-0 mt-40 mr-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                            ref={menuRef}
                          >
                            <ul>
                              <li
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleEditList(section._id)}
                              >
                                {t('editList')}
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
                        <Droppable droppableId={section._id} type="ACTIVITIES">
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
                                      <span className="block">
                                        {index + 1}.
                                      </span>
                                      <span
                                        className="break-words overflow-hidden"
                                        title={activity.name}
                                      >
                                        {activity.name}
                                      </span>
                                      {section._id !== 'all-activities' && (
                                        <button
                                          onClick={(event) =>
                                            toggleActivityMenu(
                                              event,
                                              activity._id
                                            )
                                          }
                                          className="text-gray-500 hover:text-gray-700 ml-auto pl-2 pr-2 h-fit"
                                        >
                                          ⋮
                                        </button>
                                      )}
                                      {isMenuOpen[activity._id] &&
                                        section._id !== 'all-activities' && (
                                          <div
                                            className="activity-form origin-top-right absolute right-0 mt-8 mr-4 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
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
                                                  setCurrentSectionId(
                                                    section._id
                                                  );
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {editingId && (
          <div ref={renamePopupRef}>
            <RenamePopup
              currentName={currentName}
              onSave={
                isActivity
                  ? (newName) =>
                      handleRenameActivity(currentSectionId, editingId, newName)
                  : (newName) => handleRenameSection(editingId, newName)
              }
              onCancel={() => setEditingId(null)}
              top={popupPosition.top}
              left={popupPosition.left}
            />
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

export default React.memo(SectionsList);
