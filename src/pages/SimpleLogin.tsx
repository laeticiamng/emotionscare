import React from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuth';

// Page de connexion avec SimpleAuth
const SimpleLogin: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState('');
  const { signIn, loading } = useSimpleAuth();

  // Fonction de connexion avec SimpleAuth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) {
      console.log('Chargement en cours...');
      return;
    }
    
    setStatus('Connexion...');
    
    try {
      await signIn(email.trim(), password.trim());
      setStatus('✅ Connexion réussie!');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setStatus(`Erreur: ${error.message || 'Connexion échouée'}`);
    }
  };

  return React.createElement('div', {
    'data-testid': 'page-root',
    style: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }
  }, 
    React.createElement('div', {
      style: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        borderRadius: '10px',
        padding: '30px'
      }
    },
      React.createElement('h1', {
        style: {
          textAlign: 'center',
          fontSize: '24px',
          marginBottom: '20px',
          color: '#000000'
        }
      }, 'EmotionsCare - Simple Login'),
      
      status && React.createElement('div', {
        style: {
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: status.includes('Erreur') ? '#ffeeee' : '#eeffee',
          color: status.includes('Erreur') ? '#cc0000' : '#006600',
          borderRadius: '5px',
          textAlign: 'center',
          fontWeight: 'bold'
        }
      }, status),
      
      React.createElement('form', {
        onSubmit: handleLogin
      },
        React.createElement('div', {
          style: { marginBottom: '15px' }
        },
          React.createElement('label', {
            style: {
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold'
            }
          }, 'Email:'),
          React.createElement('input', {
            type: 'email',
            value: email,
            onChange: (e: any) => setEmail(e.target.value),
            disabled: loading,
            required: true,
            style: {
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }
          })
        ),
        
        React.createElement('div', {
          style: { marginBottom: '20px' }
        },
          React.createElement('label', {
            style: {
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold'
            }
          }, 'Mot de passe:'),
          React.createElement('input', {
            type: 'password',
            value: password,
            onChange: (e: any) => setPassword(e.target.value),
            disabled: loading,
            required: true,
            style: {
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }
          })
        ),
        
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          style: {
            width: '100%',
            padding: '15px',
            backgroundColor: loading ? '#cccccc' : '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }
        }, loading ? 'Connexion...' : 'Se connecter')
      ),
      
      React.createElement('div', {
        style: {
          textAlign: 'center',
          marginTop: '20px'
        }
      },
        React.createElement('a', {
          href: '/',
          style: {
            color: '#007bff',
            textDecoration: 'none'
          }
        }, '← Retour à l\'accueil')
      )
    )
  );
};

export default SimpleLogin;