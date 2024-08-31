import React from 'react';
import styles from './NotificationPopup.module.css';

interface NotificationPopupProps {
  message: string;
  visible: boolean;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ message, visible }) => {
  return (
    <div className={`${styles.popup} ${visible ? styles.visible : ''}`}>
      {message}
    </div>
  );
};

export default NotificationPopup;
