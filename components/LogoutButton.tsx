import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(logout());
    router.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
