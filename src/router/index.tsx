
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import TestPage from '@/pages/TestPage';
import Point20Page from '@/pages/Point20Page';

console.log('%c[Router] Configuration ULTRA-SIMPLE avec imports directs...', 'color:purple; font-weight:bold');
console.log('%c[Router] HomePage loaded:', 'color:blue', HomePage);

// Page 404 simple
const NotFoundPage = () => (
  <div style={{color:'red', fontSize:30, padding:20}}>
    <h1>404 - Page introuvable</h1>
    <a href="/">Retour à l'accueil</a>
  </div>
);

// STRUCTURE ULTRA-SIMPLE - SANS AppShell pour debug
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/point20',
    element: <Point20Page />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
], {
  basename: import.meta.env.BASE_URL || '/',
});

console.log('%c[Router] ✅ Router SIMPLIFIÉ configuré', 'color:green; font-weight:bold');
console.log('%c[Router] Routes count:', 'color:blue', router.routes.length);
console.log('%c[Router] Base URL:', 'color:blue', import.meta.env.BASE_URL);
