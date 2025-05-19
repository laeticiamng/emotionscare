
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const B2CPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Espace Particulier</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Journal émotionnel</CardTitle>
            <CardDescription>Suivez et analysez vos émotions quotidiennes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Accédez à votre journal émotionnel personnalisé pour enregistrer et analyser vos émotions au fil du temps.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Thérapie musicale</CardTitle>
            <CardDescription>Explorez des playlists adaptées à vos émotions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Découvrez des recommandations musicales basées sur votre état émotionnel actuel.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Exercices de relaxation</CardTitle>
            <CardDescription>Réduisez votre stress et anxiété</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Accédez à une bibliothèque d'exercices de respiration, méditation et relaxation.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CPage;
