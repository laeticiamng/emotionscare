
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  Search, 
  Book, 
  Video, 
  Phone,
  Mail,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useHelpBot } from '@/hooks/useHelpBot';
import ActionButton from '@/components/buttons/ActionButton';
import { toast } from 'sonner';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const HelpCenterPage: React.FC = () => {
  const { messages, isLoading, sendMessage, clearConversation } = useHelpBot();
  const [userMessage, setUserMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    const response = await sendMessage(userMessage);
    setUserMessage('');
    
    if (response) {
      toast.success('Réponse reçue !', {
        description: `Confiance: ${Math.round(response.confidence * 100)}%`
      });
    }
  };

  const handleAskQuestion = () => {
    setShowChat(true);
    toast.info('Assistant IA activé', {
      description: 'Posez votre question ci-dessous'
    });
  };

  const faqCategories = [
    {
      name: 'Démarrage',
      icon: Book,
      color: 'bg-blue-100 text-blue-800',
      items: [
        {
          id: '1',
          question: 'Comment commencer mon premier scan d\'émotion ?',
          answer: 'Rendez-vous sur la page Scanner, cliquez sur "Scanner mon humeur" et suivez les instructions à l\'écran.',
          category: 'Démarrage',
          helpful: 45
        },
        {
          id: '2',
          question: 'Que signifient les couleurs dans mon tableau de bord ?',
          answer: 'Les couleurs représentent différents états émotionnels : bleu pour le calme, vert pour l\'énergie positive, etc.',
          category: 'Démarrage',
          helpful: 32
        }
      ]
    },
    {
      name: 'Fonctionnalités',
      icon: Video,
      color: 'bg-green-100 text-green-800',
      items: [
        {
          id: '3',
          question: 'Comment utiliser la VR Galactique ?',
          answer: 'Accédez à l\'espace VR, choisissez votre environnement et lancez une session immersive.',
          category: 'Fonctionnalités',
          helpful: 28
        },
        {
          id: '4',
          question: 'Puis-je personnaliser mes recommandations musicales ?',
          answer: 'Oui, allez dans Préférences > Musique pour ajuster vos goûts musicaux.',
          category: 'Fonctionnalités',
          helpful: 38
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Guides vidéo',
      description: 'Tutoriels étape par étape',
      icon: Video,
      action: () => toast.info('Guides vidéo à venir')
    },
    {
      title: 'Contact support',
      description: 'Contactez notre équipe',
      icon: Phone,
      action: () => toast.info('Support: contact@emotionscare.com')
    },
    {
      title: 'Documentation',
      description: 'Guide complet',
      icon: Book,
      action: () => toast.info('Documentation complète à venir')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-blue-600" />
                Centre d'aide
              </h1>
              <p className="text-gray-600 mt-2">
                Trouvez des réponses à vos questions ou contactez notre assistant IA
              </p>
            </div>
          </div>

          {/* Action principale */}
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Assistant IA instantané</h3>
                    <p className="text-gray-600">
                      Posez vos questions à notre IA spécialisée dans le bien-être
                    </p>
                  </div>
                </div>
                
                <ActionButton
                  onClick={handleAskQuestion}
                  icon={<MessageSquare className="w-5 h-5" />}
                  variant="primary"
                  size="lg"
                >
                  Poser une question
                </ActionButton>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          {showChat && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Assistant IA</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearConversation}
                    >
                      Nouvelle conversation
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowChat(false)}
                    >
                      Fermer
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Tapez votre question..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!userMessage.trim() || isLoading}
                  >
                    Envoyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
              <CardContent className="p-6 text-center">
                <action.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <category.icon className="w-6 h-6" />
                  {category.name}
                  <Badge className={category.color}>
                    {category.items.length} article{category.items.length > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="border-l-4 border-blue-200 pl-4">
                      <h4 className="font-medium mb-2">{item.question}</h4>
                      <p className="text-gray-600 text-sm mb-2">{item.answer}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {item.helpful} personnes aidées
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              Besoin d'aide supplémentaire ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Contactez-nous</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Notre équipe support est disponible pour vous aider
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    support@emotionscare.com
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Lun-Ven 9h-18h
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Ressources utiles</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Guide de démarrage rapide</li>
                  <li>• Documentation technique</li>
                  <li>• Webinaires de formation</li>
                  <li>• Communauté d'utilisateurs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenterPage;
