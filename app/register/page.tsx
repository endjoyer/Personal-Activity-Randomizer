'use client';
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../redux/authSlice';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Loader from '@/components/Loader';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const { t } = useTranslation();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const res = await axios.post('/api/auth/register', {
          username,
          password,
        });
        Cookies.set('token', res.data.token);
        Cookies.set('username', username);
        dispatch(setToken(res.data.token));
        dispatch(setUser(username));
        router.push('/');
      } catch (err) {
        console.error(err);
        setErrors({ ...errs, username: t('usernameTaken') });
      }
    }
  };

  const validate = () => {
    let err: { username?: string; password?: string } = {};
    if (!username) {
      err.username = t('usernameRequired');
    }
    if (!password) {
      err.password = t('passwordRequired');
    } else if (password.length < 8) {
      err.password = t('passwordLengthError');
    }
    return err;
  };

  if (isLoading) {
    return (
      <div className="relative w-full min-h-[calc(100vh-64px)]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Header isAuthPage={true} />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t('registerTitle')}
          </h2>
          <form className="mt-8" onSubmit={handleSubmit}>
            <input
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              type="text"
              placeholder={t('username')}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
              }}
            />
            <p className="text-red-500 text-xs italic h-6">{errors.username}</p>
            <input
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
              }}
            />
            <p className="text-red-500 text-xs italic h-6">{errors.password}</p>
            <button
              className="group relative w-full flex justify-center py-2 px-4 mt-6 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="submit"
            >
              {t('registerBtn')}
            </button>
          </form>
          <div className="text-sm text-center">
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {t('haveAccount')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
