
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Brain, 
  Music, 
  BookOpen, 
  MessageCircle, 
  User,
  Settings,
  LogOut
} from 'lucide-react';

const NavBar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Scanner', path: '/scan', icon: Brain },
    { name: 'Musique', path: '/music', icon: Music },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Coach', path: '/coach', icon: MessageCircle },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </Link>

          {/* Navigation principale */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Boutons utilisateur */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => window.location.href = '/auth'}
              variant="outline"
              className="hidden sm:flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Connexion</span>
            </Button>
            <Button
              onClick={() => window.location.href = '/choose-mode'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Commencer
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
