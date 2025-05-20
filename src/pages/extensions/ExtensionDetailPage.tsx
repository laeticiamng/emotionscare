
import React, { useState } from 'react';
import Shell from '@/Shell';
import { useParams, useNavigate } from 'react-router-dom';
import { useExtensions } from '@/contexts/ExtensionsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Download, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Confetti } from '@/components/ui/confetti';

const ExtensionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { available, installed, toggleExtension } = useExtensions();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const extension = available.find(ext => ext.id === id);
  const isInstalled = installed.includes(id || '');
  
  if (!extension) {
    return (
      <Shell>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold">Extension non trouvée</h1>
          <Button onClick={() => navigate('/extensions')} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux extensions
          </Button>
        </div>
      </Shell>
    );
  }

  const handleToggleExtension = () => {
    toggleExtension(extension.id);
    
    if (!isInstalled) {
      toast({
        title: "Extension activée",
        description: `${extension.name} a été activée avec succès`,
        variant: "success",
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      toast({
        title: "Extension désactivée",
        description: `${extension.name} a été désactivée`,
        variant: "default",
      });
    }
  };
  
  const handleRatingSubmit = () => {
    toast({
      title: "Merci pour votre retour !",
      description: `Votre évaluation de ${rating}/5 a été enregistrée`,
      variant: "success",
    });
    setFeedbackSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <Shell>
      {showConfetti && <Confetti />}
      <div className="container mx-auto py-6">
        <Button 
          onClick={() => navigate('/extensions')} 
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux extensions
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 md:grid-cols-3"
        >
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/30 to-primary/5 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{extension.name}</h1>
                    <p className="text-muted-foreground">{extension.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {extension.isNew && (
                      <Badge variant="default" className="animate-pulse">Nouveau</Badge>
                    )}
                    {extension.isBeta && (
                      <Badge variant="outline" className="mt-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                        Bêta
                      </Badge>
                    )}
                    {extension.isEarlyAccess && (
                      <Badge variant="outline" className="mt-1 bg-purple-500/10 text-purple-600 border-purple-500/30">
                        Accès anticipé
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">À propos de cette extension</h2>
                <p className="mb-4">
                  {extension.description || 'Aucune description disponible.'}
                </p>
                
                {extension.tags && extension.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {extension.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Comment l'utiliser</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Activez l'extension en cliquant sur le bouton</li>
                    <li>Accédez à votre tableau de bord personnel</li>
                    <li>Découvrez les nouvelles fonctionnalités dans l'espace dédié</li>
                    <li>Personnalisez selon vos préférences</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
            
            {isInstalled && !feedbackSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Donnez votre avis sur cette extension</CardTitle>
                    <CardDescription>Votre retour nous aide à améliorer nos services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-all ${
                            star <= (hoveredStar || rating) 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-300"
                          }`}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      disabled={rating === 0}
                      onClick={handleRatingSubmit}
                    >
                      Envoyer mon évaluation
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
            
            {feedbackSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6 flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <p>Merci pour votre retour ! Votre évaluation nous aide à améliorer.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {extension.author && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créateur</span>
                    <span className="font-medium">{extension.author}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">{extension.version || '1.0.0'}</span>
                </div>
                {extension.releaseDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date de sortie</span>
                    <span className="font-medium">{extension.releaseDate}</span>
                  </div>
                )}
                {extension.updateDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dernière mise à jour</span>
                    <span className="font-medium">{extension.updateDate}</span>
                  </div>
                )}
                {extension.usageCount !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilisateurs</span>
                    <span className="font-medium">{extension.usageCount.toLocaleString()}</span>
                  </div>
                )}
                {extension.rating !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Évaluation</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{extension.rating}/5</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <motion.div 
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full relative overflow-hidden"
                    variant={isInstalled ? "destructive" : "default"}
                    onClick={handleToggleExtension}
                  >
                    {isInstalled ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Activer
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
            
            {extension.category && (
              <Card>
                <CardHeader>
                  <CardTitle>Catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-sm">
                    {extension.category}
                  </Badge>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Tutoriel vidéo</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Clock className="h-10 w-10 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button variant="outline" className="w-full">Regarder le tutoriel</Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default ExtensionDetailPage;
