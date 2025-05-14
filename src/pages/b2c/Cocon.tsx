
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share, Users } from 'lucide-react';

const B2CCocon: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Social COCON</h1>
      <p className="text-muted-foreground mb-4">
        Un espace positif et bienveillant pour partager vos pensées, ressentis et encouragements.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mon espace</CardTitle>
              <CardDescription>Votre activité sociale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/default-avatar.png" alt="@utilisateur" />
                  <AvatarFallback>UT</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Mon profil</p>
                  <p className="text-xs text-muted-foreground">Voir mon activité</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Groupes suggérés</CardTitle>
              <CardDescription>Basés sur vos intérêts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Gestion du stress</p>
                    <p className="text-xs text-muted-foreground">42 membres</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Rejoindre</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Méditation quotidienne</p>
                    <p className="text-xs text-muted-foreground">28 membres</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Rejoindre</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>Dans votre communauté</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
                <p className="text-sm font-medium">Méditation collective</p>
                <p className="text-xs text-muted-foreground">Dimanche, 10h-11h</p>
                <Badge className="mt-2" variant="outline">En ligne</Badge>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg">
                <p className="text-sm font-medium">Partage de vécu</p>
                <p className="text-xs text-muted-foreground">Mercredi, 18h-19h</p>
                <Badge className="mt-2" variant="outline">En ligne</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main feed */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Partagez une pensée positive ou une expérience qui vous a inspiré..." 
                className="min-h-20 mb-3"
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Photo</Button>
                  <Button variant="outline" size="sm">Mood</Button>
                </div>
                <Button>Partager</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Example post */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/avatar-1.jpg" alt="@sophie" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Julien D.</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                  Gratitude
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3">J'ai enfin réussi à maintenir ma méditation quotidienne pendant 10 jours consécutifs. C'est une petite victoire, mais je sens déjà les effets sur mon niveau de stress. Si quelqu'un souhaite rejoindre le défi, je serais ravi de partager cette expérience !</p>
              <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" alt="Méditation" className="rounded-lg w-full h-48 object-cover" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 12
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 4
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share className="h-4 w-4" /> Partager
              </Button>
            </CardFooter>
          </Card>
          
          {/* Another example post */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/avatar-2.jpg" alt="@marie" />
                    <AvatarFallback>ML</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Marie L.</p>
                    <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                  Question
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>Je cherche un bon livre sur la gestion des émotions au quotidien. Avez-vous des recommandations à me faire ? J'apprécie particulièrement les ouvrages avec des exercices pratiques.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 8
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 7
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Share className="h-4 w-4" /> Partager
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CCocon;
