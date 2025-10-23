// @ts-nocheck
import { createBrowserRouter } from 'react-router-dom';

function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#333' }}>✅ ROUTER FONCTIONNE!</h1>
      <p>Si vous voyez cette page, le problème vient des lazy imports ou des pages.</p>
    </div>
  );
}

export const routerMinimal = createBrowserRouter([
  {
    path: '/',
    element: <TestPage />,
  },
  {
    path: '*',
    element: <TestPage />,
  },
]);

export const router = routerMinimal;
export const routerV2 = routerMinimal;
