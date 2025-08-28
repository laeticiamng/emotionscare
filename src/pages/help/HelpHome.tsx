import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, Shield, Settings, ExternalLink } from 'lucide-react';
import { HelpSearch } from '@/components/help/HelpSearch';
import { CategoryList } from '@/components/help/CategoryList';
import { FAQAccordion } from '@/components/help/FAQAccordion';
import { useHelp } from '@/hooks/useHelp';
import { useNavigate } from 'react-router-dom';

const HelpHome: React.FC = () => {
  const { sections, topFaqs, search } = useHelp();
  const navigate = useNavigate();

  // Analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'help.view_home');
    }
  }, []);

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@emotionscare.com?subject=Demande d\'aide EmotionsCare';
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Centre d'aide</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Trouvez rapidement des réponses à vos questions ou explorez nos guides détaillés.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <HelpSearch onQuery={search} />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-5 h-5 text-primary" />
              RGPD & Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Export, suppression et gestion de vos données personnelles.
            </p>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/settings/export')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Exporter mes données
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate('/settings/delete-account')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Supprimer mon compte
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="w-5 h-5" />
              Guides d'usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Apprenez à utiliser tous les modules EmotionsCare.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/help/section/modules')}
            >
              Voir les guides
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="w-5 h-5" />
              Support technique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Problèmes techniques, compatibilité, bugs.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleContactSupport}
            >
              Nous contacter
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Parcourir par catégorie</h2>
        <CategoryList items={sections} />
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <FAQAccordion items={topFaqs} />
      </div>

      {/* Contact */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Vous ne trouvez pas votre réponse ?</CardTitle>
          <CardDescription>
            Notre équipe support est là pour vous aider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleContactSupport} className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Contacter le support
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Réponse sous 24h en moyenne
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpHome;