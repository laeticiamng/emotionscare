// @ts-nocheck
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, X, CheckCircle2, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  tips?: string[];
  image?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: '👋 Bienvenue dans le système de monitoring avancé',
    description: 'Ce tutoriel vous guidera à travers toutes les fonctionnalités du dashboard : chatbot IA, tests A/B, et gestion des tickets automatiques.',
    tips: [
      'Le tutoriel dure environ 5 minutes',
      'Vous pouvez le reprendre à tout moment',
      'Chaque section est accompagnée d\'exemples pratiques'
    ]
  },
  {
    id: 'chatbot-intro',
    title: '🤖 Assistant IA de Monitoring',
    description: 'Le chatbot IA analyse vos données en temps réel et répond à vos questions en langage naturel. Il peut identifier des patterns, prédire des problèmes et vous donner des insights personnalisés.',
    tips: [
      'Posez des questions comme "Quelles alertes critiques en cours ?"',
      'Le chatbot accède à l\'historique complet des erreurs',
      'Les réponses incluent des graphiques et statistiques'
    ]
  },
  {
    id: 'chatbot-usage',
    title: '💬 Utiliser le Chatbot',
    description: 'Pour interroger le chatbot, tapez simplement votre question dans le champ de saisie. Exemples de questions utiles : \n\n• "Quels sont les patterns d\'erreurs récurrents ?"\n• "Comment évoluent les performances d\'escalade ?"\n• "Quelles sont les prédictions ML pour aujourd\'hui ?"',
    tips: [
      'Soyez spécifique dans vos questions',
      'Utilisez les suggestions prédéfinies pour démarrer',
      'Le chatbot mémorise le contexte de la conversation'
    ]
  },
  {
    id: 'ab-tests-intro',
    title: '🧪 Tests A/B sur les Règles d\'Escalade',
    description: 'Les tests A/B permettent de comparer deux configurations de règles d\'escalade en parallèle. Le système analyse automatiquement les performances et recommande la meilleure configuration.',
    tips: [
      'Créez des tests pour optimiser vos règles',
      'Le système calcule la significativité statistique',
      'Les gagnants sont sélectionnés automatiquement'
    ]
  },
  {
    id: 'ab-tests-creation',
    title: '➕ Créer un Test A/B',
    description: 'Pour créer un test :\n\n1. Cliquez sur "Créer un test A/B"\n2. Donnez un nom descriptif\n3. Sélectionnez la règle de contrôle (baseline)\n4. Sélectionnez la règle variante (test)\n5. Définissez la taille d\'échantillon minimum\n6. Lancez le test',
    tips: [
      'Taille d\'échantillon min : 100 alertes recommandées',
      'Niveau de confiance par défaut : 95%',
      'Les tests peuvent être arrêtés à tout moment'
    ]
  },
  {
    id: 'ab-tests-analysis',
    title: '📊 Analyse des Résultats',
    description: 'Le système analyse automatiquement les métriques clés :\n\n• Taux de résolution\n• Temps de résolution moyen\n• Coût moyen d\'escalade\n• Précision des décisions\n\nQuand un test atteint la significativité statistique, vous recevez une notification et une recommandation.',
    tips: [
      'Consultez les graphiques de performance en temps réel',
      'Le badge "Significatif" indique des résultats fiables',
      'Les recommandations ML aident à la décision'
    ]
  },
  {
    id: 'tickets-intro',
    title: '🎫 Création Automatique de Tickets',
    description: 'Les alertes escaladées peuvent créer automatiquement des tickets dans Jira ou Linear. L\'assignation est intelligente, basée sur les patterns ML détectés (type d\'erreur, composant affecté, expertise requise).',
    tips: [
      'Configurez d\'abord vos intégrations Jira/Linear',
      'L\'assignation ML utilise l\'historique des résolutions',
      'Les tickets incluent le contexte complet de l\'erreur'
    ]
  },
  {
    id: 'tickets-config',
    title: '⚙️ Configuration des Intégrations',
    description: 'Pour configurer Jira ou Linear :\n\n1. Allez dans "Intégrations de Tickets"\n2. Créez une nouvelle intégration\n3. Entrez votre URL API et token\n4. Définissez le projet et l\'assigné par défaut\n5. Activez l\'intégration',
    tips: [
      'Vous pouvez avoir plusieurs intégrations actives',
      'Les tokens API doivent avoir les droits de création',
      'Testez l\'intégration avant l\'activation'
    ]
  },
  {
    id: 'notifications',
    title: '🔔 Notifications Slack/Discord',
    description: 'Recevez des notifications automatiques sur Slack ou Discord quand :\n\n• Un test A/B atteint la significativité statistique\n• Un ticket est créé automatiquement\n• Une alerte critique est détectée\n\nConfigurez vos webhooks dans les paramètres.',
    tips: [
      'Créez un webhook entrant dans Slack/Discord',
      'Collez l\'URL dans la configuration',
      'Choisissez les événements à notifier'
    ]
  },
  {
    id: 'best-practices',
    title: '✨ Meilleures Pratiques',
    description: 'Pour tirer le meilleur parti du système :\n\n• Consultez régulièrement le chatbot pour détecter les tendances\n• Lancez des tests A/B sur les règles critiques\n• Vérifiez l\'assignation automatique des tickets\n• Ajustez les seuils selon vos besoins',
    tips: [
      'Planifiez des reviews hebdomadaires des métriques',
      'Documentez les changements de configuration',
      'Formez votre équipe aux nouveaux outils'
    ]
  },
  {
    id: 'complete',
    title: '🎉 Tutoriel Terminé !',
    description: 'Vous êtes maintenant prêt à utiliser toutes les fonctionnalités avancées du système de monitoring. N\'hésitez pas à reprendre ce tutoriel à tout moment.',
    tips: [
      'Accédez à la documentation complète dans les paramètres',
      'Rejoignez notre canal d\'assistance si besoin',
      'Partagez vos retours pour améliorer le système'
    ]
  }
];

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{step.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Fermer le tutoriel">
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Étape {currentStep + 1} sur {tutorialSteps.length}</span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <p className="text-base leading-relaxed whitespace-pre-line">
                {step.description}
              </p>

              {step.tips && step.tips.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Conseils pratiques
                  </div>
                  <ul className="space-y-2">
                    {step.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-primary w-6'
                      : index < currentStep
                      ? 'bg-primary/50'
                      : 'bg-secondary'
                  }`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button onClick={handleClose} className="gap-2">
                Terminer
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
