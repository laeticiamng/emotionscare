
import React from 'react';
import { VRSessionTemplate } from '@/types/vr';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Users, Tag, Award, Activity, CheckCircle } from 'lucide-react';
import { getVRTemplateCompletionRate, getVRTemplateRecommendedMood } from '@/utils/compatibility';

interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  onStart?: () => void;
  onBack?: () => void;
  heartRate?: number;
  className?: string;
}

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({
  template,
  onStart,
  className = ''
}) => {
  const {
    title,
    description,
    duration,
    difficulty,
    category,
    tags
  } = template;
  
  const getCoverImage = () => {
    return (
      template.imageUrl || 
      template.thumbnailUrl || 
      template.coverUrl || 
      template.cover_url || 
      '/images/vr-banner-bg.jpg'
    );
  };
  
  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return 'bg-gray-500';
    
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'hard':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500';
    }
  };
  
  const renderDifficulty = () => {
    if (!difficulty) return null;
    
    return (
      <Badge variant="outline" className={`${getDifficultyColor(difficulty)}`}>
        {difficulty}
      </Badge>
    );
  };

  // Get values safely using optional chaining
  const rating = template?.rating;
  const features = template?.features;
  const popularity = template?.popularity;
  const completionRate = getVRTemplateCompletionRate(template);
  const recommendedMood = getVRTemplateRecommendedMood(template);

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Image banner */}
      <div className="relative h-48 w-full">
        <img 
          src={getCoverImage()} 
          alt={title} 
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
          <div className="absolute bottom-4 left-4">
            {renderDifficulty()}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{duration} min</span>
            </div>
            
            {rating !== undefined && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <span>{rating.toFixed(1)}/5</span>
              </div>
            )}
            
            {popularity !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>{popularity}+ utilisateurs</span>
              </div>
            )}
            
            {completionRate > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>{completionRate}% terminé</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Emotion recommandée */}
          {recommendedMood && (
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Recommandé pour: <strong>{recommendedMood}</strong>
              </span>
            </div>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Caractéristiques</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 hover:bg-primary/20">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={onStart}
          >
            Commencer la session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRTemplateDetail;
