import React from 'react';

export const NotificationSettingsPage: React.FC<{ 'data-testid'?: string }> = ({ 'data-testid': testId }) => {
  return (
    <div className="min-h-screen bg-background" data-testid={testId || "page-root"}>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Paramètres de notifications</h1>
        
        <div className="max-w-4xl space-y-8">
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Notifications push</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Rappels de session</h3>
                  <p className="text-sm text-muted-foreground">Recevoir un rappel pour vos sessions de bien-être</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Objectifs quotidiens</h3>
                  <p className="text-sm text-muted-foreground">Notifications pour vos objectifs de bien-être</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Achievements</h3>
                  <p className="text-sm text-muted-foreground">Être notifié des nouvelles réalisations</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Notifications par email</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Résumé hebdomadaire</h3>
                  <p className="text-sm text-muted-foreground">Recevoir un résumé de votre progression</p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Conseils personnalisés</h3>
                  <p className="text-sm text-muted-foreground">Recevoir des conseils basés sur votre profil</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-card-foreground">Mises à jour produit</h3>
                  <p className="text-sm text-muted-foreground">Être informé des nouvelles fonctionnalités</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Horaires de notification</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Ne pas déranger - Début
                </label>
                <input type="time" className="px-3 py-2 border rounded" defaultValue="22:00" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Ne pas déranger - Fin
                </label>
                <input type="time" className="px-3 py-2 border rounded" defaultValue="08:00" />
              </div>
            </div>
          </section>

          <div className="pt-6">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90">
              Sauvegarder les paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};