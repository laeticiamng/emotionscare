import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, AlertTriangle, Eye, EyeOff, Flag, Ban, 
  CheckCircle, XCircle, MessageSquare, Users, 
  TrendingUp, Activity, Settings, Filter,
  Clock, Zap, Heart, ThumbsDown, Lock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CoconSpace {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  moderationLevel: 'low' | 'medium' | 'high';
  keywords: string[];
  owner: {
    name: string;
    avatar: string;
  };
  stats: {
    posts: number;
    reports: number;
    activeMembers: number;
  };
}

interface ModerationAction {
  id: string;
  type: 'auto_filter' | 'user_report' | 'admin_review';
  content: {
    text: string;
    author: string;
    space: string;
  };
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  timestamp: string;
  aiConfidence: number;
}

interface ContentFilter {
  id: string;
  name: string;
  description: string;
  active: boolean;
  category: 'toxic' | 'spam' | 'inappropriate' | 'sensitive';
  sensitivity: number;
  keywords: string[];
}

const defaultFilters: ContentFilter[] = [
  {
    id: '1',
    name: 'Anti-Harcèlement',
    description: 'Détecte les messages de harcèlement ou d\'intimidation',
    active: true,
    category: 'toxic',
    sensitivity: 0.8,
    keywords: ['harcèlement', 'intimidation', 'menace']
  },
  {
    id: '2',
    name: 'Anti-Spam',
    description: 'Filtre les messages répétitifs et les liens suspects',
    active: true,
    category: 'spam',
    sensitivity: 0.7,
    keywords: ['promo', 'achat', 'urgent']
  },
  {
    id: '3',
    name: 'Contenu Sensible',
    description: 'Détecte le contenu potentiellement déclencheur',
    active: true,
    category: 'sensitive',
    sensitivity: 0.6,
    keywords: ['dépression', 'suicide', 'automutilation']
  },
  {
    id: '4',
    name: 'Contenu Inapproprié',
    description: 'Filtre le contenu explicite ou inapproprié',
    active: true,
    category: 'inappropriate',
    sensitivity: 0.9,
    keywords: ['explicite', 'inapproprié']
  }
];

