
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import TestPage from '@/pages/TestPage';
import Point20Page from '@/pages/Point20Page';
import ScanPage from '@/pages/ScanPage';
import MusicPage from '@/pages/MusicPage';
import B2CLoginPage from '@/pages/b2c/LoginPage';
import B2BSelectionPage from '@/pages/b2b/SelectionPage';
import B2BUserLoginPage from '@/pages/b2b/user/LoginPage';
import B2BAdminLoginPage from '@/pages/b2b/admin/LoginPage';

console.log('%c[Router] Configuration COMPLÈTE avec toutes les pages...', 'color:purple; font-weight:bold');

// Page 404 simple
const NotFoundPage = () => (
  <div data-testid="page-root" style={{color:'red', fontSize:30, padding:20, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
    <h1>404 - Page introuvable</h1>
    <p style={{fontSize:18, marginTop:20}}>La page que vous cherchez n'existe pas.</p>
    <a href="/" style={{marginTop:20, color:'blue', textDecoration:'underline'}}>Retour à l'accueil</a>
  </div>
);

// STRUCTURE COMPLÈTE AVEC TOUTES LES ROUTES
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
    path: '/scan',
    element: <ScanPage />,
  },
  {
    path: '/music',
    element: <MusicPage />,
  },
  {
    path: '/b2c/login',
    element: <B2CLoginPage />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  {
    path: '/b2b/user/login',
    element: <B2BUserLoginPage />,
  },
  {
    path: '/b2b/admin/login',
    element: <B2BAdminLoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
], {
  basename: import.meta.env.BASE_URL || '/',
});

console.log('%c[Router] ✅ Router COMPLET configuré avec toutes les pages', 'color:green; font-weight:bold');
console.log('%c[Router] Routes count:', 'color:blue', router.routes.length);
console.log('%c[Router] Base URL:', 'color:blue', import.meta.env.BASE_URL);
