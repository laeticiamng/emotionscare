
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BellRing, Heart, MessageCircle, Share, Users } from 'lucide-react';

const B2CCocon: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Cocon social</h1>
      <p className="text-muted-foreground mb-4">
        Un espace social positif et bienveillant pour échanger sur votre bien-être émotionnel
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mon espace</CardTitle>
              <CardDescription>Votre vie sociale émotionnelle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/default-avatar.png" alt="@utilisateur" />
                  <AvatarFallback>UT</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Mon profil</p>
                  <p className="text-xs text-muted-foreground">Gérer mes informations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BellRing className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">2 nouvelles interactions</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Voir mon profil</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Groupes suggérés</CardTitle>
              <CardDescription>Basés sur vos intérêts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Méditation quotidienne</p>
                    <p className="text-xs text-muted-foreground">34 membres</p>
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
                    <p className="text-sm font-medium">Gestion du stress</p>
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
              <CardDescription>Recommandés pour vous</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="text-sm font-medium">Atelier bien-être</p>
                <p className="text-xs text-muted-foreground">Samedi, 15h-16h, En ligne</p>
                <Badge className="mt-2" variant="outline">Virtuel</Badge>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg">
                <p className="text-sm font-medium">Séance de méditation</p>
                <p className="text-xs text-muted-foreground">Dimanche, 10h-11h</p>
                <Badge className="mt-2" variant="outline">Virtuel</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main feed */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Partagez une pensée positive ou une expérience qui vous a apporté du bien-être..." 
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
                    <AvatarImage src="/avatar-1.jpg" alt="@marie" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Marie R.</p>
                    <p className="text-xs text-muted-foreground">Il y a 3 heures</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                  Satisfaction
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Aujourd'hui, j'ai pris 10 minutes pour méditer avant de commencer ma journée et cela a fait une énorme différence ! Je me sens plus sereine et concentrée. Quelqu'un d'autre pratique la méditation matinale ?</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 12
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 5
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
                    <AvatarImage src="/avatar-2.jpg" alt="@thomas" />
                    <AvatarFallback>TM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Thomas M.</p>
                    <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                  Conseil
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>J'ai découvert une technique de respiration qui m'aide beaucoup contre l'anxiété : inspirer sur 4 temps, tenir sur 4 temps, expirer sur 6 temps. À essayer si vous vous sentez stressé !</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 18
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
