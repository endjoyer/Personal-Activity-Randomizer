import React, { useState, useEffect, useRef } from 'react';

interface RenamePopupProps {
  currentName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
  top: number;
  left: number;
}

const RenamePopup: React.FC<RenamePopupProps> = ({
  currentName,
  onSave,
  onCancel,
  top,
  left,
}) => {
  const [newName, setNewName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onSave(newName);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSave, newName]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSave(newName);
    } else if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="absolute z-10 bg-white p-4 border rounded shadow-lg"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <input
        ref={inputRef}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default RenamePopup;
