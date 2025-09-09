import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  HelpCircle, 
  Search,
  Book,
  MessageSquare,
  Mail,
  Phone,
  Video,
  FileText,
  Zap,
  Shield,
  Heart
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const quickLinks = [
    { title: 'Guide de démarrage', icon: Book },
    { title: 'Vidéos tutoriels', icon: Video },
    { title: 'Documentation API', icon: FileText }
  ];

  const contactOptions = [
    {
      title: 'Chat en Direct',
      description: 'Réponse immédiate 24/7',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      title: 'Email Support',
      description: 'Réponse sous 2h',
      icon: Mail,
      color: 'bg-green-500'
    },
    {
      title: 'Téléphone',
      description: 'Lun-Ven 9h-18h',
      icon: Phone,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Centre d'Aide</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Heart className="h-3 w-3 mr-1" />
            Support 24/7
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Trouvez des réponses à vos questions et obtenez de l'aide rapidement
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Liens Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map((link, index) => (
              <Button key={index} variant="outline" className="w-full justify-start">
                <link.icon className="h-4 w-4 mr-2" />
                {link.title}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Nous Contacter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactOptions.map((option, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${option.color} flex items-center justify-center`}>
                    <option.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{option.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;