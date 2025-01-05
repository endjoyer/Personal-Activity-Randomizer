import React from 'react';
import { Button } from '@nextui-org/button';

interface ActivityButtonProps {
  isEditing: boolean;
  onClick: () => void;
  label: string;
}

const ActivityButton: React.FC<ActivityButtonProps> = ({
  isEditing,
  onClick,
  label,
}) => {
  return (
    <Button
      className={`bg-gradient-to-tr from-green-500 to-blue-400 text-white shadow-lg hover:opacity-90 min-w-28 text-white font-bold py-2 px-4 rounded transition-transform duration-300 focus:outline-none`}
      type="button"
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default React.memo(ActivityButton);
