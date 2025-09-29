import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, Bot, User } from 'lucide-react'

interface Message {
  id: number
  sender: 'user' | 'coach'
  content: string
  timestamp: Date
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'coach',
      content: 'Bonjour ! Je suis votre coach IA personnel. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simuler une réponse du coach
    setTimeout(() => {
      const coachResponse: Message = {
        id: messages.length + 2,
        sender: 'coach',
        content: 'Je comprends votre préoccupation. Pouvez-vous me parler davantage de ce que vous ressentez ?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, coachResponse])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Coach IA</h1>
          <p className="text-lg text-muted-foreground">
            Votre assistant personnel pour le bien-être
          </p>
        </header>

        <main role="main">
          <Card className="h-[600px] flex flex-col" role="region" aria-labelledby="chat-interface">
            <CardHeader>
              <CardTitle id="chat-interface" className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                Conversation avec votre coach
              </CardTitle>
              <CardDescription>
                Partagez vos pensées et émotions en toute confidentialité
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <div 
                className="flex-1 overflow-y-auto space-y-4 mb-4" 
                role="log" 
                aria-live="polite" 
                aria-label="Historique de la conversation"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                    role="group"
                    aria-labelledby={`message-${message.id}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`} aria-label={message.sender === 'user' ? 'Utilisateur' : 'Coach IA'}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p id={`message-${message.id}`} className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2" role="group" aria-label="Zone de saisie de message">
                <Textarea
                  value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1"
                  aria-label="Tapez votre message ici"
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button 
                  onClick={sendMessage} 
                  size="icon"
                  aria-label="Envoyer le message"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}