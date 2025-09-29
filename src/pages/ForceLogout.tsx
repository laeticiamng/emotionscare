import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ForceLogout() {
  const [status, setStatus] = useState('Nettoyage en cours...');

  useEffect(() => {
    const cleanupAuth = async () => {
      try {
        setStatus('Déconnexion Supabase...');
        await supabase.auth.signOut();
        
        setStatus('Nettoyage localStorage...');
        localStorage.clear();
        
        setStatus('Nettoyage sessionStorage...');
        sessionStorage.clear();
        
        setStatus('Terminé ! Redirection...');
        
        setTimeout(() => {
          window.location.href = '/login?segment=b2c';
        }, 1000);
        
      } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
        setStatus('Erreur, redirection forcée...');
        setTimeout(() => {
          navigate('/login?segment=b2c', { replace: true });
        }, 2000);
      }
    };

    cleanupAuth();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      flexDirection: 'column'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '1rem', color: '#333' }}>
          Nettoyage de la session
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          {status}
        </p>
        <div style={{ 
          margin: '1.5rem 0',
          width: '200px',
          height: '4px',
          backgroundColor: '#e0e0e0',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#007bff',
            animation: 'loading 2s ease-in-out infinite'
          }} />
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}