import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  fr: {
    translation: {
      // Common
      "welcome": "Bienvenue",
      "loading": "Chargement...",
      "error": "Erreur",
      "success": "Succès",
      
      // Navigation
      "home": "Accueil",
      "dashboard": "Tableau de bord",
      "profile": "Profil",
      "settings": "Paramètres",
      
      // Auth
      "login": "Connexion",
      "signup": "Inscription",
      "logout": "Déconnexion",
      "email": "Email",
      "password": "Mot de passe",
      
      // Emotions
      "emotions": "Émotions",
      "mood": "Humeur",
      "scan": "Scanner",
      "journal": "Journal",
      
      // Actions
      "save": "Enregistrer",
      "cancel": "Annuler",
      "continue": "Continuer",
      "back": "Retour",
    }
  },
  en: {
    translation: {
      // Common
      "welcome": "Welcome",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      
      // Navigation
      "home": "Home",
      "dashboard": "Dashboard",
      "profile": "Profile",
      "settings": "Settings",
      
      // Auth
      "login": "Login",
      "signup": "Sign up",
      "logout": "Logout",
      "email": "Email",
      "password": "Password",
      
      // Emotions
      "emotions": "Emotions",
      "mood": "Mood",
      "scan": "Scan",
      "journal": "Journal",
      
      // Actions
      "save": "Save",
      "cancel": "Cancel",
      "continue": "Continue",
      "back": "Back",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;