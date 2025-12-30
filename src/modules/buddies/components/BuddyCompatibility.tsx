/**
 * Affichage détaillé de la compatibilité entre buddies
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Target, 
  Globe, 
  Clock, 
  Sparkles,
  CheckCircle2,
  Star
} from 'lucide-react';
import type { BuddyProfile } from '../types';
import { cn } from '@/lib/utils';

interface BuddyCompatibilityProps {
  myProfile: BuddyProfile;
  buddyProfile: BuddyProfile;
  overallScore?: number;
}

interface CompatibilityFactor {
  label: string;
  score: number;
  icon: React.ReactNode;
  details: string[];
  color: string;
}

export const BuddyCompatibility: React.FC<BuddyCompatibilityProps> = ({
  myProfile,
  buddyProfile,
  overallScore
}) => {
  // Calcul des facteurs de compatibilité
  const calculateFactors = (): CompatibilityFactor[] => {
    const factors: CompatibilityFactor[] = [];

    // Intérêts communs
    const commonInterests = myProfile.interests.filter(i => 
      buddyProfile.interests.includes(i)
    );
    const interestScore = myProfile.interests.length > 0 
      ? Math.round((commonInterests.length / Math.max(myProfile.interests.length, 1)) * 100)
      : 0;
    factors.push({
      label: 'Intérêts communs',
      score: interestScore,
      icon: <Heart className="h-4 w-4" />,
      details: commonInterests.length > 0 ? commonInterests : ['Aucun intérêt commun'],
      color: 'text-pink-500'
    });

    // Objectifs communs
    const commonGoals = myProfile.goals.filter(g => 
      buddyProfile.goals.includes(g)
    );
    const goalScore = myProfile.goals.length > 0 
      ? Math.round((commonGoals.length / Math.max(myProfile.goals.length, 1)) * 100)
      : 0;
    factors.push({
      label: 'Objectifs partagés',
      score: goalScore,
      icon: <Target className="h-4 w-4" />,
      details: commonGoals.length > 0 ? commonGoals : ['Aucun objectif commun'],
      color: 'text-blue-500'
    });

    // Langues communes
    const commonLanguages = myProfile.languages.filter(l => 
      buddyProfile.languages.includes(l)
    );
    const languageScore = commonLanguages.length > 0 ? 100 : 0;
    factors.push({
      label: 'Langues',
      score: languageScore,
      icon: <Globe className="h-4 w-4" />,
      details: commonLanguages.length > 0 ? commonLanguages : ['Aucune langue commune'],
      color: 'text-green-500'
    });

    // Niveau d'expérience similaire
    const expLevels = ['beginner', 'intermediate', 'advanced'];
    const myExp = expLevels.indexOf(myProfile.experience_level);
    const buddyExp = expLevels.indexOf(buddyProfile.experience_level);
    const expDiff = Math.abs(myExp - buddyExp);
    const expScore = expDiff === 0 ? 100 : expDiff === 1 ? 70 : 40;
    factors.push({
      label: 'Niveau compatible',
      score: expScore,
      icon: <Star className="h-4 w-4" />,
      details: [
        `Vous: ${myProfile.experience_level === 'beginner' ? 'Débutant' : myProfile.experience_level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}`,
        `${buddyProfile.display_name}: ${buddyProfile.experience_level === 'beginner' ? 'Débutant' : buddyProfile.experience_level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}`
      ],
      color: 'text-amber-500'
    });

    // Disponibilité similaire
    const availScore = myProfile.availability_status === buddyProfile.availability_status ? 100 :
      (myProfile.availability_status === 'online' || buddyProfile.availability_status === 'online') ? 70 : 40;
    factors.push({
      label: 'Disponibilité',
      score: availScore,
      icon: <Clock className="h-4 w-4" />,
      details: [
        `${buddyProfile.display_name} est ${buddyProfile.availability_status === 'online' ? 'en ligne' : 
          buddyProfile.availability_status === 'away' ? 'absent' : 
          buddyProfile.availability_status === 'busy' ? 'occupé' : 'hors ligne'}`
      ],
      color: 'text-purple-500'
    });

    return factors;
  };

  const factors = calculateFactors();
  const calculatedScore = overallScore || Math.round(factors.reduce((sum, f) => sum + f.score, 0) / factors.length);

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-500' };
    if (score >= 60) return { label: 'Bon', color: 'text-blue-500' };
    if (score >= 40) return { label: 'Moyen', color: 'text-amber-500' };
    return { label: 'Faible', color: 'text-red-500' };
  };

  const scoreInfo = getScoreLabel(calculatedScore);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Compatibilité avec {buddyProfile.display_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score global */}
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold">{calculatedScore}%</div>
          <Badge variant="secondary" className={cn("text-sm", scoreInfo.color)}>
            {scoreInfo.label}
          </Badge>
          <Progress value={calculatedScore} className="h-3 mt-2" />
        </div>

        {/* Détails des facteurs */}
        <div className="space-y-4 pt-4 border-t">
          {factors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={factor.color}>{factor.icon}</span>
                  <span className="text-sm font-medium">{factor.label}</span>
                </div>
                <span className="text-sm font-semibold">{factor.score}%</span>
              </div>
              <Progress value={factor.score} className="h-1.5" />
              <div className="flex flex-wrap gap-1">
                {factor.details.map((detail, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {factor.score > 0 && <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />}
                    {detail}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuddyCompatibility;
