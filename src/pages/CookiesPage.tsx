
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const CookiesPage: React.FC = () => {
  const [cookiesSettings, setCookiesSettings] = React.useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const handleToggle = (type: keyof typeof cookiesSettings) => {
    if (type === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    setCookiesSettings(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSavePreferences = () => {
    toast.success('Vos préférences de cookies ont été enregistrées');
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Politique de cookies</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
            <p>
              EmotionsCare utilise des cookies et technologies similaires pour améliorer votre expérience sur notre site web. 
              Cette page vous explique comment nous utilisons les cookies, pourquoi nous les utilisons et comment vous pouvez 
              contrôler leur utilisation.
            </p>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Qu'est-ce qu'un cookie ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Un cookie est un petit fichier texte qu'un site web enregistre sur votre ordinateur ou appareil mobile lorsque 
                  vous visitez ce site. Il permet au site web de mémoriser vos actions et préférences (comme l'identifiant de 
                  connexion, la langue, la taille de police et d'autres préférences d'affichage) pendant un certain temps, afin 
                  que vous n'ayez pas à les saisir à nouveau lorsque vous revenez sur le site ou naviguez d'une page à une autre.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comment utilisons-nous les cookies ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">Nous utilisons différents types de cookies pour les raisons suivantes :</p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cookies strictement nécessaires</h3>
                      <p className="text-sm text-muted-foreground">
                        Ces cookies sont essentiels au fonctionnement de notre site web et ne peuvent pas être désactivés.
                      </p>
                    </div>
                    <Switch 
                      checked={cookiesSettings.necessary} 
                      disabled={true} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cookies fonctionnels</h3>
                      <p className="text-sm text-muted-foreground">
                        Ces cookies permettent des fonctionnalités améliorées et une personnalisation.
                      </p>
                    </div>
                    <Switch 
                      checked={cookiesSettings.functional} 
                      onCheckedChange={() => handleToggle('functional')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cookies analytiques</h3>
                      <p className="text-sm text-muted-foreground">
                        Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site.
                      </p>
                    </div>
                    <Switch 
                      checked={cookiesSettings.analytics} 
                      onCheckedChange={() => handleToggle('analytics')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Cookies marketing</h3>
                      <p className="text-sm text-muted-foreground">
                        Ces cookies sont utilisés pour suivre les visiteurs sur les sites web afin d'afficher des publicités pertinentes.
                      </p>
                    </div>
                    <Switch 
                      checked={cookiesSettings.marketing} 
                      onCheckedChange={() => handleToggle('marketing')} 
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSavePreferences}>
                    Enregistrer mes préférences
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Gestion des cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  En plus des contrôles que nous vous fournissons, vous pouvez choisir de restreindre, bloquer ou supprimer les 
                  cookies de notre site web, ou de tout autre site web, en utilisant votre navigateur. Dans la plupart des navigateurs, 
                  vous pouvez contrôler vos préférences de cookies via les paramètres de "préférences" ou "options".
                </p>
                <p className="mt-4">
                  Veuillez noter que si vous choisissez de restreindre tous les cookies, y compris les cookies strictement nécessaires, 
                  vous ne pourrez peut-être pas accéder à toutes ou certaines parties de notre site et votre expérience utilisateur 
                  pourrait être considérablement réduite.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Modifications de notre politique de cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Nous pouvons mettre à jour notre politique de cookies de temps à autre. Nous vous informerons de tout changement 
                  significatif en publiant la nouvelle politique de cookies sur cette page.
                </p>
                <p className="mt-4">
                  Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la façon dont nous utilisons 
                  les cookies. Cette politique a été mise à jour pour la dernière fois le 1er septembre 2023.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Nous contacter</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Si vous avez des questions concernant notre utilisation des cookies, veuillez nous contacter à :
                </p>
                <p className="mt-4">
                  EmotionsCare<br />
                  Service Protection des Données<br />
                  privacy@emotionscare.fr
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default CookiesPage;
