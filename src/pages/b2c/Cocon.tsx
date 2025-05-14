
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellRing, Heart, MessageCircle, Share, Users } from 'lucide-react';

const B2CCocon: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Cocon social</h1>
      <p className="text-muted-foreground mb-4">
        Un espace social positif où partager vos émotions et échanger avec d'autres utilisateurs
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mon espace</CardTitle>
              <CardDescription>Gérez vos interactions sociales</CardDescription>
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
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mes cercles</p>
                  <p className="text-xs text-muted-foreground">3 cercles actifs</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Voir mon profil</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cercles suggérés</CardTitle>
              <CardDescription>Basés sur vos intérêts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Méditation quotidienne</p>
                    <p className="text-xs text-muted-foreground">128 membres</p>
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
                    <p className="text-sm font-medium">Bien-être au quotidien</p>
                    <p className="text-xs text-muted-foreground">85 membres</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Rejoindre</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main feed */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Textarea 
                placeholder="Partagez une pensée positive ou un moment qui vous a fait du bien aujourd'hui..." 
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
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Marie A.</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                  Sérénité
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3">J'ai essayé la méditation guidée ce matin, et je me sens vraiment plus calme pour commencer la journée. Quelqu'un d'autre pratique cela régulièrement?</p>
              <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" alt="Méditation" className="rounded-lg w-full h-48 object-cover" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 24
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 8
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
                    <AvatarFallback>TD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Thomas D.</p>
                    <p className="text-xs text-muted-foreground">Il y a 5 heures</p>
                  </div>
                </div>
                <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                  Inspiration
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>Petite citation qui m'a beaucoup aidé aujourd'hui: "Les émotions sont comme des vagues, nous ne pouvons pas les arrêter, mais nous pouvons apprendre à surfer dessus."</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> 42
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> 12
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
