// components/HamburgerMenu.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/authSlice';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import styles from './HamburgerMenu.module.css';
import Lang from './Lang';
import LogoutButton from './LogoutButton';
import SectionsList from './SectionsList';

const HamburgerMenu = () => {
  // const [isOpen, setIsOpen] = useState(false);
  // const router = useRouter();
  // const dispatch = useDispatch();
  // const { t, i18n } = useTranslation();
  // const sections = useSelector((state: RootState) => state.sections.sections);

  // const handleLogout = () => {
  //   Cookies.remove('token');
  //   dispatch(logout());
  //   router.push('/login');
  //   setIsOpen(false);
  // };

  // const changeLanguage = (language: string) => {
  //   i18n.changeLanguage(language);
  //   Cookies.set('i18next', language);
  // };

  return (
    <>
      {/* <div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Menu'}
        </button>
        {isOpen && (
          <div className="absolute top-0 left-0 h-full w-60 bg-white shadow-md z-50">
            <div className="p-4">
              <h1>Personal Activity Randomizer</h1>
              <div>
                <button onClick={() => changeLanguage('en')}>EN</button>
                <button onClick={() => changeLanguage('ru')}>RU</button>
              </div>
              <button onClick={handleLogout}>{t('logout')}</button>
            </div>
            <nav>
              {sections.map((section) => (
                <Link key={section._id} href="#">
                  <a
                    onClick={() => {
                      dispatch(selectSection(section._id));
                      setIsOpen(false);
                    }}
                  >
                    {section.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div> */}
      <nav className={styles.burger}>
        <div className={styles.navbar}>
          <div className={`${styles.container} ${styles.navContainer}`}>
            <input className={styles.checkbox} type="checkbox" name="" id="" />
            <div className={styles.hamburgerLines}>
              <span className={`${styles.line} ${styles.line1}`}></span>
              <span className={`${styles.line} ${styles.line2}`}></span>
              <span className={`${styles.line} ${styles.line3}`}></span>
            </div>
            <div className={styles.logo}>
              <h1>Navbar</h1>
            </div>
            <div className={styles.menuItems}>
              <div className="flex gap-1 pt-4 pb-4">
                <Lang />
                <LogoutButton />
              </div>
              <div className="pb-6">
                <SectionsList />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default HamburgerMenu;
