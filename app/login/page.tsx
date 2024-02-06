"use client"
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

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
      err.username = 'Username is required';
    }
    if (!password) {
      err.password = 'Password is required';
    }
    return err;
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p>{errors.username}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Login</button>
      </form>
      <Link href="/register">
        Don't have an account? Register
      </Link>
    </div>
  );
};

export default Login;
