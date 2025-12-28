import React from 'react';
import { Link } from 'react-router-dom';

export default function NyveeTestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(to bottom right, #dbeafe, #fae8ff, #fce7f3)'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        padding: '2rem',
        textAlign: 'center',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          ✅ Page de test Nyvée
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
          Si tu vois cette page, la route /test-nyvee fonctionne correctement !
        </p>
        <Link 
          to="/app/nyvee"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            color: 'white',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          🌿 Aller vers Nyvée
        </Link>
      </div>
    </div>
  );
}
