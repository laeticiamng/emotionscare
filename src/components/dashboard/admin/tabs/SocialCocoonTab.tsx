
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SocialCocoonCard from '../SocialCocoonCard';
import { Skeleton } from '@/components/ui/skeleton';

export interface SocialCocoonTabProps {
  socialCocoonData: {
    totalPosts: number;
    moderationRate: number;
    topHashtags: Array<{ tag: string; count: number }>;
  };
  isLoading?: boolean;
}

const SocialCocoonTab: React.FC<SocialCocoonTabProps> = ({ socialCocoonData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full col-span-1 md:col-span-2" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SocialCocoonCard socialStats={socialCocoonData} />
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Word Cloud des Hashtags</CardTitle>
          <CardDescription>Tendances des conversations anonymisées</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="bg-white/80 p-6 rounded-xl w-full h-full flex flex-wrap items-center justify-center gap-3">
            {socialCocoonData.topHashtags.map((tag, i) => (
              <div 
                key={i}
                className="px-3 py-1 rounded-full bg-cocoon-100 text-cocoon-800"
                style={{ 
                  fontSize: `${Math.max(14, Math.min(24, 14 + tag.count / 4))}px`,
                  opacity: 0.6 + (tag.count / 100)
                }}
              >
                {tag.tag}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 glass-card">
        <CardHeader>
          <CardTitle>Modération manuelle</CardTitle>
          <CardDescription>Posts nécessitant une revue (filtrés par l'IA)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Contenu</th>
                  <th className="text-left py-3 px-4">Raison</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">05/05/2025</td>
                  <td className="py-3 px-4">Message avec contenu sensible...</td>
                  <td className="py-3 px-4">Sensible - Santé mentale</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Approuver</Button>
                      <Button size="sm" variant="outline" className="text-red-500">Rejeter</Button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">04/05/2025</td>
                  <td className="py-3 px-4">Référence à une personne spécifique...</td>
                  <td className="py-3 px-4">Identité non anonymisée</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Approuver</Button>
                      <Button size="sm" variant="outline" className="text-red-500">Rejeter</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Button className="bg-cocoon-500 hover:bg-cocoon-600 text-white">
              Exporter rapport de modération
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialCocoonTab;
