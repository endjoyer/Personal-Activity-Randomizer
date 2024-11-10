import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const LogoutButton = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    dispatch(logout());
    router.push('/login');
  };

  return (
    <button className="ml-3" onClick={handleLogout}>
      {t('logout')}
    </button>
  );
};

export default LogoutButton;
