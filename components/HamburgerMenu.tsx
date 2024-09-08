import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import SectionsList from './SectionsList';
import LogoutButton from './LogoutButton';
import styles from './HamburgerMenu.module.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    Cookies.set('i18next', language);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className={`${styles.hamburgerMenu} ${isOpen ? styles.open : ''}`} ref={menuRef}>
        <div
          className={`activity-form ${styles.hamburgerLines}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`${styles.line} ${isOpen ? styles.line1Open : ''}`}></span>
          <span className={`${styles.line} ${isOpen ? styles.line2Open : ''}`}></span>
          <span className={`${styles.line} ${isOpen ? styles.line3Open : ''}`}></span>
        </div>
        <div className={styles.menuItems}>
          <div className={styles.logo}>
            <h1>PAR</h1>
            <p className={styles.username}>{Cookies.get('username')}</p>
          </div>
          <div className={styles.logoutButton}>
            <LogoutButton />
          </div>
          <div className={styles.languageButtons}>
            <button onClick={() => changeLanguage('en')}>EN</button>
            <button onClick={() => changeLanguage('ru')}>RU</button>
          </div>
          <SectionsList />
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;