
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Users, Sparkles, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const B2BUserCocon: React.FC = () => {
  const handlePost = () => {
    toast({
      title: "Publication en cours de modération",
      description: "Votre message sera publié après vérification par notre IA"
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">COCON Pro</h1>
          <p className="text-muted-foreground">Réseau social 100% positif pour votre entreprise</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handlePost}>
          <Sparkles className="h-4 w-4" />
          Nouvelle publication
        </Button>
      </div>
      
      <Tabs defaultValue="feed">
        <TabsList className="mb-4">
          <TabsTrigger value="feed">Fil d'actualités</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="profile">Mon profil pro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed">
          <div className="space-y-4">
            {/* Annonce d'entreprise */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Direction RH</CardTitle>
                      <p className="text-xs text-muted-foreground">Il y a 1 jour • Annonce importante</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">📢 Rappel : Atelier de méditation collective ce vendredi à 12h30 en salle Mozart. La séance sera suivie d'un déjeuner bien-être. Inscrivez-vous via le lien dans votre email ! 🧘‍♀️</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-rose-600">
                    <Heart className="h-4 w-4 mr-1" /> 42
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" /> 16
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Publication exemple 1 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600">FD</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">François D.</CardTitle>
                      <p className="text-xs text-muted-foreground">Il y a 3 heures • Équipe Marketing</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Je tiens à remercier toute l'équipe pour son soutien lors de la présentation client d'hier. Votre énergie positive et vos encouragements m'ont vraiment aidé à donner le meilleur de moi-même ! 🙏</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-rose-600">
                    <Heart className="h-4 w-4 mr-1" /> 28
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" /> 7
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Publication exemple 2 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600">A</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">Anonyme</CardTitle>
                      <p className="text-xs text-muted-foreground">Il y a 6 heures • Vibration: Reconnaissance</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Je voulais partager que la nouvelle politique de flexibilité au travail m'a permis de mieux équilibrer ma vie pro et perso. Je me sens plus productif et motivé. Merci à la direction pour cette initiative ! 🌟</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-rose-600">
                    <Heart className="h-4 w-4 mr-1" /> 53
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" /> 19
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>Équipe Marketing</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">12 membres</p>
                <p className="text-sm mb-4">Partagez vos réussites et trouvez de l'inspiration collective</p>
                <Button size="sm" variant="outline" className="w-full">Consulter</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle>Tech & IT</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">18 membres</p>
                <p className="text-sm mb-4">Conseils, entraide et célébration des succès techniques</p>
                <Button size="sm" variant="outline" className="w-full">Consulter</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <CardTitle>Groupe Bien-être</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">27 membres</p>
                <p className="text-sm mb-4">Activités, conseils et soutien pour votre équilibre</p>
                <Button size="sm" variant="outline" className="w-full">Consulter</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Mon profil professionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-indigo-600">MT</span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-medium">Martin T.</h3>
                      <p className="text-muted-foreground">Chef de projet • Département R&D</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Points forts professionnels</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Communication</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">Leadership</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Créativité</span>
                      </div>
                    </div>
                    
                    <div>
                      <Button size="sm" variant="outline">Modifier mon profil</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Mes équipes</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
                      <Users className="h-3 w-3" /> Tech & IT
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm flex items-center gap-1">
                      <Users className="h-3 w-3" /> Groupe Bien-être
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserCocon;
