
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '@/types/user';
import { toast } from 'sonner';

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

// Clés de stockage local
const USER_STORAGE_KEY = 'emotions-care-user';
const TOKEN_STORAGE_KEY = 'emotions-care-token';

// Mock d'utilisateurs pour le développement
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Jean Dupont',
    role: 'b2c',
    password: 'password123',
  },
  {
    id: '2',
    email: 'collaborator@example.com',
    name: 'Marie Martin',
    role: 'b2b_user',
    password: 'password123',
    company: {
      id: '1',
      name: 'EmotionsCare Inc.',
      role: 'Développeur',
      department: 'IT',
    },
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Thomas Bernard',
    role: 'b2b_admin',
    password: 'password123',
    company: {
      id: '1',
      name: 'EmotionsCare Inc.',
      role: 'Administrateur',
      department: 'Management',
    },
  },
];

// Hook pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Vérifier l'état d'authentification au chargement initial
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Fonction de connexion
  const login = async (email: string, password: string) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Rechercher l'utilisateur dans les mocks
    const foundUser = mockUsers.find(
      user => user.email === email && user.password === password
    );
    
    if (foundUser) {
      // Créer un objet utilisateur sans le mot de passe
      const { password, ...userWithoutPassword } = foundUser;
      
      // Stocker l'utilisateur et générer un faux token
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      localStorage.setItem(TOKEN_STORAGE_KEY, `fake-token-${Date.now()}`);
      
      setUser(userWithoutPassword as User);
      setIsAuthenticated(true);
    } else {
      throw new Error('Email ou mot de passe incorrect');
    }
  };
  
  // Fonction d'inscription
  const register = async (email: string, password: string, userData?: object) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérifier si l'email existe déjà
    if (mockUsers.some(user => user.email === email)) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      ...userData
    };
    
    // Ajouter l'utilisateur à la liste des mocks (simulation)
    mockUsers.push(newUser);
    
    // Créer un objet utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Stocker l'utilisateur et générer un faux token
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
    localStorage.setItem(TOKEN_STORAGE_KEY, `fake-token-${Date.now()}`);
    
    setUser(userWithoutPassword as User);
    setIsAuthenticated(true);
  };
  
  // Fonction de déconnexion
  const logout = async () => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Supprimer les données d'authentification
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Fonction de réinitialisation de mot de passe
  const resetPassword = async (email: string) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérifier si l'email existe
    const foundUser = mockUsers.find(user => user.email === email);
    
    if (!foundUser) {
      // Ne pas divulguer si l'email existe ou non pour des raisons de sécurité
      return;
    }
    
    // En production, envoyer un email avec un lien de réinitialisation
    console.log(`Email de réinitialisation envoyé à ${email}`);
  };
  
  // Fonction de mise à jour du profil utilisateur
  const updateUserProfile = async (data: object) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Mettre à jour l'utilisateur
    const updatedUser = {
      ...user,
      ...data
    };
    
    // Mettre à jour le stockage local
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    // Mettre à jour l'état
    setUser(updatedUser);
    
    return updatedUser;
  };
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
