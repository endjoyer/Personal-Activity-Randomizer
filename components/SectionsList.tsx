'use client';
import React, { useState } from 'react';
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

const SectionsList = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const sections = useSelector((state: RootState) => state.sections.sections);
  const selectedSectionId = useSelector(
    (state: RootState) => state.sections.selectedSection
  );
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

  const handleRename = () => {
    if (editingId && newName) {
      dispatch(renameSection({ sectionId: editingId, newName }));
      setEditingId(null);
      setNewName('');
    }
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {sections.map((section) => (
        <div key={section.id}>
          <div
            onClick={() => handleSelectSection(section.id)}
            style={{
              fontWeight: section.id === selectedSectionId ? 'bold' : 'normal',
            }}
          >
            {section.name}
            <button onClick={() => handleRemoveSection(section.id)}>
              Удалить раздел
            </button>
            <button onClick={() => setEditingId(section.id)}>
              Переименовать раздел
            </button>
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
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {activity.name}
                        <button
                          onClick={() =>
                            handleRemoveActivity(section.id, activity.id)
                          }
                        >
                          Удалить активность
                        </button>
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
        <div>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button onClick={handleRename}>Сохранить новое имя</button>
        </div>
      )}
    </DragDropContext>
  );
};

export default SectionsList;
