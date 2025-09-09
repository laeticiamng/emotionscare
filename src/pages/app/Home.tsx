import React, { useState, useEffect } from 'react';
import { DayPlanCard } from '@/types/modules';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wind, 
  Scan, 
  Music, 
  Sparkles, 
  PenTool,
  Zap,
  MessageCircle,
  Palette,
  Volume2,
  Eye,
  Gamepad2,
  Target,
  Users,
  Waves,
  BookOpen,
  BarChart3,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRewards } from '@/hooks/useRewards';
import { UniversePortal } from '@/components/universe/UniversePortal';
import { UniverseAmbiance } from '@/components/universe/UniverseAmbiance';
import { UNIVERSES } from '@/types/universes';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<DayPlanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const [universeReady, setUniverseReady] = useState(false);
  const { dailyCard, generateDailyCard, getActiveAura } = useRewards();
  
  const homeUniverse = UNIVERSES.home;

  useEffect(() => {
    loadDayPlan();
    generateDailyCard();
    // Start universe entrance
    setTimeout(() => setIsEntering(true), 100);
  }, [generateDailyCard]);

  const loadDayPlan = async () => {
    try {
      // Default cards without external service dependency
      const defaultCards: DayPlanCard[] = [
        {
          id: 'breath',
          title: 'Respirer 60 s',
          subtitle: 'On y va tranquille',
          duration: '1 min',
          route: '/app/breath',
          priority: 1,
          icon: 'Wind'
        },
        {
          id: 'scan',
          title: 'Scanner',
          subtitle: 'Miroir du moment',
          duration: '30 s',
          route: '/app/scan',
          priority: 2,
          icon: 'Scan'
        },
        {
          id: 'flash-glow',
          title: 'Flash 2 min',
          subtitle: 'Désamorcer en douceur',
          duration: '2 min',
          route: '/app/flash-glow',
          priority: 3,
          icon: 'Zap'
        }
      ];

      // Take only top 3 cards
      setCards(defaultCards.slice(0, 3));
    } catch (error) {
      console.error('Error loading day plan:', error);
      // Fallback to breath card
      setCards([{
        id: 'breath',
        title: 'Respirer 60 s',
        subtitle: 'Une minute pour toi',
        duration: '1 min',
        route: '/app/breath',
        priority: 1,
        icon: 'Wind'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons = {
      Wind,
      Scan,
      Music,
      Sparkles,
      PenTool,
      Zap,
      MessageCircle,
      Palette,
      Volume2,
      Eye,
      Gamepad2,
      Target,
      Users,
      Waves,
      BookOpen,
      BarChart3,
      Settings
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Wind;
    return <IconComponent className="w-6 h-6" />;
  };

  // Tous les 15 modules disponibles
  const allModules = [
    { id: 'breath', title: 'Respiration', subtitle: 'La Salle des Souffles', route: '/app/breath', icon: 'Wind', category: 'Bien-être' },
    { id: 'scan', title: 'Scan émotionnel', subtitle: 'L\'Atelier des Reflets', route: '/app/scan', icon: 'Scan', category: 'Bien-être' },
    { id: 'flash-glow', title: 'Flash Glow', subtitle: 'Le Dôme d\'Étincelles', route: '/app/flash-glow', icon: 'Zap', category: 'Bien-être' },
    { id: 'music', title: 'Musique', subtitle: 'Le Studio des Ondes', route: '/app/music', icon: 'Music', category: 'Bien-être' },
    { id: 'journal', title: 'Journal', subtitle: 'Le Jardin des Mots', route: '/app/journal', icon: 'PenTool', category: 'Expression' },
    { id: 'mood-mixer', title: 'Mood Mixer', subtitle: 'Console des Humeurs', route: '/app/mood-mixer', icon: 'Palette', category: 'Expression' },
    { id: 'coach', title: 'Coach IA', subtitle: 'Le Salon du Mentor', route: '/app/coach', icon: 'MessageCircle', category: 'Guidance' },
    { id: 'boss-grit', title: 'Boss Grit', subtitle: 'La Forge Intérieure', route: '/app/boss-grit', icon: 'Target', category: 'Guidance' },
    { id: 'ambition-arcade', title: 'Ambition Arcade', subtitle: 'Salle des Quêtes', route: '/app/ambition-arcade', icon: 'Gamepad2', category: 'Guidance' },
    { id: 'bubble-beat', title: 'Bubble Beat', subtitle: 'L\'Océan des Bulles', route: '/app/bubble-beat', icon: 'Waves', category: 'Mouvement' },
    { id: 'screen-silk', title: 'Screen Silk', subtitle: 'Le Voile de Soie', route: '/app/screen-silk', icon: 'Eye', category: 'Repos' },
    { id: 'story-synth', title: 'Story Synth', subtitle: 'Bibliothèque Vivante', route: '/app/story-synth', icon: 'BookOpen', category: 'Repos' },
    { id: 'vr-galaxy', title: 'VR Galaxy', subtitle: 'La Voûte Cosmique', route: '/app/vr-galaxy', icon: 'Sparkles', category: 'Immersion' },
    { id: 'social-cocon', title: 'Social B2C', subtitle: 'La Place des Âmes', route: '/app/social-cocon', icon: 'Users', category: 'Partage' },
    { id: 'activity', title: 'Mon Jardin', subtitle: 'Activité & Weekly', route: '/app/activity', icon: 'BarChart3', category: 'Suivi' },
  ];

  const activeAura = getActiveAura();

  if (loading || !universeReady) {
    return (
      <UniversePortal
        universe={homeUniverse}
        isEntering={isEntering}
        onEnterComplete={() => {
          setUniverseReady(true);
        }}
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Préparation du jour...</p>
          </div>
        </div>
      </UniversePortal>
    );
  }

  return (
    <div className="min-h-screen relative overflow-y-auto">
      <UniverseAmbiance 
        universe={homeUniverse} 
        intensity={0.7}
        interactive
      />
      
      <div className="relative z-10 p-6">
      <div className="max-w-md mx-auto space-y-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-foreground mb-2">
            Plan du jour
          </h1>
          <p className="text-muted-foreground">
            3 minutes pour se sentir mieux
          </p>
        </div>

        {/* Daily Card */}
        {dailyCard && (
          <Card className="border-primary/20 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Carte mystère</span>
              </div>
              <p className="text-foreground">{dailyCard}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Cards */}
        <div className="space-y-4">
          {cards.map((card, index) => (
            <Card 
              key={card.id}
              className="hover:shadow-elegant transition-all duration-500 cursor-pointer group bg-card/95 backdrop-blur-md border border-white/20 hover-scale"
              onClick={() => navigate(card.route)}
              style={{
                background: `linear-gradient(135deg, ${homeUniverse.ambiance.colors.secondary}90, ${homeUniverse.ambiance.colors.accent}20)`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${homeUniverse.ambiance.colors.primary}, ${homeUniverse.ambiance.colors.accent})`,
                      boxShadow: `0 4px 20px ${homeUniverse.ambiance.colors.primary}40`
                    }}
                  >
                    {getIcon(card.icon || 'Wind')}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {card.duration}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tous les modules - Grille avec 15 modules */}
        <div className="pt-8">
          <h2 className="text-lg font-medium text-foreground mb-4 text-center">
            Tous les univers
          </h2>
          
          <div className="grid grid-cols-2 gap-3 min-h-fit">
            {allModules.map((module, index) => (
              <Card 
                key={module.id}
                className="hover:shadow-elegant transition-all duration-300 cursor-pointer group bg-card/90 backdrop-blur-sm border border-white/10 hover-scale min-h-[120px] flex"
                onClick={() => navigate(module.route)}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <CardContent className="p-3 flex-1 flex flex-col justify-center">
                  <div className="text-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-all duration-300 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${homeUniverse.ambiance.colors.primary}90, ${homeUniverse.ambiance.colors.accent}60)`,
                        boxShadow: `0 2px 12px ${homeUniverse.ambiance.colors.primary}30`
                      }}
                    >
                      {getIcon(module.icon)}
                    </div>
                    
                    <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-1">
                      {module.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-tight line-clamp-2 mb-2">
                      {module.subtitle}
                    </p>
                    
                    <Badge variant="outline" className="text-xs opacity-70">
                      {module.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Indicateur du nombre total avec confirmation des 15 modules */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              ✅ {allModules.length} univers disponibles
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;