/**
 * Page d'installation PWA - Instructions visuelles pour iOS/Android/Desktop
 * Accessible via /install
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Smartphone, Monitor, Apple, Chrome, Share, Plus, MoreVertical, ArrowLeft, Check, Sparkles, Shield, Wifi, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageSEO } from '@/hooks/usePageSEO';
import PageRoot from '@/components/common/PageRoot';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  usePageSEO({
    title: 'Installer EmotionsCare - Application PWA',
    description: 'Installez EmotionsCare sur votre appareil pour un accès rapide à vos outils de bien-être émotionnel. Fonctionne hors ligne.',
    keywords: 'installer, PWA, application, mobile, offline, bien-être'
  });

  useEffect(() => {
    // Détecter la plateforme
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturer l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Installation error:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const features = [
    {
      icon: Wifi,
      title: 'Fonctionne hors ligne',
      description: 'Accédez à vos outils même sans connexion internet'
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Recevez des rappels pour vos séances de bien-être'
    },
    {
      icon: Sparkles,
      title: 'Accès rapide',
      description: 'Lancez l\'app directement depuis votre écran d\'accueil'
    },
    {
      icon: Shield,
      title: 'Données sécurisées',
      description: 'Vos données restent protégées et chiffrées'
    }
  ];

  if (isInstalled) {
    return (
      <PageRoot>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20">
                <Check className="h-10 w-10 text-success" />
              </div>
              <h1 className="text-3xl font-bold">EmotionsCare est installée !</h1>
              <p className="text-muted-foreground text-lg">
                L'application est disponible sur votre écran d'accueil. Vous pouvez maintenant fermer cet onglet.
              </p>
              <Button asChild size="lg">
                <Link to="/app/home">
                  Ouvrir l'application
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Link>
            </Button>
          </div>

          {/* Hero Section */}
          <header className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Download className="h-4 w-4" />
              Installation gratuite
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Installez EmotionsCare
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Accédez à vos outils de bien-être émotionnel directement depuis votre écran d'accueil, même hors ligne.
            </p>

            {/* Bouton d'installation natif si disponible */}
            {deferredPrompt && (
              <Button 
                size="lg" 
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="gap-2 text-lg px-8 py-6"
              >
                <Download className="h-5 w-5" />
                {isInstalling ? 'Installation...' : 'Installer maintenant'}
              </Button>
            )}
          </header>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Instructions par plateforme */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Instructions d'installation
            </h2>

            <Tabs defaultValue={platform} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="ios" className="gap-2">
                  <Apple className="h-4 w-4" />
                  iPhone / iPad
                </TabsTrigger>
                <TabsTrigger value="android" className="gap-2">
                  <Smartphone className="h-4 w-4" />
                  Android
                </TabsTrigger>
                <TabsTrigger value="desktop" className="gap-2">
                  <Monitor className="h-4 w-4" />
                  Ordinateur
                </TabsTrigger>
              </TabsList>

              {/* iOS Instructions */}
              <TabsContent value="ios">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="h-5 w-5" />
                      Installation sur iPhone / iPad
                    </CardTitle>
                    <CardDescription>
                      Safari est requis pour installer l'application sur iOS
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <InstallStep 
                        number={1}
                        title="Ouvrez Safari"
                        description="Assurez-vous d'utiliser Safari (pas Chrome ou Firefox)"
                        icon={<Chrome className="h-5 w-5" />}
                      />
                      <InstallStep 
                        number={2}
                        title="Appuyez sur le bouton Partager"
                        description="L'icône carré avec une flèche vers le haut en bas de l'écran"
                        icon={<Share className="h-5 w-5" />}
                      />
                      <InstallStep 
                        number={3}
                        title="Sélectionnez « Sur l'écran d'accueil »"
                        description="Faites défiler les options jusqu'à trouver cette option"
                        icon={<Plus className="h-5 w-5" />}
                      />
                      <InstallStep 
                        number={4}
                        title="Appuyez sur « Ajouter »"
                        description="L'application apparaîtra sur votre écran d'accueil"
                        icon={<Check className="h-5 w-5" />}
                      />
                    </div>

                    {/* Visual Guide */}
                    <div className="rounded-xl bg-gradient-to-br from-muted to-muted/80 p-6 text-foreground border border-border">
                      <div className="flex justify-center gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-xl bg-primary/80 flex items-center justify-center mb-2 mx-auto">
                            <Sparkles className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <span className="text-xs">EmotionsCare</span>
                        </div>
                      </div>
                      <p className="text-center text-muted-foreground text-sm mt-4">
                        L'icône apparaîtra ainsi sur votre écran d'accueil
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Android Instructions */}
              <TabsContent value="android">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Installation sur Android
                    </CardTitle>
                    <CardDescription>
                      Utilisez Chrome ou un navigateur compatible
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <InstallStep 
                        number={1}
                        title="Ouvrez Chrome"
                        description="Ou un autre navigateur compatible (Edge, Samsung Internet)"
                        icon={<Chrome className="h-5 w-5" />}
                      />
                      <InstallStep 
                        number={2}
                        title="Ouvrez le menu"
                        description="Appuyez sur les trois points verticaux (⋮) en haut à droite"
                        icon={<MoreVertical className="h-5 w-5" />}
                      />
                      <InstallStep 
                        number={3}
                        title="Sélectionnez « Installer l'application »"
                        description="Ou « Ajouter à l'écran d'accueil » selon votre navigateur"
                        icon={<Download className="h-5 w-5" />}
                      />
                      <InstallStep 
                        number={4}
                        title="Confirmez l'installation"
                        description="Appuyez sur « Installer » dans la fenêtre de confirmation"
                        icon={<Check className="h-5 w-5" />}
                      />
                    </div>

                    {/* Bannière automatique */}
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <p className="text-sm text-primary font-medium mb-2">
                        💡 Astuce
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sur Android, une bannière d'installation peut apparaître automatiquement en bas de l'écran. 
                        Appuyez simplement sur « Installer » pour ajouter l'application.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Desktop Instructions */}
              <TabsContent value="desktop">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Installation sur ordinateur
                    </CardTitle>
                    <CardDescription>
                      Chrome, Edge ou Brave sont recommandés
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {deferredPrompt ? (
                      <div className="text-center py-8 space-y-4">
                        <p className="text-muted-foreground">
                          Votre navigateur supporte l'installation directe !
                        </p>
                        <Button 
                          size="lg" 
                          onClick={handleInstallClick}
                          disabled={isInstalling}
                          className="gap-2"
                        >
                          <Download className="h-5 w-5" />
                          {isInstalling ? 'Installation...' : 'Installer EmotionsCare'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <InstallStep 
                          number={1}
                          title="Ouvrez Chrome, Edge ou Brave"
                          description="Firefox ne supporte pas encore l'installation PWA sur desktop"
                          icon={<Chrome className="h-5 w-5" />}
                        />
                        <InstallStep 
                          number={2}
                          title="Cherchez l'icône d'installation"
                          description="Dans la barre d'adresse, à droite, cliquez sur l'icône ⊕ ou 📥"
                          icon={<Plus className="h-5 w-5" />}
                        />
                        <InstallStep 
                          number={3}
                          title="Cliquez sur « Installer »"
                          description="L'application s'ouvrira dans sa propre fenêtre"
                          icon={<Check className="h-5 w-5" />}
                        />
                      </div>
                    )}

                    {/* Raccourci clavier */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                      <p className="text-sm font-medium mb-2">
                        ⌨️ Raccourci Chrome/Edge
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Menu (⋮) → « Installer EmotionsCare... » ou « Plus d'outils » → « Créer un raccourci »
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* FAQ */}
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold text-center">Questions fréquentes</h2>
            <div className="grid gap-4">
              <FaqItem 
                question="Qu'est-ce qu'une PWA ?"
                answer="Une Progressive Web App (PWA) est une application web qui fonctionne comme une application native. Elle s'installe sur votre appareil, fonctionne hors ligne et offre une expérience rapide."
              />
              <FaqItem 
                question="L'installation est-elle gratuite ?"
                answer="Oui, l'installation est entièrement gratuite. Il n'y a aucun passage par l'App Store ou le Play Store."
              />
              <FaqItem 
                question="Mes données sont-elles sécurisées ?"
                answer="Absolument. Vos données sont chiffrées et stockées de manière sécurisée. L'application respecte le RGPD et vos données personnelles ne sont jamais partagées."
              />
              <FaqItem 
                question="Puis-je désinstaller l'application ?"
                answer="Oui, vous pouvez la désinstaller à tout moment comme n'importe quelle autre application sur votre appareil."
              />
            </div>
          </section>

          {/* CTA Final */}
          <section className="mt-12 text-center py-8">
            <p className="text-muted-foreground mb-4">
              Besoin d'aide ? Contactez notre support
            </p>
            <Button variant="outline" asChild>
              <Link to="/help">Centre d'aide</Link>
            </Button>
          </section>
        </div>
      </div>
    </PageRoot>
  );
};

// Composant pour les étapes d'installation
const InstallStep: React.FC<{
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ number, title, description, icon }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold mb-1 flex items-center gap-2">
        {title}
        <span className="text-muted-foreground">{icon}</span>
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

// Composant pour les FAQ
const FaqItem: React.FC<{
  question: string;
  answer: string;
}> = ({ question, answer }) => (
  <Card className="bg-card/50">
    <CardContent className="p-6">
      <h3 className="font-semibold mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </CardContent>
  </Card>
);

export default InstallPage;