export default function CoconModerationSystem() {
  const [coconSpaces, setCoconSpaces] = useState<CoconSpace[]>([]);
  const [moderationQueue, setModerationQueue] = useState<ModerationAction[]>([]);
  const [contentFilters, setContentFilters] = useState<ContentFilter[]>(defaultFilters);
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'critical'>('all');

  useEffect(() => {
    loadCoconSpaces();
    loadModerationQueue();
  }, []);

  const loadCoconSpaces = async () => {
    try {
      const { data } = await supabase
        .from('cocon_content')
        .select(`
          *,
          profiles!cocon_content_user_id_fkey (
            name,
            avatar_url
          )
        `)
        .limit(10);

      if (data) {
        const spaces = data.reduce<CoconSpace[]>((acc, content) => {
          const spaceId = content.content_type || 'general';
          const existing = acc.find((s: CoconSpace) => s.id === spaceId);
          
          if (existing) {
            existing.stats.posts++;
          } else {
            acc.push({
              id: spaceId,
              name: content.content_type || 'Espace Général',
              description: `Espace dédié aux discussions ${content.content_type || 'générales'}`,
              members: Math.floor(Math.random() * 100) + 10,
              isPrivate: content.is_private || false,
              moderationLevel: 'medium' as const,
              keywords: content.tags || [],
              owner: {
                name: content.profiles?.name || 'Utilisateur',
                avatar: content.profiles?.avatar_url || '/placeholder-avatar.jpg'
              },
              stats: {
                posts: 1,
                reports: Math.floor(Math.random() * 5),
                activeMembers: Math.floor(Math.random() * 50) + 5
              }
            });
          }
          return acc;
        }, [] as CoconSpace[]);
        
        setCoconSpaces(spaces);
      }
    } catch (error) {
      // Cocon spaces loading error
    }
  };

  const loadModerationQueue = async () => {
    // Simulation des actions de modération
    const mockActions: ModerationAction[] = [
      {
        id: '1',
        type: 'auto_filter',
        content: {
          text: 'Message suspect détecté par IA...',
          author: 'Utilisateur123',
          space: 'Soutien Anxiété'
        },
        reason: 'Contenu potentiellement toxique détecté',
        severity: 'medium',
        status: 'pending',
        timestamp: '2 min',
        aiConfidence: 0.85
      },
      {
        id: '2',
        type: 'user_report',
        content: {
          text: 'Ce message me semble inapproprié...',
          author: 'UtilisateurABC',
          space: 'Cocon Bien-être'
        },
        reason: 'Signalé par utilisateur - Harcèlement',
        severity: 'high',
        status: 'pending',
        timestamp: '5 min',
        aiConfidence: 0.92
      }
    ];
    
    setModerationQueue(mockActions);
  };

  const handleModerationAction = async (actionId: string, decision: 'approve' | 'reject' | 'escalate') => {
    try {
      await supabase.functions.invoke('handle-moderation-action', {
        body: {
          action_id: actionId,
          decision,
          moderator_notes: 'Action automatique du système de modération'
        }
      });

      setModerationQueue(prev => prev.map(action => {
        if (action.id === actionId) {
          const newStatus = decision === 'approve' ? 'approved' : 
                           decision === 'reject' ? 'rejected' : 'escalated';
          return { ...action, status: newStatus };
        }
        return action;
      }));

      toast({
        title: "✅ Action effectuée",
        description: `L'action de modération a été ${
          decision === 'approve' ? 'approuvée' : 
          decision === 'reject' ? 'rejetée' : 'escaladée'
        }`,
      });
    } catch (error) {
      // Moderation action error
    }
  };

  const toggleFilter = async (filterId: string) => {
    setContentFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        return { ...filter, active: !filter.active };
      }
      return filter;
    }));

    toast({
      title: "🛡️ Filtre mis à jour",
      description: "Les paramètres de modération ont été sauvegardés",
    });
  };

  const updateFilterSensitivity = (filterId: string, sensitivity: number) => {
    setContentFilters(prev => prev.map(filter => {
      if (filter.id === filterId) {
        return { ...filter, sensitivity };
      }
      return filter;
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'escalated': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredQueue = moderationQueue.filter(action => {
    if (selectedSpace !== 'all' && action.content.space !== selectedSpace) return false;
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending' && action.status !== 'pending') return false;
      if (filterStatus === 'critical' && action.severity !== 'critical') return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Système de Modération Cocon
        </h1>
        <p className="text-muted-foreground">
          Intelligence artificielle et modération humaine pour des espaces sûrs
        </p>
      </div>

      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="queue">File d'attente</TabsTrigger>
          <TabsTrigger value="spaces">Espaces Cocon</TabsTrigger>
          <TabsTrigger value="filters">Filtres de contenu</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        {/* File d'attente de modération */}
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  File d'Attente de Modération
                </CardTitle>
                <div className="flex gap-2">
                  <select
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="all">Tous les espaces</option>
                    {coconSpaces.map(space => (
                      <option key={space.id} value={space.name}>{space.name}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="critical">Critique</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredQueue.map(action => (
                  <Card key={action.id} className="border-l-4 border-l-orange-400">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {action.type === 'auto_filter' ? <Zap className="h-3 w-3" /> : <Flag className="h-3 w-3" />}
                              {action.type === 'auto_filter' ? 'IA Auto' : 'Signalement'}
                            </Badge>
                            <Badge className={getSeverityColor(action.severity)}>
                              {action.severity}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(action.status)}
                              <span className="text-sm text-muted-foreground">{action.status}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">Auteur:</span>
                              <span>{action.content.author}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-medium">Espace:</span>
                              <span>{action.content.space}</span>
                              <span className="text-muted-foreground">•</span>
                              <span>{action.timestamp}</span>
                            </div>
                            
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm">{action.content.text}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Raison:</span>
                              <span className="text-sm text-muted-foreground">{action.reason}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm">
                                Confiance IA: <span className="font-medium">{Math.round(action.aiConfidence * 100)}%</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {action.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleModerationAction(action.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleModerationAction(action.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-orange-600 border-orange-600 hover:bg-orange-50"
                              onClick={() => handleModerationAction(action.id, 'escalate')}
                            >
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Escalader
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredQueue.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune action de modération en attente</p>
                    <p className="text-sm">Les espaces sont sécurisés ✨</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Espaces Cocon */}
        <TabsContent value="spaces" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coconSpaces.map(space => (
              <Card key={space.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{space.name}</CardTitle>
                        {space.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{space.description}</p>
                    </div>
                    <Badge variant={
                      space.moderationLevel === 'high' ? 'destructive' : 
                      space.moderationLevel === 'medium' ? 'default' : 'secondary'
                    }>
                      {space.moderationLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={space.owner.avatar} />
                      <AvatarFallback>{space.owner.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{space.owner.name}</div>
                      <div className="text-xs text-muted-foreground">Propriétaire</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{space.members}</div>
                      <div className="text-xs text-muted-foreground">Membres</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{space.stats.posts}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{space.stats.reports}</div>
                      <div className="text-xs text-muted-foreground">Signalements</div>
                    </div>
                  </div>
                  
                  {space.keywords.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Mots-clés surveillés:</div>
                      <div className="flex flex-wrap gap-1">
                        {space.keywords.slice(0, 3).map(keyword => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {space.keywords.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{space.keywords.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Filtres de contenu */}
        <TabsContent value="filters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres de Contenu IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contentFilters.map(filter => (
                  <div key={filter.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{filter.name}</h3>
                          <Badge variant={filter.category === 'toxic' ? 'destructive' : 'secondary'}>
                            {filter.category}
                          </Badge>
                          <Button
                            size="sm"
                            variant={filter.active ? 'default' : 'outline'}
                            onClick={() => toggleFilter(filter.id)}
                          >
                            {filter.active ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                            {filter.active ? 'Actif' : 'Inactif'}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{filter.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Sensibilité:</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(filter.sensitivity * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={filter.sensitivity}
                          onChange={(e) => updateFilterSensitivity(filter.id, parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Permissif</span>
                          <span>Strict</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Mots-clés surveillés:</div>
                        <div className="flex flex-wrap gap-1">
                          {filter.keywords.map(keyword => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytiques */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-muted-foreground">Messages analysés</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-muted-foreground">Actions de modération</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">98.5%</div>
                    <div className="text-sm text-muted-foreground">Précision IA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0.8s</div>
                    <div className="text-sm text-muted-foreground">Temps de réaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tendances de Modération (7 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Graphiques d'analytiques disponibles prochainement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}