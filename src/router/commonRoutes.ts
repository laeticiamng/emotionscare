
import { RouteObject } from 'react-router-dom';
import ImmersiveHome from '@/pages/ImmersiveHome';
import B2BSelectionPage from '@/pages/b2b/SelectionPage';
import PhilosophyJourney from '@/pages/common/PhilosophyJourney';
import AboutPage from '@/pages/common/AboutPage';
import ContactPage from '@/pages/common/ContactPage';
import FaqPage from '@/pages/common/FaqPage';

export const commonRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ImmersiveHome />,
  },
  {
    path: '/b2b/selection',
    element: <B2BSelectionPage />,
  },
  {
    path: '/choose-mode',
    element: <ImmersiveHome />,
  },
  {
    path: '/philosophy',
    element: <PhilosophyJourney />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/faq',
    element: <FaqPage />,
  },
];
