
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  Type, 
  Palette, 
  Volume2,
  Contrast,
  ZoomIn,
  Move,
  Heart,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const AccessibilityPage: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [voiceControl, setVoiceControl] = useState(false);
  const [textSize, setTextSize] = useState([16]);
  const [soundVolume, setSoundVolume] = useState([80]);

  const accessibilityFeatures = [
    {
      category: 'Vision',
      icon: <Eye className="h-6 w-6" />,
      features: [
        {
          id: 'high-contrast',
          title: 'Contraste Élevé',
          description: 'Améliore la lisibilité avec des couleurs contrastées',
          enabled: highContrast,
          onToggle: setHighContrast,
          type: 'toggle'
        },
        {
          id: 'large-text',
          title: 'Texte Agrandi',
          description: 'Augmente la taille du texte pour une meilleure lecture',
          enabled: largeText,
          onToggle: setLargeText,
          type: 'toggle'
        },
        {
          id: 'text-size',
          title: 'Taille du Texte',
          description: 'Ajustez la taille du texte selon vos préférences',
          value: textSize,
          onValueChange: setTextSize,
          type: 'slider',
          min: 12,
          max: 24,
          unit: 'px'
        }
      ]
    },
    {
      category: 'Audition',
      icon: <Ear className="h-6 w-6" />,
      features: [
        {
          id: 'screen-reader',
          title: 'Lecteur d\'Écran',
          description: 'Compatible avec les lecteurs d\'écran NVDA, JAWS, VoiceOver',
          enabled: screenReader,
          onToggle: setScreenReader,
          type: 'toggle'
        },
        {
          id: 'sound-volume',
          title: 'Volume des Sons',
          description: 'Contrôlez le volume des notifications et sons',
          value: soundVolume,
          onValueChange: setSoundVolume,
          type: 'slider',
          min: 0,
          max: 100,
          unit: '%'
        }
      ]
    },
    {
      category: 'Motricité',
      icon: <MousePointer className="h-6 w-6" />,
      features: [
        {
          id: 'reduced-motion',
          title: 'Mouvement Réduit',
          description: 'Réduit les animations pour éviter les vertiges',
          enabled: reducedMotion,
          onToggle: setReducedMotion,
          type: 'toggle'
        },
        {
          id: 'voice-control',
          title: 'Contrôle Vocal',
          description: 'Naviguez dans l\'application avec votre voix',
          enabled: voiceControl,
          onToggle: setVoiceControl,
          type: 'toggle'
        }
      ]
    }
  ];

  const keyboardShortcuts = [
    { keys: 'Ctrl + K', action: 'Ouvrir la recherche' },
    { keys: 'Ctrl + /', action: 'Afficher les raccourcis' },
    { keys: 'Tab', action: 'Navigation entre éléments' },
    { keys: 'Enter', action: 'Activer l\'élément sélectionné' },
    { keys: 'Esc', action: 'Fermer les modales' },
    { keys: 'Ctrl + H', action: 'Retour à l\'accueil' }
  ];

  const wcagCompliance = [
    { level: 'A', description: 'Niveau de base', status: 'complete' },
    { level: 'AA', description: 'Niveau standard', status: 'complete' },
    { level: 'AAA', description: 'Niveau avancé', status: 'partial' }
  ];

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    toast.success(`${enabled ? 'Activé' : 'Désactivé'}: ${featureId}`);
  };

  return (
    <div data-testid="page-root" className={`min-h-screen transition-colors duration-300 ${
      highContrast 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`p-3 rounded-full ${
              highContrast ? 'bg-white text-black' : 'bg-blue-100'
            }`}>
              <Heart className={`h-8 w-8 ${highContrast ? 'text-black' : 'text-blue-600'}`} />
            </div>
            <h1 className={`text-4xl font-bold ${
              highContrast 
                ? 'text-white' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
            } ${largeText ? 'text-5xl' : ''}`}
            style={{ fontSize: largeText ? '3rem' : undefined }}
            >
              Accessibilité
            </h1>
          </div>
          <p className={`text-lg max-w-2xl mx-auto ${
            highContrast ? 'text-gray-300' : 'text-gray-600'
          } ${largeText ? 'text-xl' : ''}`}
          style={{ fontSize: largeText ? `${textSize[0] + 4}px` : `${textSize[0]}px` }}
          >
            Personnalisez l'interface pour une expérience adaptée à vos besoins spécifiques.
            EmotionsCare est conçu pour être accessible à tous.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Accessibility Features */}
          <div className="lg:col-span-2 space-y-6">
            {accessibilityFeatures.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className={`shadow-lg border-0 ${
                  highContrast 
                    ? 'bg-gray-900 border-white border-2' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardHeader className={highContrast ? 'border-b border-white' : ''}>
                    <CardTitle className={`flex items-center gap-3 ${
                      highContrast ? 'text-white' : 'text-gray-800'
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        highContrast ? 'bg-white text-black' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {category.icon}
                      </div>
                      <span style={{ fontSize: largeText ? `${textSize[0] + 4}px` : `${textSize[0] + 2}px` }}>
                        {category.category}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {category.features.map((feature) => (
                      <div key={feature.id} className={`p-4 rounded-lg border ${
                        highContrast ? 'border-white bg-gray-800' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-medium ${
                            highContrast ? 'text-white' : 'text-gray-800'
                          }`}
                          style={{ fontSize: largeText ? `${textSize[0] + 2}px` : `${textSize[0]}px` }}
                          >
                            {feature.title}
                          </h3>
                          {feature.type === 'toggle' && (
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={(checked) => {
                                feature.onToggle(checked);
                                handleFeatureToggle(feature.title, checked);
                              }}
                            />
                          )}
                        </div>
                        <p className={`text-sm mb-4 ${
                          highContrast ? 'text-gray-300' : 'text-gray-600'
                        }`}
                        style={{ fontSize: largeText ? `${textSize[0]}px` : `${textSize[0] - 2}px` }}
                        >
                          {feature.description}
                        </p>
                        
                        {feature.type === 'slider' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                highContrast ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {feature.min}{feature.unit}
                              </span>
                              <span className={`text-sm font-medium ${
                                highContrast ? 'text-white' : 'text-gray-800'
                              }`}>
                                {feature.value[0]}{feature.unit}
                              </span>
                              <span className={`text-sm ${
                                highContrast ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {feature.max}{feature.unit}
                              </span>
                            </div>
                            <Slider
                              value={feature.value}
                              onValueChange={feature.onValueChange}
                              min={feature.min}
                              max={feature.max}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Keyboard Shortcuts */}
            <Card className={`shadow-lg border-0 ${
              highContrast 
                ? 'bg-gray-900 border-white border-2' 
                : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  highContrast ? 'text-white' : 'text-gray-800'
                }`}>
                  <Keyboard className="h-5 w-5" />
                  <span style={{ fontSize: largeText ? `${textSize[0] + 4}px` : `${textSize[0] + 2}px` }}>
                    Raccourcis Clavier
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      highContrast ? 'bg-gray-800 border border-white' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <span className={`text-sm ${
                        highContrast ? 'text-gray-300' : 'text-gray-600'
                      }`}
                      style={{ fontSize: largeText ? `${textSize[0]}px` : `${textSize[0] - 2}px` }}
                      >
                        {shortcut.action}
                      </span>
                      <Badge variant={highContrast ? "outline" : "secondary"} className={
                        highContrast ? 'border-white text-white' : ''
                      }>
                        {shortcut.keys}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* WCAG Compliance */}
            <Card className={`shadow-lg border-0 ${
              highContrast 
                ? 'bg-gray-900 border-white border-2' 
                : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${
                  highContrast ? 'text-white' : 'text-gray-800'
                }`}
                style={{ fontSize: largeText ? `${textSize[0] + 2}px` : `${textSize[0]}px` }}
                >
                  Conformité WCAG
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {wcagCompliance.map((item) => (
                  <div key={item.level} className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        highContrast ? 'text-white' : 'text-gray-800'
                      }`}
                      style={{ fontSize: largeText ? `${textSize[0]}px` : `${textSize[0] - 2}px` }}
                      >
                        Niveau {item.level}
                      </h4>
                      <p className={`text-xs ${
                        highContrast ? 'text-gray-300' : 'text-gray-600'
                      }`}
                      style={{ fontSize: largeText ? `${textSize[0] - 2}px` : `${textSize[0] - 4}px` }}
                      >
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 ${
                        item.status === 'complete' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                      <Badge variant={item.status === 'complete' ? 'default' : 'secondary'}>
                        {item.status === 'complete' ? 'Conforme' : 'Partiel'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Settings */}
            <Card className={`shadow-lg border-0 ${
              highContrast 
                ? 'bg-gray-900 border-white border-2' 
                : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${
                  highContrast ? 'text-white' : 'text-gray-800'
                }`}
                style={{ fontSize: largeText ? `${textSize[0] + 2}px` : `${textSize[0]}px` }}
                >
                  Paramètres Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant={highContrast ? "outline" : "default"} 
                  className={`w-full justify-start ${
                    highContrast ? 'border-white text-white hover:bg-white hover:text-black' : ''
                  }`}
                  onClick={() => setHighContrast(!highContrast)}
                >
                  <Contrast className="h-4 w-4 mr-2" />
                  {highContrast ? 'Désactiver' : 'Activer'} le contraste élevé
                </Button>
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    highContrast ? 'border-white text-white hover:bg-white hover:text-black' : ''
                  }`}
                  onClick={() => setLargeText(!largeText)}
                >
                  <Type className="h-4 w-4 mr-2" />
                  {largeText ? 'Réduire' : 'Agrandir'} le texte
                </Button>
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    highContrast ? 'border-white text-white hover:bg-white hover:text-black' : ''
                  }`}
                  onClick={() => setReducedMotion(!reducedMotion)}
                >
                  <Move className="h-4 w-4 mr-2" />
                  {reducedMotion ? 'Activer' : 'Réduire'} les animations
                </Button>
              </CardContent>
            </Card>

            {/* Accessibility Tips */}
            <Card className={`shadow-lg border-0 ${
              highContrast 
                ? 'bg-gray-900 border-white border-2' 
                : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${
                  highContrast ? 'text-white' : 'text-gray-800'
                }`}>
                  Conseils d'Accessibilité
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-3 text-sm ${
                highContrast ? 'text-gray-300' : 'text-gray-600'
              }`}
              style={{ fontSize: largeText ? `${textSize[0]}px` : `${textSize[0] - 2}px` }}
              >
                <p>• Utilisez Tab pour naviguer entre les éléments</p>
                <p>• Activez le lecteur d'écran pour l'audio</p>
                <p>• Ajustez la taille du texte à votre convenance</p>
                <p>• Réduisez les animations si elles vous dérangent</p>
                <p>• Contactez-nous pour des besoins spécifiques</p>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className={`shadow-lg border-0 ${
              highContrast 
                ? 'bg-gray-900 border-white border-2' 
                : 'bg-white/80 backdrop-blur-sm'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${
                  highContrast ? 'text-white' : 'text-gray-800'
                }`}>
                  Support Accessibilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-4 ${
                  highContrast ? 'text-gray-300' : 'text-gray-600'
                }`}
                style={{ fontSize: largeText ? `${textSize[0]}px` : `${textSize[0] - 2}px` }}
                >
                  Besoin d'aide pour configurer l'accessibilité ? Notre équipe spécialisée est là pour vous.
                </p>
                <Button 
                  variant={highContrast ? "outline" : "default"} 
                  className={`w-full ${
                    highContrast ? 'border-white text-white hover:bg-white hover:text-black' : ''
                  }`}
                >
                  Contacter le Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;
