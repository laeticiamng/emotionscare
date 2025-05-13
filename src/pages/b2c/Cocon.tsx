
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Users, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const B2CCocon: React.FC = () => {
  const handlePost = () => {
    toast({
      title: "Publication en cours de modération",
      description: "Votre message sera publié après vérification par notre IA"
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">COCON - Votre espace social bienveillant</h1>
        <Button className="flex items-center gap-2" onClick={handlePost}>
          <Sparkles className="h-4 w-4" />
          Nouvelle publication
        </Button>
      </div>
      
      <Tabs defaultValue="feed">
        <TabsList className="mb-4">
          <TabsTrigger value="feed">Fil d'actualités</TabsTrigger>
          <TabsTrigger value="groups">Groupes émotionnels</TabsTrigger>
          <TabsTrigger value="profile">Mon profil émotionnel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed">
          <div className="space-y-4">
            {/* Publication exemple 1 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600">MS</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">Marie S.</CardTitle>
                      <p className="text-xs text-muted-foreground">Il y a 2 heures • Vibration: Sérénité</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">J'ai pris 10 minutes ce matin pour méditer face à ma fenêtre. Le chant des oiseaux m'a rappelé combien la nature peut nous apaiser. Parfois les solutions sont juste devant nous. 🌿</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-rose-600">
                    <Heart className="h-4 w-4 mr-1" /> 24
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" /> 8
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Publication exemple 2 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-600">A</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">Anonyme</CardTitle>
                      <p className="text-xs text-muted-foreground">Il y a 5 heures • Vibration: Gratitude</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Aujourd'hui, j'ai surmonté ma peur et j'ai enfin parlé en public. Je me sens tellement légère ! Merci à ce groupe qui me donne la force d'avancer chaque jour. ✨</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-rose-600">
                    <Heart className="h-4 w-4 mr-1" /> 37
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" /> 12
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="groups">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle>Groupe Calme</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">254 membres</p>
                <p className="text-sm mb-4">Un espace pour cultiver la sérénité et le calme intérieur</p>
                <Button size="sm" variant="outline" className="w-full">Rejoindre</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <CardTitle>Groupe Énergie</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">187 membres</p>
                <p className="text-sm mb-4">Pour les personnes dynamiques qui aiment partager leur enthousiasme</p>
                <Button size="sm" variant="outline" className="w-full">Rejoindre</Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle>Groupe Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">163 membres</p>
                <p className="text-sm mb-4">Concentration, productivité et accomplissement personnel</p>
                <Button size="sm" variant="outline" className="w-full">Rejoindre</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Mon profil émotionnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-blue-600">LG</span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-medium">Laura G.</h3>
                      <p className="text-muted-foreground">Membre depuis 4 mois</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Vibration dominante</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Sérénité</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Gratitude</span>
                      </div>
                    </div>
                    
                    <div>
                      <Button size="sm" variant="outline">Modifier mon profil</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Mes groupes émotionnels</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                      <Users className="h-3 w-3" /> Groupe Calme
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
                      <Users className="h-3 w-3" /> Groupe Focus
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

export default B2CCocon;
