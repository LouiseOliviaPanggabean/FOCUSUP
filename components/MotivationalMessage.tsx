import React, { useState, useEffect } from 'react';

interface MotivationalMessageProps {
  messages: string[];
}

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ messages }) => {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Set initial message
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    }, 30000); // Change motivation every 30 seconds

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="mt-8 p-4 bg-primary-light dark:bg-primary/20 rounded-lg text-center min-h-[80px] flex items-center justify-center transition-opacity duration-500 w-full max-w-md">
      <p className="text-muted dark:text-dark-muted italic">
        <span className="font-bold text-primary mr-2">Remember:</span>
        {message}
      </p>
    </div>
  );
};

export default MotivationalMessage;