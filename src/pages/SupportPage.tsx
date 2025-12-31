// @ts-nocheck
/**
 * SupportPage - Support Client EmotionsCare
 * SEO, accessibilité, navigation, formulaire enrichi
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Mail, FileQuestion, Home, HelpCircle, Shield, ArrowRight, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';

export default function SupportPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    email: '',
  });

  usePageSEO({
    title: 'Support Client - EmotionsCare',
    description: 'Contactez notre équipe support. Chat en direct, email ou formulaire. Réponse garantie sous 24h.',
    keywords: ['support', 'aide', 'contact', 'EmotionsCare', 'assistance'],
  });

  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message envoyé !',
      description: 'Notre équipe vous répondra dans les 24h.',
    });
    setFormData({ subject: '', category: '', message: '', email: '' });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation support" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/"><Home className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Accueil</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-semibold">Support</span>
              </div>
              <Badge variant="outline" className="hidden md:inline-flex gap-1 text-success border-success/30">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Réponse &lt;24h
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/help">Centre d'aide</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/faq">FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Support Client</h1>
            <p className="text-muted-foreground">Nous sommes là pour vous aider</p>
          </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle>Chat en Direct</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Assistance immédiate par chat
              </p>
              <Button className="w-full">Démarrer le Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                support@emotionscare.com
              </p>
              <Button variant="outline" className="w-full">
                Envoyer un Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <FileQuestion className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Questions fréquentes
              </p>
              <Button variant="outline" className="w-full">
                Consulter la FAQ
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Envoyer un Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Problème technique</SelectItem>
                      <SelectItem value="billing">Facturation</SelectItem>
                      <SelectItem value="feature">Suggestion</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  placeholder="Décrivez brièvement votre demande"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Détaillez votre demande..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Envoyer le Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
