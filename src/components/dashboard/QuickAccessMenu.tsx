
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Music, Headphones, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickAccessMenu: React.FC = () => {
  const navigate = useNavigate();
  
  const quickAccess = [
    {
      id: 'journal',
      name: 'Journal',
      path: '/journal',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Notez vos pensées et émotions'
    },
    {
      id: 'music',
      name: 'Musique',
      path: '/music',
      icon: <Music className="h-5 w-5" />,
      description: 'Écoutez nos playlists thérapeutiques'
    },
    {
      id: 'audio',
      name: 'Audio',
      path: '/audio',
      icon: <Headphones className="h-5 w-5" />,
      description: 'Méditations et exercices guidés'
    },
    {
      id: 'coach',
      name: 'Coach',
      path: '/coach',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'Discutez avec votre coach AI'
    }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Accès rapide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickAccess.map((item, index) => (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center justify-center p-4 gap-2 text-center"
                onClick={() => navigate(item.path)}
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccessMenu;
