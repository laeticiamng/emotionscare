import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Vérifier la session existante
  useEffect(() => {
    console.log('=== LoginPage montée ===');
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session existante:', session ? 'OUI' : 'NON');
        
        if (session) {
          console.log('Session trouvée, redirection vers dashboard...');
          window.location.href = '/app/home';
        }
      } catch (error) {
        console.error('Erreur vérification session:', error);
      }
    };

    checkSession();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? 'Session active' : 'Pas de session');
      
      if (event === 'SIGNED_IN' && session) {
        console.log('Connexion détectée, redirection...');
        setMessage('Connexion réussie! Redirection...');
        setTimeout(() => {
          window.location.href = '/app/home';
        }, 1000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== DÉBUT CONNEXION ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    setLoading(true);
    setMessage('Connexion en cours...');
    
    try {
      console.log('Appel signInWithPassword...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      console.log('Réponse Supabase:', { data, error });
      
      if (error) {
        console.error('Erreur Supabase:', error);
        setMessage(`Erreur: ${error.message}`);
        return;
      }
      
      if (data.session) {
        console.log('Session créée:', data.session.user.id);
        setMessage('Connexion réussie! Redirection...');
        
        // Force la redirection
        setTimeout(() => {
          console.log('Redirection forcée vers /app/home');
          window.location.href = '/app/home';
        }, 1500);
      } else {
        console.warn('Pas de session dans la réponse');
        setMessage('Connexion réussie mais pas de session');
      }
      
    } catch (error: any) {
      console.error('Exception lors de la connexion:', error);
      setMessage(`Exception: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
      console.log('=== FIN CONNEXION ===');
    }
  };

  return (
    <div data-testid="page-root" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            EmotionsCare
          </h1>
          <p style={{ color: '#6b7280', margin: '0' }}>
            Connexion Particulier
          </p>
        </div>

        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: message.includes('Erreur') ? '#fee2e2' : '#dbeafe',
            color: message.includes('Erreur') ? '#dc2626' : '#1d4ed8',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '4px',
              color: '#374151'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              marginBottom: '4px',
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
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
            Pas encore de compte ?{' '}
            <a href="/signup" style={{ color: '#2563eb', textDecoration: 'none' }}>
              S'inscrire
            </a>
          </p>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}>
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;