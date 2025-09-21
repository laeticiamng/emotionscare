import React from 'react';
import DebugHomePage from './DebugHomePage';

const HomePage: React.FC = () => {
  console.log('[HomePage] Component loading...');
  return <DebugHomePage />;
};

export default HomePage;