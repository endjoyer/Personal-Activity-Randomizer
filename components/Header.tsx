import React from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import LogoutButton from './LogoutButton';

const Header = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    Cookies.set('i18next', language);
  };

  const currentLanguage = i18n.language;

  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1>Personal Activity Randomizer</h1>
      <div>
        <button
          onClick={() => changeLanguage('en')}
          className={`mr-2 ${
            currentLanguage === 'en' ? 'underline' : 'text-blue-300'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('ru')}
          className={`${
            currentLanguage === 'ru' ? 'underline' : 'text-blue-300'
          }`}
        >
          RU
        </button>
      </div>
      <LogoutButton />
    </header>
  );
};

export default Header;
