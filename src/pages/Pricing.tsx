
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Tarifs</h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Découvrez nos formules adaptées à vos besoins pour un bien-être émotionnel optimal en entreprise.
      </p>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Offre Essentielle */}
        <div className="card-premium p-6 flex flex-col border-2 border-primary/10">
          <h2 className="text-2xl font-bold mb-2">Essentielle</h2>
          <div className="text-3xl font-bold mb-1">29€</div>
          <div className="text-sm text-muted-foreground mb-6">par utilisateur / mois</div>
          
          <ul className="space-y-3 mb-8 flex-1">
            {["Analyse émotionnelle basique", "Social Cocoon", "Dashboard personnel", "Journal émotionnel"].map(feature => (
              <li key={feature} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button className="w-full">S'abonner</Button>
        </div>
        
        {/* Offre Business */}
        <div className="card-premium p-6 flex flex-col relative border-2 border-primary">
          <div className="absolute -top-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-full left-1/2 -translate-x-1/2">
            Recommandé
          </div>
          <h2 className="text-2xl font-bold mb-2">Business</h2>
          <div className="text-3xl font-bold mb-1">59€</div>
          <div className="text-sm text-muted-foreground mb-6">par utilisateur / mois</div>
          
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Tout dans Essentielle",
              "Coach IA personnalisé",
              "Analyse émotionnelle avancée",
              "Rapport et tendances",
              "Gamification complète"
            ].map(feature => (
              <li key={feature} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="default" className="w-full">S'abonner</Button>
        </div>
        
        {/* Offre Entreprise */}
        <div className="card-premium p-6 flex flex-col border-2 border-primary/10">
          <h2 className="text-2xl font-bold mb-2">Entreprise</h2>
          <div className="text-3xl font-bold mb-1">Sur mesure</div>
          <div className="text-sm text-muted-foreground mb-6">contactez-nous</div>
          
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Tout dans Business",
              "Intégration complète RH",
              "API personnalisée",
              "Support dédié 24/7",
              "Analyses prédictives",
              "VR Sessions illimitées"
            ].map(feature => (
              <li key={feature} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button variant="outline" className="w-full">Contacter les ventes</Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
