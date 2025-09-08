/**
 * FOOTER PREMIUM - Pied de page optimisé
 * Accessible, SEO-friendly, avec liens organisés
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Shield,
  Sparkles,
  Music,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Plateforme',
      links: [
        { label: 'Analyse Émotionnelle', href: '/app/scan' },
        { label: 'Musicothérapie Suno', href: '/app/music' },
        { label: 'Coach Nyvée', href: '/app/coach' },
        { label: 'Journal Intelligent', href: '/app/journal' },
        { label: 'VR Thérapie', href: '/app/vr-breath' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Particuliers B2C', href: '/b2c' },
        { label: 'Entreprises B2B', href: '/entreprise' },
        { label: 'Professionnels Santé', href: '/professionals' },
        { label: 'API Développeurs', href: '/api' }
      ]
    },
    {
      title: 'Ressources',
      links: [
        { label: 'Centre d\'aide', href: '/help' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Blog Bien-être', href: '/blog' },
        { label: 'Études de cas', href: '/case-studies' }
      ]
    },
    {
      title: 'Entreprise',
      links: [
        { label: 'À propos', href: '/about' },
        { label: 'Équipe', href: '/team' },
        { label: 'Carrières', href: '/careers' },
        { label: 'Partenaires', href: '/partners' }
      ]
    }
  ];

  return (
    <footer className="bg-background border-t border-border" role="contentinfo">
      {/* Section principale */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Marque et description */}
          <div className="lg:col-span-2 space-y-6">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1"
              aria-label="EmotionsCare - Retour à l'accueil"
            >
              <div className="p-2 bg-gradient-to-br from-primary to-primary/70 rounded-lg group-hover:scale-105 transition-transform">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </Link>
            
            <p className="text-muted-foreground leading-relaxed max-w-md">
              La plateforme de bien-être émotionnel la plus avancée. 
              Analyse IA, musicothérapie Suno, coaching personnalisé et outils immersifs 
              pour votre épanouissement personnel et professionnel.
            </p>

            {/* Technologies */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                Propulsé par
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Brain className="h-3 w-3" />
                  <span>Hume AI</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>OpenAI GPT-5</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Music className="h-3 w-3" />
                  <span>Suno AI</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Supabase</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Sections de liens */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-medium text-foreground">
                {section.title}
              </h3>
              <nav className="space-y-2" role="navigation" aria-label={`Navigation ${section.title}`}>
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Section légale */}
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>© {currentYear} EmotionsCare. Tous droits réservés.</span>
            <span className="hidden md:inline">•</span>
            <span>Made with ❤️ in France</span>
          </div>
          
          <nav className="flex flex-wrap items-center gap-4 text-sm" role="navigation" aria-label="Navigation légale">
            <Link 
              to="/legal/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Confidentialité
            </Link>
            <Link 
              to="/legal/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              CGU
            </Link>
            <Link 
              to="/accessibility" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Accessibilité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;