import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';

/**
 * Page hub Mentions Légales
 */
export const LegalPage: React.FC = () => {
  const navigate = useNavigate();

  const legalLinks = [
    {
      title: "Conditions Générales d'Utilisation",
      description: "Règles d'utilisation de la plateforme EmotionsCare",
      icon: <FileText className="h-6 w-6 text-primary" />,
      path: '/legal/terms',
    },
    {
      title: 'Politique de Confidentialité',
      description: 'Comment nous collectons, utilisons et protégeons vos données',
      icon: <Shield className="h-6 w-6 text-primary" />,
      path: '/legal/privacy',
    },
    {
      title: 'Mentions Légales',
      description: 'Informations légales sur EmotionsCare',
      icon: <Scale className="h-6 w-6 text-primary" />,
      path: '#legal-notices',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          onClick={() => navigate(routes.public.home())}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Informations Légales</h1>
            <p className="text-muted-foreground">
              Retrouvez toutes les informations légales concernant EmotionsCare
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {legalLinks.map((link) => (
              <Card
                key={link.title}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(link.path)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">{link.icon}</div>
                  <CardTitle>{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full">
                    Consulter →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card id="legal-notices">
            <CardHeader>
              <CardTitle>Mentions Légales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Éditeur</h3>
                <p className="text-sm text-muted-foreground">
                  EmotionsCare
                  <br />
                  Société par Actions Simplifiée
                  <br />
                  Capital social : 10 000 €<br />
                  SIRET : [À compléter]
                  <br />
                  Siège social : France
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Directeur de la publication</h3>
                <p className="text-sm text-muted-foreground">[Nom du directeur]</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Hébergement</h3>
                <p className="text-sm text-muted-foreground">
                  Supabase Inc.
                  <br />
                  Serveurs hébergés en Europe (RGPD compliant)
                  <br />
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.supabase.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Email : contact@emotionscare.com
                  <br />
                  Support : support@emotionscare.com
                  <br />
                  DPO : dpo@emotionscare.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Propriété intellectuelle</h3>
                <p className="text-sm text-muted-foreground">
                  Tous les contenus présents sur EmotionsCare (textes, images, vidéos, logos,
                  etc.) sont protégés par le droit d'auteur et restent la propriété exclusive
                  d'EmotionsCare. Toute reproduction non autorisée est interdite.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
