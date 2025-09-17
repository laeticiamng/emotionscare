# Architecture du Routeur React - EmotionsCare

## Vue d'ensemble

EmotionsCare utilise **React Router v6** avec une architecture centralisée et typée pour la navigation.

## Structure des Routes

### Configuration Centralisée

```typescript
// src/routerV2/index.ts
export const routes = {
  // Routes publiques
  home: '/',
  login: '/login',
  register: '/register',
  
  // Routes utilisateur
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
  
  // Modules métier
  music: '/music',
  journal: '/journal',
  scan: '/scan',
  vr: '/vr',
  coach: '/coach',
  
  // Administration
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    analytics: '/admin/analytics'
  }
} as const;
```

### Router Principal

```typescript
// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/routerV2';

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: routes.dashboard,
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
  },
  // ... autres routes
]);

function App() {
  return <RouterProvider router={router} />;
}
```

## Protection des Routes

### Composants de Protection

```typescript
// src/components/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to={routes.login} replace />;
  
  return <>{children}</>;
};

// Protection basée sur les rôles
export const RoleProtectedRoute: React.FC<{
  children: ReactNode;
  requiredRole: UserRole[];
}> = ({ children, requiredRole }) => {
  const { user } = useAuth();
  
  if (!user || !requiredRole.includes(user.role)) {
    return <Navigate to={routes.dashboard} replace />;
  }
  
  return <>{children}</>;
};
```

### Matrice d'accès RBAC

| Route | B2C | B2B User | B2B Admin | Admin |
|-------|-----|----------|-----------|-------|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/music` | ✅ | ✅ | ✅ | ✅ |
| `/admin/*` | ❌ | ❌ | ✅ | ✅ |
| `/org/*` | ❌ | ✅ | ✅ | ✅ |

## Navigation

### Hook de Navigation Typé

```typescript
// src/hooks/useTypedNavigation.ts
export const useTypedNavigation = () => {
  const navigate = useNavigate();
  
  return {
    goTo: (path: keyof typeof routes) => navigate(routes[path]),
    goToAdmin: (subPath: keyof typeof routes.admin) => 
      navigate(routes.admin[subPath]),
    goBack: () => navigate(-1),
    replace: (path: keyof typeof routes) => 
      navigate(routes[path], { replace: true })
  };
};
```

### Composants de Navigation

```typescript
// src/components/navigation/MainNavigationMenu.tsx
export const MainNavigationMenu: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = useMemo(() => [
    { path: routes.dashboard, label: 'Tableau de bord', icon: Home },
    { path: routes.music, label: 'Musique', icon: Music },
    { path: routes.journal, label: 'Journal', icon: BookOpen },
    // Ajout conditionnel selon le rôle
    ...(user?.role === 'admin' ? [
      { path: routes.admin.dashboard, label: 'Administration', icon: Settings }
    ] : [])
  ], [user?.role]);

  return (
    <nav>
      {menuItems.map(item => (
        <Link 
          key={item.path}
          to={item.path}
          className={cn("nav-item", isActive(item.path) && "active")}
        >
          <item.icon />
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
```

## Lazy Loading & Performance

### Code Splitting par Route

```typescript
// Lazy loading des pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const MusicPage = lazy(() => import('@/pages/MusicPage'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));

// Wrapper avec Suspense
const LazyRoute: React.FC<{Component: React.LazyExoticComponent<any>}> = 
  ({ Component }) => (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
```

### Preloading Conditionnel

```typescript
// src/hooks/useRoutePreload.ts
export const useRoutePreload = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Preload des routes fréquentes selon le rôle
    if (user?.role === 'admin') {
      import('@/pages/admin/AdminPage'); // Preload en arrière-plan
    }
  }, [user?.role]);
};
```

## Gestion d'État et Navigation

### Context de Navigation

```typescript
// src/contexts/NavigationContext.tsx
export const NavigationContext = createContext<{
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  currentModule: string | null;
}>({});

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
```

### Synchronisation avec l'État Global

```typescript
// src/hooks/useNavigationSync.ts
export const useNavigationSync = () => {
  const location = useLocation();
  const { setCurrentModule } = useAppStore();
  
  useEffect(() => {
    // Synchroniser le module actuel avec l'état global
    const module = location.pathname.split('/')[1];
    setCurrentModule(module);
  }, [location.pathname, setCurrentModule]);
};
```

## Tests de Navigation

### Tests des Routes Protégées

```typescript
// tests/navigation/protected-routes.test.tsx
describe('Protected Routes', () => {
  test('redirects unauthenticated users to login', () => {
    render(
      <Router>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Router>
    );
    
    expect(screen.getByText(/connexion/i)).toBeInTheDocument();
  });
  
  test('allows authenticated users access', () => {
    const mockUser = { id: '1', role: 'b2c' };
    render(
      <AuthProvider user={mockUser}>
        <Router>
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        </Router>
      </AuthProvider>
    );
    
    expect(screen.getByText(/tableau de bord/i)).toBeInTheDocument();
  });
});
```

### Tests E2E avec Playwright

```typescript
// tests/e2e/navigation.spec.ts
test.describe('Navigation Flow', () => {
  test('navigates through main modules', async ({ page }) => {
    await page.goto('/login');
    
    // Login flow
    await page.fill('[data-testid="email"]', 'user@test.com');
    await page.fill('[data-testid="password"]', 'password');
    await page.click('[data-testid="login-button"]');
    
    // Navigation tests
    await expect(page).toHaveURL('/dashboard');
    
    await page.click('[data-testid="nav-music"]');
    await expect(page).toHaveURL('/music');
    
    await page.click('[data-testid="nav-journal"]');
    await expect(page).toHaveURL('/journal');
  });
});
```

## Bonnes Pratiques

### 1. Routes Typées
- Utiliser des constantes typées pour éviter les erreurs de frappe
- Centraliser toutes les routes dans `routerV2/index.ts`

### 2. Protection Systématique
- Toujours wrapper les routes privées dans `ProtectedRoute`
- Utiliser `RoleProtectedRoute` pour les restrictions par rôle

### 3. Performance
- Lazy loading pour toutes les pages > 50kB
- Preloading conditionnel des routes fréquentes

### 4. UX/Accessibilité
- Breadcrumbs automatiques basées sur la route
- Focus management lors des changements de route
- Loading states pour les transitions

### 5. Monitoring
- Tracking des changements de route avec analytics
- Gestion centralisée des erreurs de navigation

## Migration Future (Optionnel)

Si migration vers Next.js App Router :

1. **Phase 1** : Conversion progressive des routes
2. **Phase 2** : Migration du state management
3. **Phase 3** : Optimisation SSR/SSG

Coût estimé : 3-4 sprints pour migration complète.