
import { createBrowserRouter } from 'react-router-dom';
import Shell from '@/Shell';
import Home from '@/Home';

// Pages simples pour tester
const TestPage = () => (
  <div data-testid="page-root" className="min-h-screen bg-red-500 text-white p-8">
    <h1 className="text-4xl font-bold">PAGE TEST - VISIBLE</h1>
    <p>Si vous voyez cette page rouge, le routage fonctionne !</p>
  </div>
);

const NotFoundPage = () => (
  <div data-testid="page-root" className="min-h-screen bg-yellow-500 text-black p-8">
    <h1 className="text-4xl font-bold">404 - Page introuvable</h1>
    <p>Cette page n'existe pas</p>
  </div>
);

console.log('Creating router...');

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

console.log('Router created successfully');
