
# Exemples de code React - EmotionsCare 1.0

## 🔐 Hook usePrivacyPrefs

```typescript
// hooks/usePrivacyPrefs.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/apiClient';

interface PrivacyPrefs {
  cam: boolean;
  mic: boolean;
  hr: boolean;
  gps: boolean;
  social: boolean;
  nft: boolean;
}

export const usePrivacyPrefs = () => {
  const [prefs, setPrefs] = useState<PrivacyPrefs>({
    cam: false,
    mic: false,
    hr: false,
    gps: false,
    social: false,
    nft: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/user/privacy');
      setPrefs(response.data);
    } catch (err) {
      setError('Impossible de charger les préférences de confidentialité');
      console.error('Privacy prefs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updatePrefs = async (newPrefs: Partial<PrivacyPrefs>) => {
    try {
      await apiClient.put('/user/privacy', { ...prefs, ...newPrefs });
      setPrefs(prev => ({ ...prev, ...newPrefs }));
      
      // Annonce aux lecteurs d'écran
      const updatedKeys = Object.keys(newPrefs).join(', ');
      announceToScreenReader(
        `Préférences mises à jour : ${updatedKeys}`,
        'polite'
      );
    } catch (err) {
      setError('Impossible de mettre à jour les préférences');
      throw err;
    }
  };

  const canUseFeature = (feature: keyof PrivacyPrefs): boolean => {
    return prefs[feature] === true;
  };

  return {
    prefs,
    loading,
    error,
    updatePrefs,
    canUseFeature,
    refetch: fetchPrefs
  };
};
```

## 🎬 Composant MotionWrapper

```typescript
// components/motion/MotionWrapper.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

interface MotionWrapperProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'bounce';
  duration?: number;
  delay?: number;
  className?: string;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  animation = 'fade',
  duration = 0.3,
  delay = 0,
  className
}) => {
  const { prefersReducedMotion } = useMotionPrefs();

  // Animations désactivées si prefers-reduced-motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    },
    bounce: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants[animation]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: prefersReducedMotion ? 0.01 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        type: animation === 'bounce' ? 'spring' : 'tween'
      }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
```

## 🌐 Service API standardisé

```typescript
// services/api/apiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor pour l'auth
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor pour les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Gestion spécifique par code d'erreur
    switch (status) {
      case 401:
        toast({
          variant: "destructive",
          title: "Session expirée",
          description: "Veuillez vous reconnecter"
        });
        // Redirection vers login
        window.location.href = '/login';
        break;
      
      case 403:
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires"
        });
        break;
      
      case 429:
        toast({
          variant: "destructive",
          title: "Trop de requêtes",
          description: "Veuillez patienter avant de réessayer"
        });
        break;
      
      case 500:
        toast({
          variant: "destructive",
          title: "Erreur serveur",
          description: "Une erreur technique est survenue"
        });
        break;
      
      default:
        if (status >= 400) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: message || "Une erreur est survenue"
          });
        }
    }

    // Log pour le debug
    console.error('API Error:', {
      status,
      message,
      url: error.config?.url,
      method: error.config?.method
    });
  }

  // Méthodes principales
  async get<T>(url: string, config?: any): Promise<{ data: T }> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<{ data: T }> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<{ data: T }> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<{ data: T }> {
    return this.client.delete(url, config);
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<{ data: T }> {
    return this.client.patch(url, data, config);
  }
}

export const apiClient = new ApiClient();
```

## 🧪 Tests d'accessibilité

```typescript
// __tests__/accessibility.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import FlashGlow from '@/components/glow/FlashGlow';
import PrivacyToggle from '@/components/privacy/PrivacyToggle';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('FlashGlow component has no a11y violations', async () => {
    const { container } = render(<FlashGlow />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('PrivacyToggle component has proper ARIA attributes', async () => {
    render(<PrivacyToggle feature="cam" />);
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-label');
    expect(toggle).toHaveAttribute('aria-describedby');
    
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  test('Skip link functionality', () => {
    render(<Layout />);
    
    const skipLink = screen.getByText('Passer au contenu principal');
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveClass('sr-only', 'focus:not-sr-only');
  });

  test('Keyboard navigation works', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    
    // Test navigation au clavier
    await user.tab();
    expect(screen.getByRole('button', { name: /menu/i })).toHaveFocus();
    
    await user.tab();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveFocus();
  });
});
```
