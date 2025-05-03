
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const modules = [
    { path: '/dashboard', label: 'Accueil' },
    { path: '/scan',      label: 'Scan émotionnel' },
    { path: '/journal',   label: 'Journal' },
    { path: '/community', label: 'Communauté' },
    { path: '/vr',        label: 'VR' },
    { path: '/library',   label: 'Library' },
    { path: '/gamification', label: 'Gamification' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50">
      <div className="max-w-6xl mx-auto flex items-center h-14 px-4">
        {/* Logo ou bouton Home */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xl font-bold mr-8 focus:outline-none"
        >
          EmotionsCare
        </button>

        {/* Liens modules */}
        <ul className="flex space-x-6 overflow-x-auto hide-scrollbar">
          {modules.map(m => (
            <li key={m.path}>
              <NavLink
                to={m.path}
                className={({ isActive }) =>
                  `px-2 py-1 rounded hover:bg-gray-100 ${
                    isActive ? 'font-semibold border-b-2 border-blue-500' : ''
                  }`
                }
              >
                {m.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TopNav;
