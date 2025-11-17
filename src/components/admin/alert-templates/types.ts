export interface AlertTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  template_type: 'email' | 'slack' | 'discord';
  subject?: string;
  body: string;
  available_variables: string[];
  is_default: boolean;
  last_used_at?: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  { name: 'errorMessage', description: 'Message d\'erreur' },
  { name: 'severity', description: 'Gravité (critical, high, medium, low)' },
  { name: 'priority', description: 'Priorité (urgent, high, medium, low)' },
  { name: 'category', description: 'Catégorie de l\'erreur' },
  { name: 'analysis', description: 'Analyse AI détaillée' },
  { name: 'suggestedFix', description: 'Solution suggérée' },
  { name: 'autoFixCode', description: 'Code de correction automatique (optionnel)' },
  { name: 'preventionTips', description: 'Conseils de prévention (tableau)' },
  { name: 'url', description: 'URL où l\'erreur s\'est produite' },
  { name: 'timestamp', description: 'Horodatage de l\'erreur' },
  { name: 'errorId', description: 'ID unique de l\'erreur' },
  { name: 'dashboardUrl', description: 'URL du dashboard de monitoring' },
];

export const EXAMPLE_DATA = {
  errorMessage: 'TypeError: Cannot read property \'user\' of undefined',
  severity: 'critical',
  priority: 'urgent',
  category: 'react-hooks',
  analysis: 'L\'erreur se produit lors de l\'accès à la propriété user d\'un objet undefined. Cela indique probablement un problème de timing où le composant essaie d\'accéder aux données avant qu\'elles ne soient chargées.',
  suggestedFix: 'Ajouter une vérification de nullité ou utiliser optional chaining (?.) avant d\'accéder à la propriété.',
  autoFixCode: 'const userName = data?.user?.name || \'Unknown\';',
  preventionTips: [
    'Toujours vérifier si les données sont chargées avant de les utiliser',
    'Utiliser TypeScript strict mode pour détecter ces erreurs',
    'Implémenter des états de chargement appropriés'
  ],
  url: 'https://app.emotionscare.com/dashboard',
  timestamp: new Date().toISOString(),
  errorId: 'err_' + Math.random().toString(36).substr(2, 9),
  dashboardUrl: 'https://app.emotionscare.com/admin/ai-monitoring',
};
