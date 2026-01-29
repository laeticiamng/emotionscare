/**
 * CreatorProfile - Profil public d'un créateur
 */

import React from 'react';
import { Star, Award, Calendar, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Creator, Program } from '../types';

interface CreatorProfileProps {
  creator: Creator;
  programs: Program[];
  onProgramClick?: (program: Program) => void;
}

const BADGE_LABELS: Record<string, { label: string; emoji: string }> = {
  bestseller: { label: 'Bestseller', emoji: '🏆' },
  recommended: { label: 'Recommandé', emoji: '⭐' },
  top_rated: { label: 'Top noté', emoji: '💫' },
  verified_expert: { label: 'Expert vérifié', emoji: '✓' }
};

const CreatorProfile: React.FC<CreatorProfileProps> = ({ creator, programs, onProgramClick }) => {
  const publishedPrograms = programs.filter(p => p.status === 'published');
  const totalStudents = programs.reduce((sum, p) => sum + p.total_purchases, 0);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center md:items-start">
              <img 
                src={creator.avatar_url || '/placeholder.svg'} 
                alt={creator.display_name}
                className="w-24 h-24 rounded-full border-4 border-primary/20"
              />
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {creator.badges.map((badge, i) => {
                  const config = BADGE_LABELS[badge.type];
                  return (
                    <Badge key={i} variant="secondary" className="gap-1">
                      <span>{config?.emoji}</span>
                      <span>{config?.label}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{creator.display_name}</h1>
              <p className="text-muted-foreground mt-2 max-w-xl">{creator.bio}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{creator.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({creator.review_count} avis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{totalStudents}</span>
                  <span className="text-muted-foreground">participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{publishedPrograms.length}</span>
                  <span className="text-muted-foreground">programmes</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      {creator.credentials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {creator.credentials.map((credential, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{credential.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {credential.institution} • {credential.year}
                    </p>
                    {credential.verified && (
                      <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                        ✓ Vérifié
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Programmes de {creator.display_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedPrograms.map(program => (
              <Card 
                key={program.id}
                className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                onClick={() => onProgramClick?.(program)}
              >
                <div className="aspect-video relative">
                  <img 
                    src={program.cover_image_url || '/placeholder.svg'} 
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-medium line-clamp-1">{program.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span>{program.rating.toFixed(1)}</span>
                    </div>
                    <span className="font-semibold text-primary">
                      {(program.price_cents / 100).toFixed(2)} €
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {publishedPrograms.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Aucun programme publié pour le moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorProfile;
