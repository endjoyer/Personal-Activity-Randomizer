import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import SectionsList from './SectionsList';
import LogoutButton from './LogoutButton';
import styles from './HamburgerMenu.module.css';
import { logout } from '@/redux/authSlice';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(logout());
    router.push('/login');
    closeMenu();
  };

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
      <div className={styles.hamburgerMenu} ref={menuRef}>
        <input
          className={styles.checkbox}
          type="checkbox"
          id="hamburger-menu-checkbox"
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
        <label
          htmlFor="hamburger-menu-checkbox"
          className={styles.hamburgerLines}
        >
          <span className={`${styles.line} ${styles.line1}`}></span>
          <span className={`${styles.line} ${styles.line2}`}></span>
          <span className={`${styles.line} ${styles.line3}`}></span>
        </label>
        <div className={styles.menuItems}>
          <div className={styles.logo}>
            <h1>{t('randomizer')}</h1>
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
