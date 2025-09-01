import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const submittedRef = useRef(false);
  const [clickCount, setClickCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Compteur de clics pour debug
    const currentClick = clickCount + 1;
    setClickCount(currentClick);
    console.log(`🔴 CLIC #${currentClick} détecté`);
    
    // Bloquer COMPLÈTEMENT si déjà soumis
    if (submittedRef.current || loading) {
      console.log(`❌ CLIC #${currentClick} BLOQUÉ - Déjà en cours`);
      setMessage(`⚠️ Clic #${currentClick} bloqué - Déjà en traitement`);
      return false;
    }
    
    // Marquer comme soumis IMMÉDIATEMENT
    submittedRef.current = true;
    setLoading(true);
    setMessage(`🔄 Traitement du clic #${currentClick}...`);
    
    console.log(`✅ TRAITEMENT CLIC #${currentClick}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Délai visible
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      if (error) {
        console.log(`❌ Erreur clic #${currentClick}:`, error.message);
        setMessage(`❌ Erreur: ${error.message}`);
        // Réinitialiser pour permettre un nouveau essai
        submittedRef.current = false;
        setLoading(false);
        return;
      }
      
      if (data.session) {
        console.log(`✅ Succès clic #${currentClick} - Session créée`);
        setMessage(`✅ Connexion réussie! (clic #${currentClick})`);
        
        // Attendre puis redirection
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`🚀 Redirection après clic #${currentClick}`);
        
        // Redirection définitive
        window.location.replace('/app/home');
      }
      
    } catch (error: any) {
      console.log(`💥 Exception clic #${currentClick}:`, error);
      setMessage(`💥 Exception: ${error.message}`);
      submittedRef.current = false;
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log('🔄 Reset du formulaire');
    submittedRef.current = false;
    setLoading(false);
    setMessage('');
    setClickCount(0);
  };

  return (
    <div data-testid="page-root" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9f9f9', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        border: '2px solid #e0e0e0'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            color: '#2c3e50'
          }}>
            EmotionsCare
          </h1>
          <p style={{ 
            color: '#7f8c8d', 
            margin: '0',
            fontSize: '16px'
          }}>
            Connexion Particulier
          </p>
        </div>

        {/* Debug info */}
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontSize: '12px',
          color: '#6c757d',
          textAlign: 'center'
        }}>
          Clics détectés: {clickCount} | Statut: {loading ? 'EN COURS' : 'PRÊT'}
        </div>

        {message && (
          <div style={{
            padding: '15px',
            marginBottom: '25px',
            backgroundColor: message.includes('❌') ? '#ffe6e6' : 
                           message.includes('⚠️') ? '#fff3cd' : '#e6f3ff',
            color: message.includes('❌') ? '#cc0000' : 
                   message.includes('⚠️') ? '#856404' : '#0066cc',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 'bold',
            border: '1px solid ' + (message.includes('❌') ? '#ff9999' : 
                                   message.includes('⚠️') ? '#ffd966' : '#99ccff')
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ opacity: loading ? 0.6 : 1 }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '15px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#2c3e50'
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
                padding: '15px',
                border: '2px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#ecf0f1' : '#ffffff',
                color: loading ? '#7f8c8d' : '#2c3e50'
              }}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '15px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#2c3e50'
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
                padding: '15px',
                border: '2px solid #bdc3c7',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#ecf0f1' : '#ffffff',
                color: loading ? '#7f8c8d' : '#2c3e50'
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || submittedRef.current}
            style={{
              width: '100%',
              backgroundColor: loading ? '#95a5a6' : '#3498db',
              color: '#ffffff',
              padding: '18px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#2980b9';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#3498db';
            }}
          >
            {loading ? '🔄 Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Bouton de reset pour debug */}
        {(loading || message) && (
          <button 
            onClick={resetForm}
            style={{
              width: '100%',
              backgroundColor: '#e74c3c',
              color: '#ffffff',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            🔄 Reset (Debug)
          </button>
        )}

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <a href="/" style={{ 
            color: '#3498db', 
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;