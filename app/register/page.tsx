"use client"
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Register = () => {
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
        await axios.post('/api/auth/register', {
          username,
          password,
        });
        router.push('/login');
      } catch (err) {
        console.error(err);
        setErrors({ ...errs, username: 'Username is already taken' });
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
      <h2>Register</h2>
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
        <button type="submit">Register</button>
      </form>
      <Link href="/login">
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register;
