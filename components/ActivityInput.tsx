import React from 'react';

interface ActivityInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (value: string) => void;
  isBulkAdd: boolean;
  isEditing: boolean;
}

const ActivityInput: React.FC<ActivityInputProps> = ({
  value,
  onChange,
  onKeyPress,
  isBulkAdd,
  isEditing,
}) => {
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      onKeyPress(e.currentTarget.value);
    }
  };

  return isBulkAdd || isEditing ? (
    <textarea
      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight resize focus:outline-none focus:shadow-outline mw-5 h-80 w-72 lg:w-[32rem]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <input
      className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => handleKeyPress(e)}
    />
  );
};

export default React.memo(ActivityInput);
