// @ts-nocheck
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '@/lib/logger';

export default function TestLogin() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    logger.info('Test form submitted', {}, 'AUTH');
    
    // Navigation SPA au lieu de window.location
    setTimeout(() => {
      navigate('/app/home', { replace: true });
    }, 1000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        width: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Test Login (No Auth)
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email:
            </label>
            <input 
              type="email" 
              defaultValue="test@example.com"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
            </label>
            <input 
              type="password" 
              defaultValue="password"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <button 
            type="submit"
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Se connecter (Test)
          </button>
        </form>
        
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '0.875rem', 
          color: '#666',
          textAlign: 'center'
        }}>
          Page de test sans authentification
        </p>
      </div>
    </div>
  );
}