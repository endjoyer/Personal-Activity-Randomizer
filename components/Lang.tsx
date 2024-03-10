import React from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

const Lang = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    Cookies.set('i18next', language);
  };

  const currentLanguage = i18n.language;

  return (
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
  );
};

export default Lang;
