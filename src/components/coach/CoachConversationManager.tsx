import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MessageCircle,
  MoreVertical,
  Trash2,
  Download,
  Share2,
  Edit2,
  Search,
  Plus,
} from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  emotion: string;
  messageCount: number;
  isDraft?: boolean;
}

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    title: 'Discussion sur mon anxiété',
    preview: 'Je me sens vraiment stressé par ma présentation...',
    date: 'Aujourd\'hui à 14:32',
    emotion: 'Anxieté',
    messageCount: 12,
  },
  {
    id: '2',
    title: 'Conseil bien-être',
    preview: 'Comment puis-je mieux gérer mon sommeil?',
    date: 'Hier à 20:15',
    emotion: 'Neutre',
    messageCount: 8,
  },
  {
    id: '3',
    title: 'Gestion du stress professionnel',
    preview: 'Mon travail m\'épuise ces derniers temps...',
    date: '3 jours ago',
    emotion: 'Triste',
    messageCount: 15,
  },
  {
    id: '4',
    title: 'Joie et gratitude',
    preview: 'J\'ai reçu une excellente nouvelle!',
    date: '1 semaine',
    emotion: 'Joie',
    messageCount: 6,
    isDraft: true,
  },
];

const EMOTION_COLORS = {
  'Joie': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'Triste': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  'Anxiété': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  'Calme': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  'Neutre': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  'Colère': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
};

export const CoachConversationManager = () => {
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareConversationId, setShareConversationId] = useState<string | null>(null);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.emotion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    setDeleteId(null);
  };

  const handleRename = (id: string, newTitle: string) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, title: newTitle } : conv
      )
    );
    setSelectedConversation(null);
  };

  const handleExport = (conversation: Conversation) => {
    const exportData = {
      title: conversation.title,
      date: conversation.date,
      emotion: conversation.emotion,
      messages: conversation.messageCount,
      exportedAt: new Date().toISOString(),
      content: `Conversation: ${conversation.title}\nÉmotion: ${conversation.emotion}\nDate: ${conversation.date}`,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${conversation.id}-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6 w-full">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              Mes conversations
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Gérez, recherchez et revisitez vos discussions avec Coach
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle conversation
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Rechercher par titre, contenu ou émotion..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="cursor-pointer">
          Tous ({conversations.length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Brouillons ({conversations.filter((c) => c.isDraft).length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Cette semaine ({conversations.slice(0, 2).length})
        </Badge>
      </div>

      {/* Liste des conversations */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {conversation.title}
                    </h3>
                    {conversation.isDraft && (
                      <Badge variant="secondary" className="text-xs">
                        Brouillon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                    {conversation.preview}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                    <span>{conversation.date}</span>
                    <span>•</span>
                    <span>{conversation.messageCount} messages</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge
                    className={`${EMOTION_COLORS[conversation.emotion as keyof typeof EMOTION_COLORS] || EMOTION_COLORS['Neutre']}`}
                  >
                    {conversation.emotion}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSelectedConversation(conversation)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Renommer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport(conversation)}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setShareConversationId(conversation.id);
                          setShowShareDialog(true);
                        }}
                        className="gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Partager
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(conversation.id)}
                        className="gap-2 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
            Aucune conversation trouvée
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Commencez une nouvelle conversation pour voir vos interactions ici.
          </p>
        </div>
      )}

      {/* Dialog de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. La conversation sera supprimée définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de partage */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partager la conversation</DialogTitle>
            <DialogDescription>
              Générez un lien sécurisé pour partager cette conversation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Lien de partage</p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`emotionscare.com/share/${shareConversationId}`}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `emotionscare.com/share/${shareConversationId}`
                    );
                  }}
                >
                  Copier
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Permissions d'accès</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="radio" id="private" name="access" defaultChecked />
                  <label htmlFor="private" className="text-sm cursor-pointer">
                    Privé (uniquement pour moi)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="public" name="access" />
                  <label htmlFor="public" className="text-sm cursor-pointer">
                    Lien public (lecture seule)
                  </label>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowShareDialog(false)} className="w-full">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
