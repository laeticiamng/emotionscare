
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { TimeBasedBackground } from '@/components/home/TimeBasedBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import '@/components/home/immersive-home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { setUserMode } = useUserMode();
  
  // Add CSS variables to the document
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', '#3651ff');
    document.documentElement.style.setProperty('--accent', '#7B61FF');
    document.documentElement.style.setProperty('--background', '#f7f9fc');
    document.documentElement.style.setProperty('--text-main', '#232949');
    document.documentElement.style.setProperty('--card-bg', '#ffffffcc');
    document.documentElement.style.setProperty('--border-radius-xl', '2rem');
    document.documentElement.style.setProperty('--box-shadow-xl', '0 8px 48px 0 rgba(54, 97, 255, 0.08)');
  }, []);
  
  const handleModeSelection = (mode: 'b2c' | 'b2b') => {
    console.log(`Selected mode: ${mode}`);
    
    // Store the user mode in localStorage
    localStorage.setItem('userMode', mode);
    
    // Update context
    setUserMode(mode);
    
    // Navigate to the appropriate route
    if (mode === 'b2c') {
      navigate('/b2c/login');
    } else {
      navigate('/b2b/selection');
    }
  };
  
  return (
    <TimeBasedBackground>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section with Immersive Design */}
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            className="immersive-title"
            style={{
              fontFamily: "'Nunito', 'Inter', Arial, sans-serif",
              fontWeight: 800,
              fontSize: '2.8rem',
              color: 'var(--primary)',
              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.03em',
              textAlign: 'center',
              marginBottom: '1.5rem',
              marginTop: '2.5rem',
              textShadow: '0 4px 28px rgba(54, 97, 255, 0.15)'
            }}
          >
            Bienvenue dans votre espace de bien-être émotionnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explorez des outils et techniques conçus pour votre équilibre personnel et professionnel
          </p>
        </motion.div>
        
        {/* Main Access Options with Premium Design */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div 
            className="flex flex-col md:flex-row justify-center gap-6 md:gap-8"
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2rem', 
              marginBottom: '3rem' 
            }}
          >
            {/* B2C Card */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 dark:bg-blue-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Particulier</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                Accédez à votre espace personnel pour prendre soin de votre bien-être émotionnel
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => handleModeSelection('b2c')}
                  className="premium-button"
                  style={{
                    fontSize: '1.2rem',
                    padding: '1.2rem 3rem',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius-xl)',
                    boxShadow: 'var(--box-shadow-xl)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Espace Particulier
                </button>
              </div>
              {/* B2C Test Account */}
              <div className="mt-4 text-xs text-center text-muted-foreground">
                <p>Compte test: utilisateur@exemple.fr / admin</p>
              </div>
            </div>
            
            {/* B2B Card */}
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-purple-100 dark:bg-purple-800/40 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Entreprise</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                Solutions de bien-être émotionnel pour vos équipes et votre organisation
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => handleModeSelection('b2b')}
                  className="premium-button accent"
                  style={{
                    fontSize: '1.2rem',
                    padding: '1.2rem 3rem',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--border-radius-xl)',
                    boxShadow: 'var(--box-shadow-xl)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Espace Entreprise
                </button>
              </div>
              {/* B2B Test Accounts */}
              <div className="mt-4 text-xs text-center text-muted-foreground">
                <p>Compte admin: admin@exemple.fr / admin</p>
                <p>Compte collaborateur: collaborateur@exemple.fr / admin</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </TimeBasedBackground>
  );
};

export default Home;
