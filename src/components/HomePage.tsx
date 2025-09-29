import React from 'react';

interface HomePageProps {
  onStartAssessment: (instrument: 'WHO5' | 'STAI6' | 'SAM' | 'SUDS' | 'PANAS10' | 'PSS10') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAssessment }) => {
  const instruments = [
    { code: 'WHO5' as const, name: 'WHO-5 Bien-être', description: 'Indice de bien-être (validé BMC Psychiatry 2024)' },
    { code: 'STAI6' as const, name: 'STAI-6 État émotionnel', description: 'Mesure d\'état émotionnel (validé PMC 2009)' },
    { code: 'SAM' as const, name: 'SAM Valence', description: 'Évaluation de valence émotionnelle (validé IEEE 2024)' },
    { code: 'SUDS' as const, name: 'SUDS Intensité', description: 'Mesure d\'intensité subjective (validé PMC 2025)' },
    { code: 'PANAS10' as const, name: 'PANAS-10 Affect', description: 'Mesure d\'affect (validé international 2007)' },
    { code: 'PSS10' as const, name: 'PSS-10 Tension', description: 'Échelle de tension perçue (validé BMC 2024)' }
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">EmotionsCare</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Système d'évaluation clinique basé sur des recherches validées scientifiquement.
          Tous les instruments sont conformes aux validations psychométriques récentes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {instruments.map((instrument) => (
          <div key={instrument.code} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{instrument.name}</h3>
            <p className="text-muted-foreground mb-4">{instrument.description}</p>
            <button
              onClick={() => onStartAssessment(instrument.code)}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Commencer l'évaluation
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-block bg-muted p-6 rounded-lg max-w-4xl">
          <h2 className="text-lg font-semibold mb-3">✅ Système validé scientifiquement</h2>
          <p className="text-sm text-muted-foreground">
            Toutes les évaluations sont basées sur des recherches récentes validées:
            WHO-5 (BMC Psychiatry 2024), STAI-6 (PMC 2009), SUDS (PMC 2025), 
            SAM (IEEE 2024), PANAS-10 (Journal Cross-Cultural Psychology 2007), 
            PSS-10 (BMC Psychiatry 2024).
          </p>
        </div>
      </div>
    </div>
  );
};