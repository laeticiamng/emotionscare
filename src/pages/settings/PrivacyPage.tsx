import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrivacySettingsTab from '@/components/settings/PrivacySettingsTab';
import { Helmet } from 'react-helmet-async';

/**
 * Page de gestion de la confidentialité et RGPD
 * Route: /settings/privacy
 */
export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Confidentialité & Données | EmotionsCare</title>
        <meta 
          name="description" 
          content="Gérez vos préférences de confidentialité, exportez vos données et contrôlez vos consentements RGPD." 
        />
      </Helmet>
      
      <div className="container mx-auto p-6 max-w-4xl">
        <header className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2"
            asChild
          >
            <Link to="/settings" aria-label="Retour aux paramètres">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Retour aux paramètres
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8" aria-hidden="true" />
            Confidentialité & Données
          </h1>
          <p className="text-muted-foreground mt-2">
            Contrôlez vos données personnelles, gérez vos consentements et exercez vos droits RGPD
          </p>
        </header>

        <main>
          <PrivacySettingsTab />
        </main>
      </div>
    </>
  );
}
