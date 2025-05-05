
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, MessageSquare, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SocialCocoonWidgetProps {
  className?: string;
  style?: React.CSSProperties;
}

const SocialCocoonWidget: React.FC<SocialCocoonWidgetProps> = ({ className, style }) => {
  const navigate = useNavigate();

  // Sample data for recent posts
  const recentPosts = [
    {
      id: '1',
      author: 'Utilisateur_A24',
      content: 'J\'ai essayé la micro-pause VR "Forêt zen" aujourd\'hui, vraiment efficace pour déstresser ! Quelqu\'un d\'autre l\'a testé ?',
      reactions: 5,
      comments: 3,
      time: '30 min'
    },
    {
      id: '2',
      author: 'Utilisateur_B67',
      content: 'Astuce du jour : prendre 5 minutes pour respirer profondément entre deux réunions. Ça change toute ma journée !',
      reactions: 8,
      comments: 2,
      time: '2h'
    }
  ];

  return (
    <Card className={`${className} bg-gradient-to-br from-pastel-purple/30 to-white border-white/50`} style={style}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-cocoon-600" />
          Social Cocoon
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 mb-4">
          {recentPosts.map(post => (
            <div key={post.id} className="bg-white/70 rounded-2xl p-4 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-cocoon-100 text-cocoon-800">{post.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{post.author}</p>
                  <p className="text-xs text-muted-foreground">il y a {post.time}</p>
                </div>
              </div>
              <p className="text-sm mb-3">{post.content}</p>
              <div className="flex items-center text-xs text-muted-foreground gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  <span>{post.reactions}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => navigate('/community')}
            className="flex-1 bg-cocoon-500 hover:bg-cocoon-600 text-white rounded-full"
          >
            Voir toutes les publications
          </Button>
          <Button
            onClick={() => navigate('/community/new')}
            variant="outline"
            className="rounded-full border-cocoon-200"
          >
            <MessageSquare size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialCocoonWidget;
