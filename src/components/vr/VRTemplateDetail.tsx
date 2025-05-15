
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock3, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VRSessionTemplate } from '@/types';
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStartSession?: () => void;
  showBackButton?: boolean;
  heartRate?: number;
  onBack?: () => void;
}

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({
  template,
  onStartSession,
  showBackButton = true,
  heartRate,
  onBack
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const recommendations = [] // For now, use empty array instead of missing hook

  const handleStartSession = () => {
    if (onStartSession) {
      onStartSession();
    } else {
      navigate(`/vr/session/${template.id}`);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} heure${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  };
  
  const getEmotionColor = (emotion?: string) => {
    switch (emotion?.toLowerCase()) {
      case 'calme':
      case 'sérénité':
      case 'relaxation':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'joie':
      case 'bonheur':
      case 'optimisme':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'concentration':
      case 'focus':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'énergie':
      case 'dynamisme':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };
  
  // Generate a list of template benefits if none are provided
  const templateBenefits = template.benefits || [
    "Réduit le stress",
    "Améliore le bien-être mental",
    "Favorise la concentration",
    "Renforce la résilience émotionnelle"
  ];

  // Use camelCase properties or fallback to snake_case for backward compatibility
  const completionRate = template.completionRate || template.completion_rate;
  const recommendedMood = template.recommendedMood || template.recommended_mood;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button */}
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 flex items-center"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      )}

      {/* Cover image */}
      <div className="mb-6">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
          <img
            src={template.preview_url || "/images/vr-banner-bg.jpg"}
            alt={template.title}
            className="object-cover w-full h-full"
          />
          
          {/* Completion overlay */}
          {completionRate ? (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary/80 text-primary-foreground px-3 py-1 rounded-md text-xs font-medium">
              <div className="w-28">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progression</span>
                  <span>{Math.round(completionRate * 100)}%</span>
                </div>
                <Progress value={completionRate * 100} className="h-1" />
              </div>
            </div>
          ) : null}
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
              onClick={handleStartSession}
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>
        </AspectRatio>
      </div>

      {/* Title and metadata */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{template.title}</h1>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock3 className="mr-1 h-4 w-4" />
            {formatDuration(template.duration)}
          </div>
          
          {template.lastUsed && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              Dernière séance: {new Date(template.lastUsed).toLocaleDateString()}
            </div>
          )}
          
          {recommendedMood && (
            <div className="flex items-center">
              <span 
                className={`text-xs px-3 py-1 rounded-full ${getEmotionColor(recommendedMood)}`}
              >
                Recommandé pour: {recommendedMood}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground">
          {template.description}
        </p>
      </div>

      {/* Tabs for different content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="benefits">Bienfaits</TabsTrigger>
          <TabsTrigger value="music">Musique recommandée</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">À propos de cette session</h3>
            <p className="text-sm text-muted-foreground">
              Cette session {template.is_audio_only ? 'audio' : 'immersive'} est conçue pour vous aider à 
              {template.emotion ? ` cultiver un état de ${template.emotion.toLowerCase()}` : ' améliorer votre bien-être'}. 
              Elle utilise des techniques de visualisation guidée et de respiration pour maximiser les bienfaits.
            </p>
          </div>
          
          {template.tags && template.tags.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Niveau de difficulté</h3>
            <Badge variant="secondary">
              {template.difficulty || 'Débutant'}
            </Badge>
          </div>
        </TabsContent>
        
        <TabsContent value="benefits" className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Bienfaits</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {templateBenefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="music" className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Musique recommandée</h3>
            {recommendations && recommendations.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                {recommendations.slice(0, 5).map((track, index) => (
                  <li key={index}>{track.title} - {track.artist}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune recommandation musicale disponible pour cette session.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Start button */}
      <div className="flex justify-center mb-8">
        <Button size="lg" onClick={handleStartSession} className="w-full sm:w-auto">
          <Play className="mr-2 h-4 w-4" />
          Démarrer cette session
        </Button>
      </div>
    </div>
  );
};

export default VRTemplateDetail;
