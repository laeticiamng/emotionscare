/**
 * Time Exchange Market - Trade time and skills
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Code, 
  Music, 
  Heart, 
  Stethoscope,
  Palette,
  Languages,
  Briefcase,
  Plus,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRightLeft,
  Inbox,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTimeOffers, useTimeMarketRates, useCreateTimeOffer, useRequestTimeExchange } from '../hooks/useExchangeData';
import TimeExchangeRequests from './TimeExchangeRequests';
import type { SkillCategory, TimeOffer } from '../types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const categoryIcons = {
  tech: Code,
  music: Music,
  coaching: Heart,
  medicine: Stethoscope,
  art: Palette,
  language: Languages,
  business: Briefcase,
} as const;

const categoryLabels: Record<SkillCategory, string> = {
  tech: 'Technologie',
  music: 'Musique',
  coaching: 'Coaching',
  medicine: 'Médecine',
  art: 'Art & Design',
  language: 'Langues',
  business: 'Business',
};

const categoryColors: Record<SkillCategory, string> = {
  tech: 'from-cyan-500 to-blue-600',
  music: 'from-purple-500 to-pink-600',
  coaching: 'from-rose-500 to-red-600',
  medicine: 'from-emerald-500 to-teal-600',
  art: 'from-orange-500 to-amber-600',
  language: 'from-indigo-500 to-violet-600',
  business: 'from-gray-500 to-slate-600',
};

const TimeExchangeMarket: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
  const { data: offers, isLoading: offersLoading } = useTimeOffers(selectedCategory || undefined);
  const { data: rates, isLoading: ratesLoading } = useTimeMarketRates();
  const createOffer = useCreateTimeOffer();
  const requestExchange = useRequestTimeExchange();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exchangeDialogOffer, setExchangeDialogOffer] = useState<TimeOffer | null>(null);
  const [exchangeHours, setExchangeHours] = useState(1);
  const [newOffer, setNewOffer] = useState({
    skill_category: '' as SkillCategory,
    skill_name: '',
    description: '',
    hours_available: 1,
  });

  const handleRequestExchange = async () => {
    if (!exchangeDialogOffer || !user) {
      toast.error('Vous devez être connecté pour proposer un échange');
      return;
    }

    try {
      await requestExchange.mutateAsync({
        offerId: exchangeDialogOffer.id,
        providerId: exchangeDialogOffer.user_id,
        hours: exchangeHours,
      });
      toast.success('Demande d\'échange envoyée !');
      setExchangeDialogOffer(null);
      setExchangeHours(1);
    } catch (error) {
      toast.error('Erreur lors de la demande d\'échange');
    }
  };

  const handleCreateOffer = async () => {
    if (!newOffer.skill_category || !newOffer.skill_name) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      await createOffer.mutateAsync(newOffer);
      toast.success('Offre créée avec succès !');
      setIsDialogOpen(false);
      setNewOffer({ skill_category: '' as SkillCategory, skill_name: '', description: '', hours_available: 1 });
    } catch (error) {
      toast.error('Erreur lors de la création de l\'offre');
    }
  };

  return (
    <div className="space-y-8">
      {/* Market Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" aria-hidden="true" />
            Time Exchange
          </h2>
          <p className="text-muted-foreground">
            Échangez votre temps et vos compétences
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Proposer du temps
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Proposer votre temps</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="skill-category">Catégorie</Label>
                <Select
                  value={newOffer.skill_category}
                  onValueChange={(v) => setNewOffer(prev => ({ ...prev, skill_category: v as SkillCategory }))}
                >
                  <SelectTrigger id="skill-category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skill-name">Compétence</Label>
                <Input
                  id="skill-name"
                  value={newOffer.skill_name}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, skill_name: e.target.value }))}
                  placeholder="Ex: Développement React"
                />
              </div>
              <div>
                <Label htmlFor="skill-description">Description</Label>
                <Textarea
                  id="skill-description"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez ce que vous proposez..."
                />
              </div>
              <div>
                <Label htmlFor="hours-available">Heures disponibles</Label>
                <Input
                  id="hours-available"
                  type="number"
                  value={newOffer.hours_available}
                  onChange={(e) => setNewOffer(prev => ({ ...prev, hours_available: parseFloat(e.target.value) }))}
                  min={0.5}
                  step={0.5}
                />
              </div>
              <Button 
                onClick={handleCreateOffer} 
                className="w-full"
                disabled={createOffer.isPending}
              >
                {createOffer.isPending ? 'Création...' : 'Publier l\'offre'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Tabs: Market / My Requests */}
      <Tabs defaultValue="market">
        <TabsList>
          <TabsTrigger value="market">
            <Clock className="w-4 h-4 mr-2" />
            Marché
          </TabsTrigger>
          <TabsTrigger value="incoming">
            <Inbox className="w-4 h-4 mr-2" />
            Demandes reçues
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            <Send className="w-4 h-4 mr-2" />
            Mes demandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6 mt-6">
          {/* Market Rates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Taux du marché</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {ratesLoading ? (
                [...Array(7)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-24" />
                  </Card>
                ))
              ) : rates?.map((rate) => {
                const Icon = categoryIcons[rate.category as SkillCategory];
                const color = categoryColors[rate.category as SkillCategory];
                const TrendIcon = rate.trend === 'up' ? TrendingUp : rate.trend === 'down' ? TrendingDown : Minus;
                const trendColor = rate.trend === 'up' ? 'text-emerald-500' : rate.trend === 'down' ? 'text-rose-500' : 'text-muted-foreground';
                
                return (
                  <Card 
                    key={rate.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCategory === rate.category ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedCategory(
                      selectedCategory === rate.category ? null : rate.category as SkillCategory
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(
                      selectedCategory === rate.category ? null : rate.category as SkillCategory
                    )}
                    aria-label={`Filtrer par ${categoryLabels[rate.category as SkillCategory]}`}
                    aria-pressed={selectedCategory === rate.category}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
                        <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <p className="text-xs font-medium truncate">
                        {categoryLabels[rate.category as SkillCategory]}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="font-bold">{rate.current_rate}x</span>
                        <TrendIcon className={`w-3 h-3 ${trendColor}`} aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Available Offers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Offres disponibles
                {selectedCategory && (
                  <Badge variant="secondary" className="ml-2">
                    {categoryLabels[selectedCategory]}
                  </Badge>
                )}
              </h3>
              {selectedCategory && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCategory(null)}
                  aria-label="Effacer le filtre"
                >
                  Effacer le filtre
                </Button>
              )}
            </div>

            {offersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-48" />
                  </Card>
                ))}
              </div>
            ) : offers && offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer, index) => {
                  const Icon = categoryIcons[offer.skill_category as SkillCategory];
                  const color = categoryColors[offer.skill_category as SkillCategory];
                  
                  return (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className={`h-1 bg-gradient-to-r ${color}`} />
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className={`bg-gradient-to-br ${color} text-white`}>
                                <Icon className="w-6 h-6" aria-hidden="true" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <CardTitle className="text-base">{offer.skill_name}</CardTitle>
                              <Badge variant="outline" className="capitalize mt-1">
                                {categoryLabels[offer.skill_category as SkillCategory]}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {offer.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {offer.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                              <span className="font-medium">{offer.hours_available}h</span>
                              <span className="text-sm text-muted-foreground">disponibles</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
                              <span className="font-medium">{offer.rating}</span>
                              <span className="text-xs text-muted-foreground">({offer.reviews_count})</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm text-muted-foreground">Valeur</span>
                            <span className="font-bold text-lg">{offer.time_value}x</span>
                          </div>

                          <Button 
                            className={`w-full bg-gradient-to-r ${color}`}
                            aria-label={`Proposer un échange pour ${offer.skill_name}`}
                            onClick={() => {
                              setExchangeDialogOffer(offer);
                              setExchangeHours(1);
                            }}
                            disabled={offer.user_id === user?.id}
                          >
                            <ArrowRightLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                            {offer.user_id === user?.id ? 'Votre offre' : 'Proposer un échange'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
                <h3 className="font-semibold mb-2">Aucune offre disponible</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedCategory 
                    ? `Aucune offre dans la catégorie ${categoryLabels[selectedCategory]}`
                    : 'Soyez le premier à proposer votre temps'}
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Créer une offre
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="incoming" className="mt-6">
          <TimeExchangeRequests type="incoming" />
        </TabsContent>

        <TabsContent value="outgoing" className="mt-6">
          <TimeExchangeRequests type="outgoing" />
        </TabsContent>
      </Tabs>

      {/* Exchange Request Dialog */}
      <Dialog open={!!exchangeDialogOffer} onOpenChange={(open) => !open && setExchangeDialogOffer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proposer un échange</DialogTitle>
          </DialogHeader>
          {exchangeDialogOffer && (
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">{exchangeDialogOffer.skill_name}</p>
                <p className="text-sm text-muted-foreground">
                  {categoryLabels[exchangeDialogOffer.skill_category as SkillCategory]}
                </p>
                <p className="text-sm mt-2">
                  Disponible: {exchangeDialogOffer.hours_available}h
                </p>
              </div>
              <div>
                <Label htmlFor="exchange-hours">Heures demandées</Label>
                <Input
                  id="exchange-hours"
                  type="number"
                  value={exchangeHours}
                  onChange={(e) => setExchangeHours(parseFloat(e.target.value) || 1)}
                  min={0.5}
                  max={exchangeDialogOffer.hours_available}
                  step={0.5}
                />
              </div>
              <Button 
                onClick={handleRequestExchange}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600"
                disabled={requestExchange.isPending || exchangeHours > exchangeDialogOffer.hours_available}
              >
                {requestExchange.isPending ? 'Envoi...' : 'Envoyer la demande'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimeExchangeMarket;
