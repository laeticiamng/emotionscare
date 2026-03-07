import React from 'react';
import { 
  Heart, 
  Mail, 
  MapPin, 
  Twitter,
  Linkedin
} from 'lucide-react';

const FOOTER_LINKS = {
  product: [
    { label: 'Tarifs', href: '/pricing' },
    { label: 'Entreprise', href: '/entreprise' },
    { label: 'Démo', href: '/demo' }
  ],
  support: [
    { label: 'Centre d\'aide', href: '/help' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' }
  ],
  company: [
    { label: 'À propos', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' }
  ],
  legal: [
    { label: 'Mentions légales', href: '/legal/mentions' },
    { label: 'Conditions d\'utilisation', href: '/legal/terms' },
    { label: 'Conditions de vente', href: '/legal/sales' },
    { label: 'Politique de confidentialité', href: '/legal/privacy' },
    { label: 'Cookies', href: '/legal/cookies' }
  ]
};

/**
 * Footer marketing complet
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">EmotionsCare</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              La plateforme de bien-être émotionnel qui respecte votre vie privée 
              et accompagne votre équilibre au quotidien.
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@emotionscare.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Amiens, France</span>
              </div>
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="font-medium mb-4">Produit</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map(link => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map(link => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map(link => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Légal</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map(link => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 EmotionsCare. Tous droits réservés.
          </p>

          {/* Social links — disabled until accounts exist */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1" title="Bientôt disponible">
              <Twitter className="w-3 h-3" /> Bientôt
            </span>
            <span className="flex items-center gap-1" title="Bientôt disponible">
              <Linkedin className="w-3 h-3" /> Bientôt
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
