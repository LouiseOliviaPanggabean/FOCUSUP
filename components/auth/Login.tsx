import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User } from '../../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users] = useLocalStorage<User[]>('focusup-users', []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-danger text-sm text-center">{error}</p>}
      <div>
        <label htmlFor="email-login" className="block text-sm font-medium text-muted dark:text-dark-muted mb-2">
          Email
        </label>
        <input
          type="email"
          id="email-login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-light dark:bg-dark-bg border-gray-300 dark:border-gray-600 text-dark dark:text-dark-text rounded-md p-2 focus:ring-primary focus:border-primary"
        />
      </div>
      <div>
        <label htmlFor="password-login" className="block text-sm font-medium text-muted dark:text-dark-muted mb-2">
          Password
        </label>
        <input
          type="password"
          id="password-login"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-light dark:bg-dark-bg border-gray-300 dark:border-gray-600 text-dark dark:text-dark-text rounded-md p-2 focus:ring-primary focus:border-primary"
        />
      </div>
      <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-300">
        Sign In
      </button>
    </form>
  );
};

export default Login;