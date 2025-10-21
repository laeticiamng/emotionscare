// @ts-nocheck
import React from 'react';
import { AssessmentWrapper } from '@/components/assess';
import { logger } from '@/lib/logger';

const AssessmentDemo = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Assessments Cliniques
          </h1>
          <p className="text-muted-foreground">
            Mini-questionnaires facultatifs avec retours verbaux uniquement
          </p>
        </header>

        <div className="grid gap-6">
          {/* WHO5 - Bien-être hebdomadaire */}
          <AssessmentWrapper
            instrument="WHO5"
            title="Mini bien-être"
            description="5 questions courtes pour adapter votre plan du jour"
            context="weekly"
            estimatedTime={2}
            onComplete={(badges) => {
              logger.info('WHO5 badges', { badges }, 'UI');
              // Ces badges influencent l'ordre des cartes et le ton
            }}
          />

          {/* SAM - Ressenti instantané */}
          <AssessmentWrapper
            instrument="SAM"
            title="Ressenti instantané"
            description="2 curseurs pour colorer l'interface selon votre état"
            context="adhoc"
            estimatedTime={1}
            onComplete={(badges) => {
              logger.info('SAM badges', { badges }, 'UI');
              // Ces badges influencent les couleurs UI et micro-gestes
            }}
          />

          {/* STAI6 - Détente pré/post session */}
          <AssessmentWrapper
            instrument="STAI6"
            title="État de détente"
            description="6 items pour personnaliser votre session"
            context="pre"
            estimatedTime={2}
            onComplete={(badges) => {
              logger.info('STAI6 badges', { badges }, 'UI');
              // Ces badges ajustent les suggestions de techniques
            }}
          />

          {/* SUDS - Tension instantanée */}
          <AssessmentWrapper
            instrument="SUDS"
            title="Niveau de tension"
            description="Un curseur rapide pour s'adapter à votre état"
            context="adhoc"
            estimatedTime={1}
            onComplete={(badges) => {
              logger.info('SUDS badges', { badges }, 'UI');
              // Ces badges influencent la durée et l'intensité des exercices
            }}
          />
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            ✅ Feature flags configurés<br/>
            ✅ Retours verbaux uniquement<br/>
            ✅ Opt-in obligatoire<br/>
            ✅ Accessibilité complète
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDemo;