'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../redux/authSlice';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
        const res = await axios.post('/api/auth/login', {
          username,
          password,
        });
        Cookies.set('token', res.data.token);
        dispatch(setToken(res.data.token));
        dispatch(setUser(username));
        router.push('/');
      } catch (err) {
        console.error(err);
        setErrors({ ...errs, password: 'Invalid username or password' });
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

  return (
    <>
      <Header />
      <div className="container">
        <h2>{t('loginTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
            }}
          />
          <p className="text-red-500 text-xs italic">{errors.username}</p>
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
            }}
          />
          <p className="text-red-500 text-xs italic">{errors.password}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {t('loginBtn')}
          </button>
        </form>
        <Link href="/register">{t('notAccount')}</Link>
      </div>
    </>
  );
};

export default Login;
