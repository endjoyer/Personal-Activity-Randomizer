'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../redux/authSlice';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const { t } = useTranslation();

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
        dispatch(setToken(res.data.token));
        dispatch(setUser(username));
        router.push('/');
      } catch (err) {
        console.error(err);
        setErrors({ ...errs, username: 'Username is already taken' });
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
    <div className="container">
      <h2>{t('registerTitle')}</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
          }}
        />
        {errors.username && <p>{errors.username}</p>}
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
          }}
        />
        {errors.password && <p>{errors.password}</p>}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {t('registerBtn')}
        </button>
      </form>
      <Link href="/login">{t('haveAccount')}</Link>
    </div>
  );
};

export default Register;
