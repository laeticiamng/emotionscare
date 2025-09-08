import React from 'react';

export const PrivacySettingsPage: React.FC<{ 'data-testid'?: string }> = ({ 'data-testid': testId }) => {
  return (
    <div className="min-h-screen bg-background" data-testid={testId || "page-root"}>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Paramètres de confidentialité</h1>
        
        <div className="max-w-4xl space-y-8">
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Contrôle des données</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Collecte de données analytiques</h3>
                  <p className="text-sm text-muted-foreground">Permettre la collecte de données d'usage pour améliorer l'expérience</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Personnalisation du contenu</h3>
                  <p className="text-sm text-muted-foreground">Utiliser vos données pour personnaliser les recommandations</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Partage avec partenaires</h3>
                  <p className="text-sm text-muted-foreground">Partager des données anonymisées avec nos partenaires de recherche</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Notifications et communications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Emails marketing</h3>
                  <p className="text-sm text-muted-foreground">Recevoir des informations sur nos nouveautés et conseils</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Notifications push</h3>
                  <p className="text-sm text-muted-foreground">Recevoir des rappels et notifications personnalisées</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Gestion des données</h2>
            
            <div className="space-y-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Télécharger mes données
              </button>
              
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90">
                Demander une correction
              </button>
              
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90">
                Supprimer mon compte
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};