
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Heart, 
  Calendar, 
  ArrowLeft, 
  Tag, 
  BarChart,
  ThumbsUp,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { VRSessionTemplate } from '@/types';

interface VRTemplateDetailProps {
  template: VRSessionTemplate;
  heartRate?: number;
  onStartSession?: () => void;
  onBack?: () => void;
  className?: string;
}

const VRTemplateDetail: React.FC<VRTemplateDetailProps> = ({
  template,
  heartRate = 75,
  onStartSession,
  onBack,
  className = ''
}) => {
  const {
    title,
    description,
    duration,
    tags,
    benefits,
    emotion,
    theme,
    difficulty
  } = template;
  
  // Format duration in minutes and seconds
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '5:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get image URL from various possible properties
  const getImageUrl = (): string => {
    return template.imageUrl || 
           template.coverUrl ||
           template.thumbnailUrl ||
           template.cover_url ||
           template.preview_url ||
           '/images/vr-template-placeholder.jpg';
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-2 px-2">
          <ArrowLeft className="h-4 w-4" />
          Back to templates
        </Button>
      )}
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="w-full h-40 rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl()})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent rounded-lg" />
        </div>
        
        <div className="pt-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Duration */}
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(duration)} min
            </Badge>
            
            {/* Theme */}
            {theme && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {theme}
              </Badge>
            )}
            
            {/* Emotion */}
            {emotion && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {emotion}
              </Badge>
            )}
            
            {/* Difficulty */}
            {difficulty && (
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {difficulty}
              </Badge>
            )}
            
            {/* Completion Rate */}
            {(template.completionRate !== undefined || template.completion_rate !== undefined) && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BarChart className="h-3.5 w-3.5" />
                {template.completionRate || template.completion_rate || 0}% completion
              </Badge>
            )}
            
            {/* Recommended Mood */}
            {(template.recommendedMood || template.recommended_mood) && (
              <Badge variant="outline" className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                For {template.recommendedMood || template.recommended_mood}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Description */}
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            {description || 'Experience a guided session designed to improve your emotional well-being.'}
          </p>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Benefits */}
          {benefits && benefits.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Benefits</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Heart Rate and Start Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500 h-5 w-5" />
          <span className="font-medium">{heartRate} BPM</span>
        </div>
        
        <Button onClick={onStartSession} size="lg">
          Start Session
        </Button>
      </div>
    </div>
  );
};

export default VRTemplateDetail;
