
import React from 'react';

const AICoachPage: React.FC = () => {
  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Coach IA</h1>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Votre Accompagnateur Personnel</h2>
          <p className="text-muted-foreground mb-6">
            Intelligence artificielle dédiée à votre bien-être émotionnel
          </p>
          {/* TODO: Implémenter l'interface de coach IA complète */}
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">🤖 Coach IA: Comment vous sentez-vous aujourd'hui ?</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Tapez votre réponse ici...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AICoachPage;
