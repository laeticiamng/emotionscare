import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MusicProvider } from '@/contexts/MusicContext';
import MusicPlayer from '@/components/music/MusicPlayer';
import MusicRecommendations from '@/components/music/MusicRecommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MusicPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/b2c/dashboard')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Music className="h-12 w-12 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Musicothérapie
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Musique adaptée à vos émotions
            </p>
          </div>

          <MusicProvider>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lecteur Musical Thérapeutique</CardTitle>
                  <CardDescription>
                    Musique personnalisée selon votre état émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MusicPlayer />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations Personnalisées</CardTitle>
                  <CardDescription>
                    Suggestions basées sur votre humeur actuelle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MusicRecommendations />
                </CardContent>
              </Card>
            </div>
          </MusicProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default MusicPage;