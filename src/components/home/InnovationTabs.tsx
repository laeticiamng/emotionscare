
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Music, Calendar, Users, TrendingUp } from 'lucide-react';

interface Innovation {
  id: string;
  title: string;
  module: string;
  description: string;
  features: string[];
  apiIntegrations: string[];
  icon: React.ReactNode;
  addictiveValue: string;
}

const innovations: Innovation[] = [
  {
    id: "adaptive-workspace",
    title: "Ambiance Adaptive Workspace",
    module: "Micro-pauses VR → Extension \"Workspace Mode\"",
    description: "Contrôle automatique de l'éclairage de votre espace de travail selon votre état émotionnel",
    features: [
      "Analyse continue de l'émotion et du niveau de concentration",
      "Pilotage dynamique de l'éclairage de bureau",
      "Passage automatique entre mode \"focus\" et \"relaxation\""
    ],
    apiIntegrations: ["OpenAI (analyse émotionnelle)", "Philips Hue / LIFX API (éclairage connecté)"],
    icon: <Lightbulb className="h-10 w-10 text-primary" />,
    addictiveValue: "Votre environnement physique devient un prolongement de la plateforme, renforçant votre état d'esprit sans effort conscient"
  },
  {
    id: "emotional-story",
    title: "Storytelling Émotionnel Automatique",
    module: "Journal guidé → \"My Emotional Story\"",
    description: "Création automatisée d'une narration visuelle de votre parcours émotionnel",
    features: [
      "Génération hebdomadaire de capsules multimédias (texte + images IA)",
      "Retraçage de votre parcours émotionnel personnalisé",
      "Partage optionnel dans votre Social Cocoon"
    ],
    apiIntegrations: ["OpenAI (texte + image via DALL·E)", "Supabase (stockage)"],
    icon: <Users className="h-10 w-10 text-primary" />,
    addictiveValue: "Création d'une récurrence émotionnelle (comme Instagram Stories) centrée sur votre bien-être"
  },
  {
    id: "smart-scheduler",
    title: "Assistant de Productivité Émotionnelle",
    module: "Scan émotionnel → \"Smart Scheduler\"",
    description: "Réorganisation intelligente de vos tâches selon votre état émotionnel",
    features: [
      "Réordonnancement automatique des réunions et tâches",
      "Adaptation selon votre énergie et niveau de stress",
      "Proposition de déplacement ou fusion de créneaux"
    ],
    apiIntegrations: ["Google Calendar API / Outlook API", "OpenAI (priorisation)"],
    icon: <Calendar className="h-10 w-10 text-primary" />,
    addictiveValue: "Vous bénéficiez d'une assistante personnelle qui gère votre journée pour optimiser sérénité et performance"
  },
  {
    id: "collective-jam",
    title: "Univers sonore collaboratif",
    module: "Musicothérapie → \"Collective Jam\"",
    description: "Création musicale collaborative en temps réel",
    features: [
      "Jam session musicale collaborative en temps réel",
      "Synchronisation automatique des pistes générées par IA",
      "Publication et partage des créations d'équipe"
    ],
    apiIntegrations: ["TopMediai", "WebRTC (streaming peer-to-peer)"],
    icon: <Music className="h-10 w-10 text-primary" />,
    addictiveValue: "Création d'un rituel de groupe unique qui renforce la cohésion d'équipe et l'attachement à la plateforme"
  },
  {
    id: "roi-wellbeing",
    title: "Analyse ROI Bien-Être",
    module: "Dashboard RH → \"Well-Being ROI\"",
    description: "Visualisation en temps réel de l'impact financier du bien-être au travail",
    features: [
      "Calcul en temps réel de l'impact financier sur le turnover et l'absentéisme",
      "Mesure de l'augmentation de productivité liée aux interventions",
      "KPIs clairs (% réduction coûts, % gain productivité)"
    ],
    apiIntegrations: ["PowerBI Embedded / Tableau Embedded", "Supabase"],
    icon: <TrendingUp className="h-10 w-10 text-primary" />,
    addictiveValue: "Les décideurs RH voient leur budget \"bien-être\" comme un investissement prouvé, renforçant la valeur perçue de la plateforme"
  }
];

const InnovationTabs: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 heading-elegant">Innovations Émotionnelles</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Découvrez nos innovations visionnaires pour transformer l'expérience du bien-être au travail
        </p>
      </div>
      
      <Tabs defaultValue={innovations[0].id} className="w-full">
        <TabsList className="flex flex-nowrap overflow-x-auto hide-scrollbar p-1 bg-muted/40 mb-6 rounded-xl">
          {innovations.map(innovation => (
            <TabsTrigger 
              key={innovation.id} 
              value={innovation.id}
              className="flex-shrink-0 whitespace-nowrap px-4 py-2"
            >
              {innovation.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {innovations.map(innovation => (
          <TabsContent key={innovation.id} value={innovation.id} className="space-y-4">
            <Card className="border-t-4" style={{ borderTopColor: 'var(--primary)' }}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {innovation.icon}
                  <div>
                    <CardTitle className="text-2xl">{innovation.title}</CardTitle>
                    <CardDescription className="text-md mt-1">{innovation.module}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-lg leading-relaxed">{innovation.description}</p>
                </div>
                
                <div className={expanded[innovation.id] ? "" : "hidden md:block"}>
                  <h3 className="text-lg font-medium mb-2">Fonctionnalités</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {innovation.features.map((feature, idx) => (
                      <li key={idx} className="text-muted-foreground">{feature}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-4 mb-2">Intégrations</h3>
                  <div className="flex flex-wrap gap-2">
                    {innovation.apiIntegrations.map((api, idx) => (
                      <span key={idx} className="bg-muted px-2 py-1 rounded-md text-sm">
                        {api}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium mt-4 mb-2">Plus-value</h3>
                  <p className="text-muted-foreground italic">
                    {innovation.addictiveValue}
                  </p>
                </div>
                
                <button 
                  className="text-primary flex items-center gap-1 md:hidden"
                  onClick={() => toggleExpand(innovation.id)}
                >
                  {expanded[innovation.id] ? 'Voir moins' : 'Voir plus'}
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default InnovationTabs;
