import { useState, useEffect } from 'react';
import { 
  Check, 
  Star, 
  Building2,
  Users,
  Heart,
  Brain,
  Shield,
  Headphones,
  Zap
} from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 pb-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    lg: 'h-11 px-8',
    sm: 'h-9 px-3'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Switch = ({ checked, onCheckedChange, className = '' }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      checked ? 'bg-blue-600' : 'bg-gray-200'
    } ${className}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function PricingPageWorking() {
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultPlans = [
    {
      id: 'free',
      name: 'Découverte',
      description: 'Parfait pour commencer votre parcours de bien-être',
      price_monthly: 0,
      price_yearly: 0,
      badge: null,
      icon: Heart,
      color: 'text-green-600',
      features: [
        '3 séances par jour',
        'Scan émotionnel de base',
        'Musique thérapeutique (5 pistes)',
        'Journal personnel',
        'Exercices de respiration simples',
        'Support communautaire'
      ],
      limitations: [
        'Pas de coaching IA',
        'Pas de modules VR',
        'Analytics limités'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Accès complet aux technologies de pointe',
      price_monthly: 19.99,
      price_yearly: 199.99,
      badge: 'Populaire',
      icon: Star,
      color: 'text-blue-600',
      features: [
        'Séances illimitées',
        'Tous les modules disponibles',
        'Coach IA personnalisé',
        'Expériences VR complètes',
        'Analytics avancés',
        'Musique thérapeutique (200+ pistes)',
        'Biofeedback en temps réel',
        'Support prioritaire',
        'Exports de données'
      ],
      limitations: []
    },
    {
      id: 'pro',
      name: 'Professionnel',
      description: 'Pour thérapeutes et professionnels de santé',
      price_monthly: 49.99,
      price_yearly: 499.99,
      badge: 'Thérapeutes',
      icon: Brain,
      color: 'text-purple-600',
      features: [
        'Tout Premium inclus',
        'Dashboard multi-patients',
        'Rapports cliniques détaillés',
        'Protocoles thérapeutiques avancés',
        'White-label disponible',
        'API et intégrations',
        'Support dédié',
        'Formation certifiée incluse'
      ],
      limitations: []
    }
  ];

  useEffect(() => {
    // Use default plans for now
    setPlans(defaultPlans);
    setLoading(false);
  }, []);

  const enterpriseFeatures = [
    'Déploiement sur site ou cloud privé',
    'Personnalisation complète de l\'interface',
    'Intégration SIRH/ERP existant',
    'Analytics RH avancés',
    'Support 24/7 dédié',
    'Formation équipe complète',
    'Conformité sectorielle (finance, santé...)',
    'SLA garanti 99.9%'
  ];

  const getPrice = (plan) => {
    if (plan.price_monthly === 0) return 'Gratuit';
    const price = isYearly ? plan.price_yearly : plan.price_monthly;
    const period = isYearly ? '/an' : '/mois';
    return `${price}€${period}`;
  };

  const getSavings = (plan) => {
    if (plan.price_monthly === 0) return null;
    const yearlyCost = plan.price_yearly;
    const monthlyCost = plan.price_monthly * 12;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  const handleSubscribe = (planId) => {
    if (planId === 'free') {
      alert('Plan gratuit activé !');
    } else {
      alert(`Redirection vers le paiement pour le plan ${planId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">EmotionsCare</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-gray-900">Accueil</a>
              <a href="/pricing" className="text-blue-600 font-medium">Tarifs</a>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Choisissez votre plan</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Démarrez gratuitement et évoluez selon vos besoins. 
              Toutes les données restent privées et sécurisées.
            </p>
            
            {/* Toggle annuel/mensuel */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm ${!isYearly ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                Mensuel
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span className={`text-sm ${isYearly ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                Annuel
              </span>
              {isYearly && (
                <Badge variant="secondary" className="ml-2">-17% économie</Badge>
              )}
            </div>
          </div>

          {/* Plans principaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              const savings = getSavings(plan);
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative ${
                    plan.badge === 'Populaire' 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : ''
                  }`}
                >
                  {plan.badge && (
                    <Badge 
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                      variant={plan.badge === 'Populaire' ? 'default' : 'secondary'}
                    >
                      {plan.badge}
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gray-50 border mx-auto mb-4 flex items-center justify-center`}>
                      <PlanIcon className={`h-6 w-6 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    
                    <div className="pt-4">
                      <div className="text-4xl font-bold text-gray-900">{getPrice(plan)}</div>
                      {savings && isYearly && (
                        <p className="text-sm text-green-600 font-medium">
                          Économisez {savings.amount}€ ({savings.percentage}%)
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full"
                      variant={plan.badge === 'Populaire' ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {plan.price_monthly === 0 ? 'Commencer gratuitement' : 'Choisir ce plan'}
                    </Button>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-gray-900">Inclus :</h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {plan.limitations.length > 0 && (
                        <div className="pt-3 border-t">
                          <h4 className="font-medium text-sm mb-2 text-gray-500">Limitations :</h4>
                          <ul className="space-y-1">
                            {plan.limitations.map((limitation, index) => (
                              <li key={index} className="text-sm text-gray-500">
                                • {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Plan Entreprise */}
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Entreprise</CardTitle>
                  <CardDescription>Solution personnalisée pour organisations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Fonctionnalités avancées :</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {enterpriseFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold mb-2">Sur devis</div>
                    <p className="text-gray-600 text-sm">
                      Tarification adaptée selon vos besoins et votre effectif
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      Demander un devis
                    </Button>
                    <Button variant="outline" className="w-full">
                      Programmer une démo
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Headphones className="h-4 w-4" />
                    <span>Accompagnement dédié inclus</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ/Garanties */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="text-center space-y-3">
              <Shield className="h-8 w-8 text-blue-600 mx-auto" />
              <h3 className="font-semibold">30 jours satisfait ou remboursé</h3>
              <p className="text-sm text-gray-600">
                Testez sans risque pendant un mois complet
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto" />
              <h3 className="font-semibold">Activation immédiate</h3>
              <p className="text-sm text-gray-600">
                Accès instantané à toutes vos fonctionnalités
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <Users className="h-8 w-8 text-green-600 mx-auto" />
              <h3 className="font-semibold">Support expert</h3>
              <p className="text-sm text-gray-600">
                Équipe spécialisée en bien-être numérique
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}