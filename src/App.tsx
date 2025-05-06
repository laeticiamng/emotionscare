import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast"
import { Shell } from "@/components/Shell"
import { Home } from "@/pages/Home"
import { Docs } from "@/pages/Docs"
import { Pricing } from "@/pages/Pricing"
import { Contact } from "@/pages/Contact"
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { getCurrentUser } from '@/data/mockUsers';
import { updateUser } from '@/lib/userService';
import { User } from '@/types';
import InvitePage from './pages/InvitePage';

const App: React.FC = () => {
  const { setUser, isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAuthentication = async () => {
      const storedUser = getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        
        // Check if the user needs to be onboarded
        if (!storedUser.onboarded) {
          toast({
            title: "Bienvenue !",
            description: "Veuillez compléter votre profil pour une expérience optimale.",
          });
          navigate('/settings');
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuthentication();
  }, [setUser, setIsAuthenticated, navigate, toast]);
  
  // Onboarding flow simulation
  useEffect(() => {
    const completeOnboarding = async () => {
      // Check if the user is authenticated and has just registered
      const urlParams = new URLSearchParams(window.location.search);
      const justRegistered = urlParams.get('registered') === 'true';
      
      if (isAuthenticated && justRegistered) {
        // Simulate completing the onboarding process
        const user = getCurrentUser();
        if (user) {
          const updatedUser: Partial<User> = { ...user, onboarded: true };
          try {
            const newUser = await updateUser(updatedUser);
            setUser(newUser);
            
            toast({
              title: "Profil complété !",
              description: "Votre compte est maintenant configuré.",
            });
            navigate('/dashboard');
          } catch (error) {
            console.error("Error updating user:", error);
            toast({
              title: "Erreur",
              description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
              variant: "destructive"
            });
          }
        }
      }
    };
    
    completeOnboarding();
  }, [isAuthenticated, setUser, navigate, toast]);
  
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/docs",
        element: <Docs />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
   {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/invite",
    element: <InvitePage />,
  }
]);

function AppWrapper() {
  return (
    <AuthContext.AuthProvider>
      <App />
      <RouterProvider router={router} />
    </AuthContext.AuthProvider>
  );
}

export default AppWrapper;
import { AuthContext } from './contexts/AuthContext';
