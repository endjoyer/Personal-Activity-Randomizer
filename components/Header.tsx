import React from 'react';
import { useTranslation } from 'react-i18next';
import LogoutButton from './LogoutButton';

const Header = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1>Personal Activity Randomizer</h1>
      <div>
        <button onClick={() => changeLanguage('en')} className="mr-2">
          EN
        </button>
        <button onClick={() => changeLanguage('ru')}>RU</button>
      </div>
      <LogoutButton />
    </header>
  );
};

export default Header;
