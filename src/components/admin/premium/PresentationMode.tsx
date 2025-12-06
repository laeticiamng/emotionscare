import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PresentationProps {
  onExit: () => void;
  data: {
    emotionalTrend: Array<{ date: string; value: number }>;
    teamMetrics: {
      engagementScore: number;
      participationRate: number;
      wellbeingIndex: number;
    };
  };
}

const PresentationMode: React.FC<PresentationProps> = ({ onExit, data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionClass, setTransitionClass] = useState('opacity-100 translate-x-0');
  
  const slides = [
    { id: 'intro', title: 'Vision Émotionnelle Collective', type: 'title' },
    { id: 'trends', title: 'Tendances Émotionnelles', type: 'chart' },
    { id: 'metrics', title: 'Indicateurs Clés', type: 'metrics' },
    { id: 'insights', title: 'Insights & Recommandations', type: 'insights' },
    { id: 'conclusion', title: 'Prochaines Étapes', type: 'conclusion' },
  ];
  
  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setTransitionClass('opacity-0 translate-x-8');
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setTransitionClass('opacity-100 translate-x-0');
      }, 300);
    }
  };
  
  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setTransitionClass('opacity-0 -translate-x-8');
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setTransitionClass('opacity-100 translate-x-0');
      }, 300);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, onExit]);
  
  const renderSlideContent = () => {
    const currentSlideData = slides[currentSlide];
    
    switch (currentSlideData.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl font-bold mb-8 text-primary">
              EmotionsCare
            </h1>
            <h2 className="text-3xl mb-6">Vision Émotionnelle Collective</h2>
            <p className="text-xl text-muted-foreground mb-12">Mai - Juin 2023</p>
            <div className="max-w-xl text-center">
              <p className="text-lg italic">
                "La compréhension des émotions collectives est la clé d'une culture organisationnelle épanouie"
              </p>
            </div>
          </div>
        );
        
      case 'chart':
        return (
          <div className="flex flex-col h-full">
            <h2 className="text-3xl mb-6">Tendances Émotionnelles</h2>
            <div className="flex-1 w-full max-w-4xl mx-auto">
              <ResponsiveContainer width="100%" height="80%">
                <LineChart
                  data={data.emotionalTrend}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Indice de bien-être"
                    stroke="#8884d8" 
                    strokeWidth={3} 
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-6 text-center">
                <p className="text-lg">
                  <span className="font-bold text-green-500">+12%</span> d'amélioration sur la période analysée
                </p>
                <p className="text-muted-foreground">
                  L'indice émotionnel collectif montre une progression constante
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'metrics':
        return (
          <div className="flex flex-col h-full">
            <h2 className="text-3xl mb-8">Indicateurs Clés</h2>
            <div className="grid grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">
                  {data.teamMetrics.engagementScore}%
                </div>
                <p className="text-xl">Engagement</p>
                <p className="text-muted-foreground">+4% vs trimestre précédent</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-500 mb-4">
                  {data.teamMetrics.participationRate}%
                </div>
                <p className="text-xl">Participation</p>
                <p className="text-muted-foreground">+12% vs trimestre précédent</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-green-500 mb-4">
                  {data.teamMetrics.wellbeingIndex}%
                </div>
                <p className="text-xl">Bien-être</p>
                <p className="text-muted-foreground">+7% vs trimestre précédent</p>
              </div>
            </div>
            
            <div className="mt-12 max-w-2xl mx-auto text-center">
              <p className="text-xl">
                Les 3 piliers de notre climat émotionnel montrent une progression constante.
              </p>
            </div>
          </div>
        );
        
      case 'insights':
        return (
          <div className="flex flex-col h-full">
            <h2 className="text-3xl mb-8">Insights & Recommandations</h2>
            
            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="text-xl font-medium mb-2">Ce qui fonctionne</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-green-800 dark:text-green-300">1</span>
                    </div>
                    <span>Les pratiques de respiration guidée (+24% d'adoption)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-green-800 dark:text-green-300">2</span>
                    </div>
                    <span>L'accompagnement musical adapté (82% de satisfaction)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-green-800 dark:text-green-300">3</span>
                    </div>
                    <span>Les check-ins émotionnels quotidiens (68% d'engagement)</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium mb-2">Recommandations</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-blue-800 dark:text-blue-300">1</span>
                    </div>
                    <span>Étendre l'accès aux modules de méditation guidée</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-blue-800 dark:text-blue-300">2</span>
                    </div>
                    <span>Intégrer le journal émotionnel aux rituels d'équipe</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-blue-800 dark:text-blue-300">3</span>
                    </div>
                    <span>Enrichir les playlists musicales thérapeutiques</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 max-w-2xl mx-auto">
              <p className="text-lg text-center italic">
                "L'amélioration continue du bien-être émotionnel passe par l'écoute active et l'adaptation régulière des outils d'accompagnement."
              </p>
            </div>
          </div>
        );
        
      case 'conclusion':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl mb-10">Prochaines Étapes</h2>
            
            <div className="max-w-2xl space-y-6 mb-10">
              <div className="p-4 border rounded-lg bg-background/50">
                <h3 className="font-medium text-xl mb-2">Plan d'action - T3 2023</h3>
                <ol className="space-y-3 ml-6 list-decimal">
                  <li>Déploiement du module "Cartographie émotionnelle 3D"</li>
                  <li>Formation des managers aux pratiques d'écoute émotionnelle</li>
                  <li>Introduction de rituels de déconnexion et reconnexion</li>
                  <li>Amélioration des modules musicaux basés sur le feedback</li>
                </ol>
              </div>
            </div>
            
            <Button
              variant="outline" 
              className="mt-8 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger la présentation</span>
            </Button>
            
            <p className="mt-10 text-2xl font-light text-muted-foreground">
              Merci de votre attention
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onExit}
          aria-label="Fermer la présentation"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex h-full items-center justify-center p-8">
        <div 
          className={`w-full h-full flex flex-col transition-all duration-300 ease-in-out ${transitionClass}`}
        >
          {renderSlideContent()}
        </div>
      </div>
      
      <div className="absolute bottom-4 inset-x-0 flex justify-center items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handlePrevSlide}
          disabled={currentSlide === 0}
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleNextSlide}
          disabled={currentSlide === slides.length - 1}
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PresentationMode;
