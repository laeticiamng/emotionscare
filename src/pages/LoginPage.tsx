import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Désactiver tous les listeners existants au montage
  useEffect(() => {
    console.log('LoginPage: Désactivation des listeners auth existants');
    
    // Vider tous les listeners auth existants
    supabase.auth.onAuthStateChange(() => {
      // Listener vide pour intercepter les autres
    });
    
    return () => {
      console.log('LoginPage: Nettoyage');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Empêcher les soumissions multiples
    if (loading) {
      console.log('Soumission ignorée - déjà en cours');
      return;
    }
    
    setLoading(true);
    setMessage('🔄 Connexion en cours...');
    
    // Petite pause pour éviter les conflits
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      console.log('=== CONNEXION DIRECTE ===');
      console.log('Email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      console.log('Réponse auth:', { error: error?.message, session: !!data.session });
      
      if (error) {
        setMessage(`❌ Erreur: ${error.message}`);
        setLoading(false);
        return;
      }
      
      if (data.session && data.user) {
        console.log('Session OK, utilisateur:', data.user.id);
        setMessage('✅ Connexion réussie!');
        
        // Attendre puis redirection brutale
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('REDIRECTION FORCÉE vers /app/home');
        
        // Redirection la plus brutale possible
        document.location.href = '/app/home';
        
      } else {
        setMessage('❌ Pas de session créée');
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error('Exception:', error);
      setMessage(`❌ Exception: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div data-testid="page-root" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        border: '1px solid #e0e0e0'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            color: '#333333'
          }}>
            EmotionsCare
          </h1>
          <p style={{ 
            color: '#666666', 
            margin: '0',
            fontSize: '14px'
          }}>
            Connexion Particulier
          </p>
        </div>

        {message && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: message.includes('❌') ? '#ffe6e6' : '#e6f3ff',
            color: message.includes('❌') ? '#cc0000' : '#0066cc',
            borderRadius: '5px',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '5px',
              color: '#333333'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #dddddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f5f5f5' : '#ffffff'
              }}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              marginBottom: '5px',
              color: '#333333'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #dddddd',
                borderRadius: '5px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f5f5f5' : '#ffffff'
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
              backgroundColor: loading ? '#cccccc' : '#0066cc',
              color: '#ffffff',
              padding: '15px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔄 Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#666666', margin: '0' }}>
            <a href="/" style={{ color: '#0066cc', textDecoration: 'none' }}>
              ← Retour à l'accueil
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;