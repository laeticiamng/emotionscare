import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return; // Éviter les clics multiples
    
    setLoading(true);
    setMessage('Connexion en cours...');
    
    try {
      console.log('Connexion avec:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      if (error) {
        console.error('Erreur:', error);
        setMessage(`Erreur: ${error.message}`);
        setLoading(false);
        return;
      }
      
      if (data.session) {
        setMessage('✅ Connexion réussie! Redirection...');
        
        // Attendre un peu puis rediriger UNE SEULE FOIS
        setTimeout(() => {
          // Désactiver complètement React Router pour cette redirection
          window.location.replace('/app/home');
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('Exception:', error);
      setMessage(`Erreur: ${error.message || 'Erreur inconnue'}`);
      setLoading(false);
    }
  };

  return (
    <div data-testid="page-root" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            fontSize: '24px'
          }}>
            💙
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            margin: '0 0 8px 0',
            color: '#1e293b'
          }}>
            EmotionsCare
          </h1>
          <p style={{ 
            color: '#64748b', 
            margin: '0',
            fontSize: '16px'
          }}>
            Connexion à votre espace personnel
          </p>
        </div>

        {/* Message de statut */}
        {message && (
          <div style={{
            padding: '16px',
            marginBottom: '24px',
            backgroundColor: message.includes('Erreur') ? '#fef2f2' : '#eff6ff',
            color: message.includes('Erreur') ? '#dc2626' : '#1d4ed8',
            borderRadius: '8px',
            fontSize: '14px',
            border: `1px solid ${message.includes('Erreur') ? '#fecaca' : '#bfdbfe'}`,
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: loading ? 'none' : 'block' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#374151'
            }}>
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              placeholder="votre@email.com"
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#374151'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              placeholder="••••••••"
              required
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '16px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              textTransform: 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Se connecter
          </button>
        </form>

        {/* Chargement */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ 
              marginTop: '16px', 
              color: '#64748b',
              fontSize: '14px'
            }}>
              Connexion en cours...
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px 0' }}>
            Pas encore de compte ?{' '}
            <a href="/signup" style={{ 
              color: '#3b82f6', 
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              S'inscrire
            </a>
          </p>
          <a href="/" style={{ 
            fontSize: '13px', 
            color: '#9ca3af', 
            textDecoration: 'none'
          }}>
            ← Retour à l'accueil
          </a>
        </div>
      </div>

      {/* Styles pour l'animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;