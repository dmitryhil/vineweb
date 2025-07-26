import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthWrapper = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToLogin = () => setIsLogin(true);
  const switchToRegister = () => setIsLogin(false);

  return (
    <>
      {isLogin ? (
        <Login 
          onLogin={onLogin} 
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <Register 
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
};

export default AuthWrapper;