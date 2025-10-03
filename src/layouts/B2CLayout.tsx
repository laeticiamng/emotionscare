import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Shell from '@/Shell';
import '@/styles/b2c-theme.css';

const B2CLayout: React.FC = () => {
  useEffect(() => {
    // Add B2C class to body for theming
    document.body.classList.add('b2c-layout');
    return () => {
      document.body.classList.remove('b2c-layout');
    };
  }, []);

  return (
    <div className="b2c-smooth-scroll">
      <Shell>
        <div className="b2c-page-enter b2c-page-enter-active">
          <Outlet />
        </div>
      </Shell>
    </div>
  );
};

export default B2CLayout;
