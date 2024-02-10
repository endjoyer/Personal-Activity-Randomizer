'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RootState } from '../redux/store';
import {
  selectSection,
  removeSection,
  removeActivity,
  renameSection,
  renameActivity,
  moveActivity,
} from '../redux/sectionsSlice';
import RenamePopup from './RenamePopup';

const SectionsList = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState('');
  const [currentSectionId, setCurrentSectionId] = useState('');
  const [isActivity, setIsActivity] = useState(false);
  const sections = useSelector((state: RootState) => state.sections.sections);
  const selectedSectionId = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const renamePopupRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleSelectSection = (sectionId: string) => {
    dispatch(selectSection(sectionId));
  };

  const handleRemoveSection = (sectionId: string) => {
    dispatch(removeSection(sectionId));
  };

  const handleRemoveActivity = (sectionId: string, activityId: string) => {
    dispatch(removeActivity({ sectionId, activityId }));
  };

  const handleRenameSection = (sectionId: string, newName: string) => {
    dispatch(renameSection({ sectionId, newName }));
    setEditingId(null);
  };

  const handleRenameActivity = (
    sectionId: string,
    activityId: string,
    newName: string
  ) => {
    dispatch(renameActivity({ sectionId, activityId, newName }));
    setEditingId(null);
  };

  const toggleMenu = (sectionId: string) => {
    setIsMenuOpen((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (
      source.droppableId !== destination.droppableId ||
      source.index === destination.index
    ) {
      return;
    }

    dispatch(
      moveActivity({
        sectionId: source.droppableId,
        fromIndex: source.index,
        toIndex: destination.index,
      })
    );
  };

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
    <DragDropContext onDragEnd={onDragEnd}>
      {sections.map((section) => (
        <div
          key={section.id}
          className="p-4 bg-white shadow rounded mb-2 relative"
        >
          <div
            onClick={() => handleSelectSection(section.id)}
            className={`flex justify-between items-center ${
              section.id === selectedSectionId ? 'font-bold' : ''
            }`}
          >
            <span>{section.name}</span>
            <button
              onClick={() => toggleMenu(section.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              &#8942;
            </button>
            {isMenuOpen[section.id] && (
              <div
                className="origin-top-right absolute right-0 mt-28 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                ref={menuRef}
              >
                <ul>
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setEditingId(section.id);
                      setCurrentName(section?.name || '');
                      setIsActivity(false);
                    }}
                  >
                    Переименовать
                  </li>
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRemoveSection(section.id)}
                  >
                    Удалить
                  </li>
                </ul>
              </div>
            )}
          </div>
          <Droppable droppableId={section.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {section.activities.map((activity, index) => (
                  <Draggable
                    key={activity.id}
                    draggableId={activity.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="flex justify-between items-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {activity.name}
                        <button
                          onClick={() => toggleMenu(activity.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          &#8942;
                        </button>
                        {isMenuOpen[activity.id] && (
                          <div
                            className="origin-top-right absolute right-0 mt-28 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                            ref={menuRef}
                          >
                            <ul>
                              <li
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setEditingId(activity.id);
                                  setCurrentSectionId(section.id);
                                  setCurrentName(activity?.name || '');
                                  setIsActivity(true);
                                }}
                              >
                                Переименовать
                              </li>
                              <li
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleRemoveActivity(section.id, activity.id)
                                }
                              >
                                Удалить
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
        </div>
      ))}
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
          />
        </div>
      )}
    </DragDropContext>
  );
};

export default SectionsList;
