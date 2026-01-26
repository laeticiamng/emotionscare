// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarDays, Mail, Shield, AlertTriangle, CheckCircle, Clock,
  MessageSquare, Ban, UserCheck, Plus, X, History, Activity,
  TrendingUp, MoreVertical, Trash2, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  anonymity_code: string;
  joined_at?: string;
  last_active?: string;
  emotional_score?: number;
  avatar?: string;
  status?: 'active' | 'suspended' | 'inactive';
  tags?: string[];
}

interface ActivityItem {
  id: string;
  type: 'session' | 'checkin' | 'achievement' | 'note' | 'warning';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface AdminNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface UserProfileProps {
  user: User;
  activities?: ActivityItem[];
  adminNotes?: AdminNote[];
  onAddNote?: (note: { content: string; priority: string }) => void;
  onDeleteNote?: (noteId: string) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  onSuspendUser?: () => void;
  onActivateUser?: () => void;
  onSendMessage?: (message: string) => void;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'session', title: 'Session de méditation', description: '15 minutes de méditation guidée', timestamp: new Date().toISOString() },
  { id: '2', type: 'checkin', title: 'Check-in émotionnel', description: 'Humeur: Bien (4/5)', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', type: 'achievement', title: 'Badge débloqué', description: '7 jours consécutifs', timestamp: new Date(Date.now() - 86400000).toISOString() },
];

const MOCK_NOTES: AdminNote[] = [
  { id: '1', content: 'Utilisateur très engagé, candidat pour programme ambassadeur.', author: 'Admin', createdAt: new Date(Date.now() - 86400000).toISOString(), priority: 'medium' },
];

const SUGGESTED_TAGS = ['VIP', 'Beta Tester', 'Support', 'Ambassadeur', 'Nouveau', 'À surveiller'];

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  activities = MOCK_ACTIVITIES,
  adminNotes = MOCK_NOTES,
  onAddNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag,
  onSuspendUser,
  onActivateUser,
  onSendMessage,
}) => {
  const [newNote, setNewNote] = useState('');
  const [notePriority, setNotePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return formatDate(dateString);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Determine emotional score color
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-300';
    
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'session': return <Activity className="h-4 w-4 text-green-500" />;
      case 'checkin': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'achievement': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'note': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote?.({ content: newNote, priority: notePriority });
    setNewNote('');
    toast({ title: '📝 Note ajoutée', description: 'La note admin a été enregistrée.' });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    onAddTag?.(newTag);
    setNewTag('');
    setShowTagInput(false);
    toast({ title: '🏷️ Tag ajouté', description: `Le tag "${newTag}" a été ajouté.` });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage?.(message);
    setMessage('');
    toast({ title: '✉️ Message envoyé', description: 'Le message a été envoyé à l\'utilisateur.' });
  };

  return (
    <div className="space-y-4">
      {/* Main Profile Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Profil utilisateur</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSendMessage?.('')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Envoyer un message
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.status === 'suspended' ? (
                  <DropdownMenuItem onClick={onActivateUser}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Réactiver le compte
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={onSuspendUser} className="text-destructive">
                    <Ban className="h-4 w-4 mr-2" />
                    Suspendre le compte
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            {user.status && (
              <Badge 
                variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
              >
                {user.status === 'active' ? 'Actif' : user.status === 'suspended' ? 'Suspendu' : 'Inactif'}
              </Badge>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Badge>{user.role}</Badge>
            {user.role === 'admin' && <Shield className="h-4 w-4 text-primary" />}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4 justify-center">
            {(user.tags || []).map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                {tag}
                <button onClick={() => onRemoveTag?.(tag)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {showTagInput ? (
              <div className="flex gap-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tag..."
                  className="h-6 w-24 text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button size="sm" className="h-6 px-2" onClick={handleAddTag}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="h-6 px-2" onClick={() => setShowTagInput(true)}>
                <Plus className="h-3 w-3 mr-1" />
                Tag
              </Button>
            )}
          </div>

          {/* Suggested tags */}
          {showTagInput && (
            <div className="flex flex-wrap gap-1 mb-4">
              {SUGGESTED_TAGS.filter(t => !user.tags?.includes(t)).map((tag) => (
                <Button 
                  key={tag} 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 text-xs"
                  onClick={() => {
                    onAddTag?.(tag);
                    toast({ title: '🏷️ Tag ajouté', description: `Le tag "${tag}" a été ajouté.` });
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
          
          {user.emotional_score !== undefined && (
            <div className="mb-6 flex flex-col items-center">
              <div className="text-sm text-muted-foreground mb-2">Score émotionnel</div>
              <div className="relative h-24 w-24 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full ${getScoreColor(user.emotional_score)} opacity-20`}></div>
                <div className="text-4xl font-bold">{user.emotional_score}</div>
              </div>
              <Progress value={user.emotional_score} className="w-full mt-2 h-2" />
            </div>
          )}
          
          <div className="w-full pt-4 border-t space-y-3">
            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">Code anonyme:</div>
              <div className="font-medium font-mono">{user.anonymity_code}</div>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>Inscription:</span>
              </div>
              <div className="font-medium">{formatDate(user.joined_at)}</div>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">Dernière activité:</div>
              <div className="font-medium">{formatDate(user.last_active)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Activity & Notes */}
      <Card>
        <Tabs defaultValue="activity">
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">
                <History className="h-4 w-4 mr-1" />
                Activité
              </TabsTrigger>
              <TabsTrigger value="notes">
                <MessageSquare className="h-4 w-4 mr-1" />
                Notes ({adminNotes.length})
              </TabsTrigger>
              <TabsTrigger value="message">
                <Send className="h-4 w-4 mr-1" />
                Message
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="pt-4">
            {/* Activity Timeline */}
            <TabsContent value="activity" className="mt-0">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 relative"
                  >
                    {index < activities.length - 1 && (
                      <div className="absolute left-[11px] top-8 w-0.5 h-full bg-border" />
                    )}
                    <div className="p-1 bg-background rounded-full border z-10">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm truncate">{activity.title}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Admin Notes */}
            <TabsContent value="notes" className="mt-0 space-y-4">
              {/* Add note */}
              <div className="space-y-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ajouter une note admin..."
                  className="min-h-[80px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <Button
                        key={p}
                        variant={notePriority === p ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setNotePriority(p)}
                        className={`h-7 ${
                          p === 'high' ? 'text-red-500' : 
                          p === 'medium' ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}
                      >
                        {p === 'high' ? 'Haute' : p === 'medium' ? 'Moyenne' : 'Basse'}
                      </Button>
                    ))}
                  </div>
                  <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Notes list */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {adminNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-3 rounded-lg border-l-4 bg-muted/30 ${
                        note.priority === 'high' ? 'border-l-red-500' :
                        note.priority === 'medium' ? 'border-l-yellow-500' :
                        'border-l-green-500'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm">{note.content}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => onDeleteNote?.(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{note.author}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(note.createdAt)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Send Message */}
            <TabsContent value="message" className="mt-0 space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Envoyer un message à l'utilisateur..."
                className="min-h-[120px]"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </Button>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};
