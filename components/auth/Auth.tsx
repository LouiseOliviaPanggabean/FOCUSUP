import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { User } from '../../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-lg shadow-md">
      <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">FocusUp</h1>
          <p className="text-muted dark:text-dark-muted mt-2">{isRegistering ? 'Create an account to get started' : 'Welcome back! Please sign in.'}</p>
      </div>

      {isRegistering ? (
        <Register onRegisterSuccess={onLoginSuccess} />
      ) : (
        <Login onLoginSuccess={onLoginSuccess} />
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-primary hover:underline"
        >
          {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Auth;