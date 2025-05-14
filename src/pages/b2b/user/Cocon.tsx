
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BellRing, Building, Heart, MessageCircle, Share, Users } from 'lucide-react';

const B2BUserCocon: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Cocon social d'entreprise</h1>
      <p className="text-muted-foreground mb-4">
        Un espace social positif et bienveillant réservé aux collaborateurs de votre entreprise
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mon espace pro</CardTitle>
              <CardDescription>Votre vie sociale d'entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/default-avatar.png" alt="@utilisateur" />
                  <AvatarFallback>UT</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Mon profil pro</p>
                  <p className="text-xs text-muted-foreground">Gérer mes informations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <BellRing className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">3 nouvelles interactions</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mes équipes</p>
                  <p className="text-xs text-muted-foreground">2 équipes actives</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Voir mon profil</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Équipes suggérées</CardTitle>
              <CardDescription>Basées sur votre département</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bien-être au bureau</p>
                    <p className="text-xs text-muted-foreground">24 collaborateurs</p>
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
                    <p className="text-sm font-medium">Parentalité & Travail</p>
                    <p className="text-xs text-muted-foreground">18 collaborateurs</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Rejoindre</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>Organisés par votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
                <p className="text-sm font-medium">Atelier gestion du stress</p>
                <p className="text-xs text-muted-foreground">Mercredi, 15h-16h, Salle Zen</p>
                <Badge className="mt-2" variant="outline">En présentiel</Badge>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-lg">
                <p className="text-sm font-medium">Yoga en entreprise</p>
                <p className="text-xs text-muted-foreground">Vendredi, 12h30-13h30</p>
                <Badge className="mt-2" variant="outline">En présentiel</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main feed */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Partagez une pensée positive ou une initiative qui vous inspire dans l'entreprise..." 
                className="min-h-20 mb-3"
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Photo</Button>
                  <Button variant="outline" size="sm">Mood pro</Button>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Partager</Button>
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
                    <AvatarFallback>SL</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Sophie L.</p>
                    <p className="text-xs text-muted-foreground">Marketing • Il y a 3 heures</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                  Satisfaction
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Notre atelier de gestion du temps a été un vrai succès hier ! Merci à tous les participants pour leurs retours positifs. Qui serait intéressé par une seconde session la semaine prochaine ?</p>
              <img src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwd29ya3Nob3B8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" alt="Atelier en entreprise" className="rounded-lg w-full h-48 object-cover" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 14
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 6
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
                    <AvatarImage src="/avatar-2.jpg" alt="@pierre" />
                    <AvatarFallback>PD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Pierre D.</p>
                    <p className="text-xs text-muted-foreground">RH • Il y a 1 jour</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                  Annonce
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>Nous sommes heureux d'annoncer que la salle de détente a été réaménagée avec un espace méditation ! N'hésitez pas à l'utiliser pour vos pauses bien-être.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 28
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 9
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

export default B2BUserCocon;
