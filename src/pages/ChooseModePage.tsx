
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User, ArrowLeft, Brain } from 'lucide-react';

const ChooseModePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-6">
            Choisissez votre mode d'accès
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Découvrez l'expérience qui vous correspond le mieux
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Particuliers Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Card className="h-full border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Particuliers</CardTitle>
                <CardDescription className="text-lg">
                  Une parenthèse pour vous. Le luxe de prendre le temps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🌱 Votre espace bien-être :</h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>• Moments pour ralentir et vous reconnecter</li>
                    <li>• Expérience sensorielle élégante et apaisante</li>
                    <li>• Modules guidés et parcours personnalisés</li>
                    <li>• Interface sobre, sons doux, lumière choisie</li>
                    <li>• Cocon digital discret et précieux</li>
                  </ul>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                    onClick={() => navigate('/b2c/login')}
                  >
                    Commencer mon expérience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Entreprises Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Card className="h-full border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <Building2 className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Entreprises</CardTitle>
                <CardDescription className="text-lg">
                  L'énergie partagée au service de l'excellence collective.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">🏢 Solutions professionnelles :</h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>• Élan de se dépasser, envie de s'engager</li>
                    <li>• Sérénité face à la fatigue et la routine</li>
                    <li>• Relations humaines vivantes et authentiques</li>
                    <li>• Accompagnement sur-mesure évolutif</li>
                    <li>• Énergie collective durable et contagieuse</li>
                  </ul>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                    onClick={() => navigate('/b2b/selection')}
                  >
                    Découvrir nos solutions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center space-y-4"
        >
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
              "Le bien-être ne s'explique pas, il se vit. Rejoignez-nous pour explorer une nouvelle vision du bien-être : simple, essentielle, humaine, élégante."
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mt-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
          
          <p className="text-sm text-slate-400 dark:text-slate-500">
            🌟 Découvrez, vivez, partagez l'expérience émotionnelle. EmotionsCare SASU.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChooseModePage;
