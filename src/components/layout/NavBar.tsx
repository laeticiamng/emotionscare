// @ts-nocheck

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/routerV2';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Brain, 
  Music, 
  BookOpen, 
  MessageCircle, 
  User,
  Menu,
  X,
  Sparkles,
  Headphones,
  Trophy,
  Zap
} from 'lucide-react';

const NavBar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Scanner', path: '/scan', icon: Brain, premium: true },
    { name: 'Musique', path: '/music', icon: Music, premium: true },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Coach', path: '/coach', icon: MessageCircle, premium: true },
    { name: 'VR', path: '/vr', icon: Headphones, premium: true },
    { name: 'Gamification', path: '/gamification', icon: Trophy },
  ];

  const quickAccess = [
    { name: 'Flash Glow', path: '/flash-glow', icon: Zap },
    { name: 'Breathwork', path: '/breathwork', icon: Sparkles },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={routes.public.home()} className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-lg">EC</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              EmotionsCare
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`flex items-center space-x-2 relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {item.premium && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <Sparkles className="h-2 w-2 text-yellow-900" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quick Access */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              {quickAccess.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    title={item.name}
                  >
                    <item.icon className="h-4 w-4" />
                  </motion.button>
                </Link>
              ))}
            </div>

            <Button
              onClick={() => window.location.href = '/login'}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Button>
            
            <Button
              onClick={() => window.location.href = '/mode-selection'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-blue-500/25"
            >
              Commencer
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.premium && (
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                    )}
                  </Link>
                );
              })}
              
              <div className="border-t border-white/10 pt-4 space-y-3">
                <Button
                  onClick={() => {
                    window.location.href = '/login';
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
                
                <Button
                  onClick={() => {
                    window.location.href = '/mode-selection';
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Commencer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
