import React from 'react';

// Page de connexion ULTRA simple sans aucune dépendance
const SimpleLogin: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fonction de connexion directe sans contextes
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Empêcher absolument les re-soumissions
    if (isSubmitting) {
      console.log('BLOQUÉ - Déjà en cours');
      return;
    }
    
    setIsSubmitting(true);
    setStatus('Connexion...');
    
    try {
      console.log('Connexion directe à Supabase...');
      
      // Import dynamique pour éviter les conflits
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';
      
      const client = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });
      
      if (error) {
        setStatus(`Erreur: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      
      if (data.session) {
        setStatus('✅ Connexion réussie! Redirection...');
        
        // Pause puis redirection brutale
        setTimeout(() => {
          console.log('Redirection vers dashboard...');
          window.location.href = '/app/home';
        }, 2000);
      } else {
        setStatus('Erreur: Pas de session');
        setIsSubmitting(false);
      }
      
    } catch (error: any) {
      console.error('Exception:', error);
      setStatus(`Exception: ${error.message}`);
      setIsSubmitting(false);
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
            disabled: isSubmitting,
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
            disabled: isSubmitting,
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
          disabled: isSubmitting,
          style: {
            width: '100%',
            padding: '15px',
            backgroundColor: isSubmitting ? '#cccccc' : '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }
        }, isSubmitting ? 'Connexion...' : 'Se connecter')
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