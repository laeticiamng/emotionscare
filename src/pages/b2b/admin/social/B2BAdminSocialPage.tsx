
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Share2, Plus, Users, Shield, Target, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminAnnouncement {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  created_at: string;
  likes: number;
  comments: number;
  type: 'announcement' | 'wellbeing' | 'event';
  important: boolean;
}

const B2BAdminSocialPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [announcementType, setAnnouncementType] = useState<'announcement' | 'wellbeing' | 'event'>('announcement');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      const mockAnnouncements: AdminAnnouncement[] = [
        {
          id: '1',
          content: "Important: Notre nouvelle initiative bien-être démarre la semaine prochaine ! Tous les départements sont invités à participer aux sessions de méditation guidée les mardis et jeudis à 9h.",
          author: { name: 'Anne Dupont', role: 'DRH', avatar: '' },
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 24,
          comments: 8,
          type: 'announcement',
          important: true
        },
        {
          id: '2',
          content: "Nous avons le plaisir d'annoncer un atelier de gestion du stress le 15 juin prochain dans la salle de conférence. Les inscriptions sont ouvertes sur l'intranet.",
          author: { name: 'Michel Bernard', role: 'Responsable Bien-être', avatar: '' },
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          likes: 18,
          comments: 5,
          type: 'wellbeing',
          important: false
        },
        {
          id: '3',
          content: "Félicitations à l'équipe Marketing pour leur excellent score bien-être collectif ce mois-ci ! Une amélioration de 22% depuis le début du programme.",
          author: { name: 'Sophie Martin', role: 'Directrice', avatar: '' },
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 45,
          comments: 12,
          type: 'announcement',
          important: false
        }
      ];
      
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast.error('Erreur lors du chargement des annonces');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.trim() || !user) return;
    
    try {
      setIsPosting(true);
      
      const newAnnouncementData: AdminAnnouncement = {
        id: Date.now().toString(),
        content: newAnnouncement,
        author: {
          name: user.user_metadata?.name || user.email || 'Administrateur',
          role: 'Administrateur',
          avatar: user.user_metadata?.avatar_url
        },
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0,
        type: announcementType,
        important: isImportant
      };
      
      setAnnouncements(prev => [newAnnouncementData, ...prev]);
      setNewAnnouncement('');
      setIsImportant(false);
      setAnnouncementType('announcement');
      toast.success('Annonce publiée avec succès !');
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (id: string) => {
    setAnnouncements(prev => prev.map(announcement => 
      announcement.id === id 
        ? { ...announcement, likes: announcement.likes + 1 }
        : announcement
    ));
    toast.success('❤️ Annonce aimée !');
  };

  const getAnnouncementTypeLabel = (type: string) => {
    switch (type) {
      case 'wellbeing': return 'Bien-être';
      case 'event': return 'Événement';
      default: return 'Annonce';
    }
  };

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'wellbeing': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours === 1) return 'Il y a 1 heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Il y a 1 jour';
    return `Il y a ${diffInDays} jours`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="large" text="Chargement de l'espace social administrateur..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Social Cocoon</h1>
          <p className="text-muted-foreground">
            Communiquez avec l'ensemble de votre organisation
          </p>
        </header>

        {/* Organization Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">158</p>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-semibold">72%</p>
                <p className="text-sm text-muted-foreground">Score global bien-être</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold">85%</p>
                <p className="text-sm text-muted-foreground">Taux d'engagement</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Bell className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-semibold">3</p>
                <p className="text-sm text-muted-foreground">Alertes bien-être</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Announcement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Publier une annonce d'organisation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Partagez une communication importante à toute l'équipe..."
              className="min-h-[150px]"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Type d'annonce</label>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    size="sm"
                    variant={announcementType === 'announcement' ? 'default' : 'outline'}
                    onClick={() => setAnnouncementType('announcement')}
                  >
                    Annonce
                  </Button>
                  <Button 
                    type="button"
                    size="sm"
                    variant={announcementType === 'wellbeing' ? 'default' : 'outline'}
                    onClick={() => setAnnouncementType('wellbeing')}
                  >
                    Bien-être
                  </Button>
                  <Button 
                    type="button"
                    size="sm"
                    variant={announcementType === 'event' ? 'default' : 'outline'}
                    onClick={() => setAnnouncementType('event')}
                  >
                    Événement
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Options</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="important"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="important" className="text-sm">
                    Marquer comme important
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleCreateAnnouncement}
                disabled={!newAnnouncement.trim() || isPosting}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {isPosting ? 'Publication...' : 'Publier l\'annonce'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Feed */}
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className={`hover:shadow-lg transition-shadow ${announcement.important ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={announcement.author.avatar} />
                    <AvatarFallback>
                      {announcement.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                      <h3 className="font-semibold">{announcement.author.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {announcement.author.role}
                      </Badge>
                      <Badge className={`text-xs ${getAnnouncementTypeColor(announcement.type)}`}>
                        {getAnnouncementTypeLabel(announcement.type)}
                      </Badge>
                      {announcement.important && (
                        <Badge variant="destructive" className="text-xs">
                          Important
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(announcement.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-foreground mb-4 leading-relaxed">
                      {announcement.content}
                    </p>
                    
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLike(announcement.id)}
                        className="gap-2 hover:text-red-500"
                      >
                        <Heart className="h-4 w-4" />
                        {announcement.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="gap-2 hover:text-blue-500">
                        <MessageSquare className="h-4 w-4" />
                        {announcement.comments}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="gap-2 hover:text-green-500">
                        <Share2 className="h-4 w-4" />
                        Partager
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Communication Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres de communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="gap-2 h-auto p-4">
                <Bell className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Notifications automatiques</p>
                  <p className="text-sm text-muted-foreground">Configurer les alertes</p>
                </div>
              </Button>
              <Button variant="outline" className="gap-2 h-auto p-4">
                <Target className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Audience des messages</p>
                  <p className="text-sm text-muted-foreground">Gérer les groupes et équipes</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={loadAnnouncements}>
            Charger plus d'annonces
          </Button>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminSocialPage;
