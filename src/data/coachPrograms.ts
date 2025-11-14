import { Brain, Target, Heart, Sparkles, LucideIcon } from 'lucide-react';

export interface ProgramLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: {
    introduction: string;
    objectives: string[];
    activities: Array<{
      title: string;
      description: string;
      duration: string;
    }>;
    reflection: string;
    resources?: string[];
  };
  completed?: boolean;
}

export interface CoachProgram {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  duration: string;
  sessions: number;
  level: string;
  color: string;
  progress: number;
  lessons: ProgramLesson[];
  benefits: string[];
  prerequisites?: string;
}

export const coachPrograms: CoachProgram[] = [
  {
    id: 'stress-management',
    title: 'Gestion du Stress',
    description: 'Apprenez à identifier et gérer votre stress quotidien',
    longDescription: 'Ce programme vous accompagne dans la compréhension et la gestion efficace du stress. Vous découvrirez des techniques éprouvées pour réduire votre niveau de stress, améliorer votre bien-être mental et développer une résilience durable face aux défis quotidiens.',
    icon: Brain,
    duration: '4 semaines',
    sessions: 12,
    level: 'Débutant',
    color: 'bg-blue-500/10 text-blue-600',
    progress: 0,
    benefits: [
      'Réduction significative du niveau de stress',
      'Amélioration de la qualité du sommeil',
      'Meilleure concentration et productivité',
      'Techniques de relaxation pratiques',
      'Prévention du burnout',
    ],
    lessons: [
      {
        id: 'sm-01',
        title: 'Comprendre le Stress',
        description: 'Introduction aux mécanismes du stress et à ses effets',
        duration: '30 min',
        content: {
          introduction: 'Le stress est une réaction naturelle de notre corps face aux défis. Comprendre son fonctionnement est la première étape pour le gérer efficacement.',
          objectives: [
            'Identifier les différents types de stress',
            'Reconnaître vos propres déclencheurs de stress',
            'Comprendre la réponse physiologique au stress',
            'Distinguer le stress positif du stress négatif',
          ],
          activities: [
            {
              title: 'Auto-évaluation du stress',
              description: 'Complétez un questionnaire pour mesurer votre niveau de stress actuel et identifier vos principaux facteurs de stress.',
              duration: '10 min',
            },
            {
              title: 'Cartographie du stress',
              description: 'Créez une carte mentale de vos sources de stress quotidiennes, hebdomadaires et mensuelles.',
              duration: '15 min',
            },
            {
              title: 'Journal de bord',
              description: 'Commencez à tenir un journal pour noter vos moments de stress et les situations déclencheuses.',
              duration: '5 min/jour',
            },
          ],
          reflection: 'Quels sont les trois principaux facteurs de stress dans votre vie actuellement ? Comment affectent-ils votre quotidien ?',
          resources: [
            'Guide PDF : Comprendre le stress',
            'Vidéo : La science du stress expliquée',
            'Test : Échelle de stress perçu (PSS)',
          ],
        },
      },
      {
        id: 'sm-02',
        title: 'Techniques de Respiration',
        description: 'Maîtrisez des exercices de respiration pour calmer le stress',
        duration: '25 min',
        content: {
          introduction: 'La respiration est un outil puissant et accessible à tout moment pour réduire le stress immédiatement.',
          objectives: [
            'Apprendre 3 techniques de respiration efficaces',
            'Pratiquer la cohérence cardiaque',
            'Utiliser la respiration en situation de stress',
            'Intégrer la respiration dans votre routine quotidienne',
          ],
          activities: [
            {
              title: 'Respiration 4-7-8',
              description: 'Pratiquez la technique de respiration 4-7-8 pour calmer instantanément le système nerveux.',
              duration: '5 min',
            },
            {
              title: 'Cohérence cardiaque',
              description: 'Session guidée de cohérence cardiaque (5 min, 3 fois par jour).',
              duration: '15 min',
            },
            {
              title: 'Respiration abdominale',
              description: 'Exercice pour reconnecter avec votre respiration naturelle et profonde.',
              duration: '5 min',
            },
          ],
          reflection: 'Quelle technique de respiration vous semble la plus accessible au quotidien ? Comment pourriez-vous l\'intégrer dans vos moments de stress ?',
          resources: [
            'Audio guidé : Exercices de respiration',
            'Application : Respirelax+ (cohérence cardiaque)',
            'Fiche pratique : Les 5 meilleures respirations anti-stress',
          ],
        },
      },
      {
        id: 'sm-03',
        title: 'Méditation Guidée',
        description: 'Découvrez la méditation pour apaiser votre esprit',
        duration: '35 min',
        content: {
          introduction: 'La méditation est un entraînement de l\'esprit qui permet de cultiver le calme, la clarté et la présence.',
          objectives: [
            'Comprendre les bienfaits de la méditation',
            'Pratiquer une méditation guidée complète',
            'Surmonter les obstacles communs à la méditation',
            'Créer une routine de méditation personnalisée',
          ],
          activities: [
            {
              title: 'Méditation de pleine conscience',
              description: 'Séance guidée de 10 minutes pour observer vos pensées sans jugement.',
              duration: '10 min',
            },
            {
              title: 'Scan corporel',
              description: 'Exploration guidée des sensations corporelles pour relâcher les tensions.',
              duration: '15 min',
            },
            {
              title: 'Méditation du matin',
              description: 'Courte pratique énergisante pour bien commencer la journée.',
              duration: '5 min',
            },
          ],
          reflection: 'Qu\'avez-vous observé pendant votre méditation ? Quelles difficultés avez-vous rencontrées et comment les avez-vous surmontées ?',
          resources: [
            'Application : Petit Bambou ou Headspace',
            'Audio : 21 méditations guidées',
            'Livre recommandé : "Où tu vas, tu es" de Jon Kabat-Zinn',
          ],
        },
      },
      {
        id: 'sm-04',
        title: 'Gestion des Émotions',
        description: 'Apprenez à accueillir et réguler vos émotions',
        duration: '40 min',
        content: {
          introduction: 'Les émotions sont des messagers précieux. Apprendre à les accueillir et les réguler est essentiel pour gérer le stress.',
          objectives: [
            'Identifier et nommer vos émotions avec précision',
            'Comprendre le lien entre émotions et stress',
            'Pratiquer l\'acceptation émotionnelle',
            'Développer des stratégies de régulation émotionnelle',
          ],
          activities: [
            {
              title: 'Roue des émotions',
              description: 'Explorez la palette complète de vos émotions avec l\'outil de la roue émotionnelle.',
              duration: '10 min',
            },
            {
              title: 'Technique RAIN',
              description: 'Pratiquez Reconnaître, Accueillir, Investiguer, Non-identification pour accueillir vos émotions difficiles.',
              duration: '15 min',
            },
            {
              title: 'Journal émotionnel',
              description: 'Tenez un journal pour suivre vos émotions et identifier les patterns.',
              duration: '10 min',
            },
          ],
          reflection: 'Quelle émotion avez-vous le plus de mal à accueillir ? Pourquoi pensez-vous que c\'est le cas ?',
          resources: [
            'Outil : La roue des émotions de Plutchik',
            'Vidéo : Comment réguler ses émotions',
            'Exercice : Défusion cognitive ACT',
          ],
        },
      },
    ],
  },
  {
    id: 'emotional-intelligence',
    title: 'Intelligence Émotionnelle',
    description: 'Développez votre conscience émotionnelle et empathie',
    longDescription: 'Développez une intelligence émotionnelle solide pour améliorer vos relations, votre communication et votre leadership. Ce programme vous guide dans la compréhension de vos émotions et celles des autres.',
    icon: Heart,
    duration: '6 semaines',
    sessions: 18,
    level: 'Intermédiaire',
    color: 'bg-pink-500/10 text-pink-600',
    progress: 35,
    benefits: [
      'Meilleure conscience de soi',
      'Relations interpersonnelles améliorées',
      'Communication plus efficace',
      'Leadership émotionnel renforcé',
      'Résolution de conflits constructive',
    ],
    prerequisites: 'Une première expérience de travail sur soi est recommandée',
    lessons: [
      {
        id: 'ei-01',
        title: 'Reconnaissance des Émotions',
        description: 'Développez votre vocabulaire émotionnel',
        duration: '30 min',
        content: {
          introduction: 'La reconnaissance précise des émotions est la base de l\'intelligence émotionnelle.',
          objectives: [
            'Élargir votre vocabulaire émotionnel',
            'Distinguer émotions primaires et secondaires',
            'Reconnaître les microexpressions faciales',
            'Identifier les émotions dans le corps',
          ],
          activities: [
            {
              title: 'Atlas des émotions',
              description: 'Explorez l\'atlas complet des émotions humaines et leurs nuances.',
              duration: '15 min',
            },
            {
              title: 'Scan émotionnel quotidien',
              description: 'Prenez 5 minutes chaque jour pour identifier vos émotions actuelles.',
              duration: '5 min/jour',
            },
            {
              title: 'Exercice de microexpressions',
              description: 'Entraînez-vous à reconnaître les émotions sur les visages.',
              duration: '10 min',
            },
          ],
          reflection: 'Combien d\'émotions différentes pouvez-vous identifier en ce moment ? Où les ressentez-vous dans votre corps ?',
        },
      },
      {
        id: 'ei-02',
        title: 'Communication Non-Violente',
        description: 'Exprimez vos besoins avec authenticité',
        duration: '45 min',
        content: {
          introduction: 'La CNV vous permet d\'exprimer vos émotions et besoins de manière claire et respectueuse.',
          objectives: [
            'Maîtriser les 4 étapes de la CNV',
            'Distinguer observation et évaluation',
            'Identifier vos besoins fondamentaux',
            'Formuler des demandes claires',
          ],
          activities: [
            {
              title: 'Les 4 étapes OSBD',
              description: 'Pratiquez Observation, Sentiment, Besoin, Demande dans vos communications.',
              duration: '20 min',
            },
            {
              title: 'Transformation des jugements',
              description: 'Convertissez vos jugements en observations objectives.',
              duration: '15 min',
            },
            {
              title: 'Jeu de rôle CNV',
              description: 'Simulez des conversations difficiles en utilisant la CNV.',
              duration: '10 min',
            },
          ],
          reflection: 'Quelle situation récente aurait pu bénéficier de la CNV ? Comment l\'auriez-vous abordée différemment ?',
        },
      },
    ],
  },
  {
    id: 'goal-setting',
    title: 'Atteinte des Objectifs',
    description: 'Définissez et atteignez vos objectifs personnels',
    longDescription: 'Transformez vos rêves en réalité avec une méthodologie éprouvée de définition et d\'atteinte d\'objectifs. Apprenez à planifier, à rester motivé et à surmonter les obstacles.',
    icon: Target,
    duration: '8 semaines',
    sessions: 24,
    level: 'Avancé',
    color: 'bg-green-500/10 text-green-600',
    progress: 0,
    benefits: [
      'Clarté sur vos objectifs de vie',
      'Plan d\'action structuré',
      'Motivation durable',
      'Techniques de surmontage des obstacles',
      'Système de suivi de progression',
    ],
    lessons: [
      {
        id: 'gs-01',
        title: 'Définir des Objectifs SMART',
        description: 'Formulez des objectifs clairs et atteignables',
        duration: '40 min',
        content: {
          introduction: 'Les objectifs SMART sont Spécifiques, Mesurables, Atteignables, Réalistes et Temporels.',
          objectives: [
            'Transformer vos rêves en objectifs concrets',
            'Appliquer la méthodologie SMART',
            'Établir des indicateurs de succès',
            'Créer un plan d\'action détaillé',
          ],
          activities: [
            {
              title: 'Exercice de vision',
              description: 'Visualisez votre vie idéale dans 1, 3 et 5 ans.',
              duration: '15 min',
            },
            {
              title: 'Transformation SMART',
              description: 'Convertissez 3 de vos objectifs en format SMART.',
              duration: '20 min',
            },
            {
              title: 'Tableau de bord',
              description: 'Créez votre tableau de bord personnel pour suivre vos objectifs.',
              duration: '15 min',
            },
          ],
          reflection: 'Quel est l\'objectif le plus important pour vous en ce moment ? Pourquoi est-il si significatif ?',
        },
      },
    ],
  },
  {
    id: 'mindfulness',
    title: 'Pleine Conscience',
    description: 'Cultivez la présence et la sérénité au quotidien',
    longDescription: 'Découvrez l\'art de vivre pleinement chaque moment. Ce programme vous enseigne les pratiques de pleine conscience pour réduire le stress, améliorer la concentration et cultiver la paix intérieure.',
    icon: Sparkles,
    duration: '6 semaines',
    sessions: 15,
    level: 'Tous niveaux',
    color: 'bg-purple-500/10 text-purple-600',
    progress: 60,
    benefits: [
      'Réduction de l\'anxiété et du stress',
      'Amélioration de la concentration',
      'Meilleure qualité de sommeil',
      'Plus grande paix intérieure',
      'Augmentation de la créativité',
    ],
    lessons: [
      {
        id: 'mf-01',
        title: 'Introduction à la Pleine Conscience',
        description: 'Découvrez les fondamentaux de la mindfulness',
        duration: '35 min',
        content: {
          introduction: 'La pleine conscience est l\'art de porter attention au moment présent avec ouverture et bienveillance.',
          objectives: [
            'Comprendre ce qu\'est la pleine conscience',
            'Découvrir les bienfaits scientifiquement prouvés',
            'Pratiquer votre première méditation',
            'Intégrer la pleine conscience au quotidien',
          ],
          activities: [
            {
              title: 'Méditation du raisin sec',
              description: 'Expérience sensorielle complète pour comprendre la pleine conscience.',
              duration: '10 min',
            },
            {
              title: 'Marche consciente',
              description: 'Pratiquez la pleine conscience en mouvement.',
              duration: '15 min',
            },
            {
              title: 'Pause consciente',
              description: 'Intégrez 3 pauses de 2 minutes dans votre journée.',
              duration: '6 min/jour',
            },
          ],
          reflection: 'Qu\'avez-vous remarqué pendant votre pratique que vous n\'aviez jamais observé auparavant ?',
        },
      },
    ],
  },
];

export function getProgramById(id: string): CoachProgram | undefined {
  return coachPrograms.find(program => program.id === id);
}
