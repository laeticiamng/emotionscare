
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, Send, MessageCircle, Lightbulb, Target, Calendar } from 'lucide-react';

const B2CCoach: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'coach',
      message: 'Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous aider aujourd\'hui à améliorer votre bien-être émotionnel ?',
      timestamp: '10:30'
    }
  ]);

  const coaches = [
    {
      id: 'emma',
      name: 'Emma',
      specialty: 'Gestion du stress',
      avatar: '/api/placeholder/40/40',
      status: 'active',
      description: 'Spécialiste en techniques de relaxation et mindfulness'
    },
    {
      id: 'alex',
      name: 'Alex',
      specialty: 'Motivation',
      avatar: '/api/placeholder/40/40',
      status: 'available',
      description: 'Expert en développement personnel et confiance en soi'
    },
    {
      id: 'luna',
      name: 'Luna',
      specialty: 'Sommeil',
      avatar: '/api/placeholder/40/40',
      status: 'available',
      description: 'Conseillère en hygiène du sommeil et récupération'
    }
  ];

  const quickActions = [
    {
      icon: Target,
      title: 'Définir un objectif',
      description: 'Créer un plan personnalisé'
    },
    {
      icon: Calendar,
      title: 'Planifier ma journée',
      description: 'Optimiser votre routine'
    },
    {
      icon: Lightbulb,
      title: 'Conseil du jour',
      description: 'Recommandation personnalisée'
    }
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');

    // Simulate coach response
    setTimeout(() => {
      const coachResponse = {
        id: chatHistory.length + 2,
        sender: 'coach',
        message: 'Je comprends votre situation. Voici quelques stratégies que nous pouvons explorer ensemble...',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, coachResponse]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Coach IA Personnel
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Votre guide intelligent pour un bien-être optimal
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Coaches disponibles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vos Coaches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coaches.map((coach) => (
                  <div key={coach.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={coach.avatar} />
                      <AvatarFallback>{coach.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{coach.name}</p>
                        <Badge 
                          variant={coach.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {coach.status === 'active' ? 'Actif' : 'Disponible'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{coach.specialty}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 text-left"
                  >
                    <action.icon className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat principale */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-green-100 text-green-700">E</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Emma - Coach Bien-être</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">En ligne • Spécialiste stress</p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatHistory.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm">
                    😔 Je me sens triste
                  </Button>
                  <Button variant="outline" size="sm">
                    😰 Je suis stressé
                  </Button>
                  <Button variant="outline" size="sm">
                    💪 J'ai besoin de motivation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CCoach;
