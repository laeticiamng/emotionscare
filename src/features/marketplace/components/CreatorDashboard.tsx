/**
 * CreatorDashboard - Tableau de bord pour les créateurs
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Package, 
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useCreatorDashboard } from '../hooks/useCreatorDashboard';
import type { Program, ProgramStatus } from '../types';

const STATUS_CONFIG: Record<ProgramStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: 'Brouillon', color: 'bg-gray-500', icon: <FileText className="h-4 w-4" /> },
  pending_review: { label: 'En révision', color: 'bg-yellow-500', icon: <Clock className="h-4 w-4" /> },
  published: { label: 'Publié', color: 'bg-green-500', icon: <CheckCircle className="h-4 w-4" /> },
  archived: { label: 'Archivé', color: 'bg-red-500', icon: <AlertCircle className="h-4 w-4" /> }
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  subtitle?: string;
}> = ({ title, value, icon, trend, subtitle }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 ${!trend.positive && 'rotate-180'}`} />
              <span>{trend.positive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProgramRow: React.FC<{
  program: Program;
  onEdit: (program: Program) => void;
  onSubmit: (programId: string) => void;
}> = ({ program, onEdit, onSubmit }) => {
  const status = STATUS_CONFIG[program.status];
  const formatPrice = (cents: number) => (cents / 100).toFixed(2) + ' €';

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <img 
          src={program.cover_image_url || '/placeholder.svg'} 
          alt={program.title}
          className="w-16 h-12 rounded object-cover"
        />
        <div>
          <h4 className="font-medium">{program.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className={`${status.color} text-white`}>
              {status.icon}
              <span className="ml-1">{status.label}</span>
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatPrice(program.price_cents)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">{program.total_purchases} ventes</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            {program.rating.toFixed(1)} ({program.review_count})
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(program)}>
            Modifier
          </Button>
          {program.status === 'draft' && (
            <Button size="sm" onClick={() => onSubmit(program.id)}>
              Soumettre
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const CreatorDashboard: React.FC = () => {
  const { 
    creator, 
    stats, 
    programs, 
    payouts,
    isLoading,
    submitForReview,
    requestPayout
  } = useCreatorDashboard();

  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Devenez créateur</CardTitle>
            <CardDescription>
              Partagez votre expertise et générez des revenus en créant des programmes thérapeutiques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Postuler comme créateur
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={creator.avatar_url || '/placeholder.svg'} 
                alt={creator.display_name}
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
              <div>
                <h1 className="text-2xl font-bold">{creator.display_name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  {creator.badges.map((badge, i) => (
                    <Badge key={i} variant="secondary">
                      {badge.type === 'bestseller' ? '🏆 Bestseller' :
                       badge.type === 'recommended' ? '⭐ Recommandé' :
                       badge.type === 'top_rated' ? '💫 Top noté' : '✓ Expert vérifié'}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau programme
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="programs">Programmes</TabsTrigger>
            <TabsTrigger value="earnings">Revenus</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard 
                title="Revenus totaux"
                value={formatCurrency(stats?.total_revenue || 0)}
                icon={<DollarSign className="h-6 w-6 text-primary" />}
                trend={{ value: 12, positive: true }}
              />
              <StatCard 
                title="Ventes ce mois"
                value={stats?.this_month_sales || 0}
                icon={<TrendingUp className="h-6 w-6 text-primary" />}
                subtitle={formatCurrency(stats?.this_month_revenue || 0)}
              />
              <StatCard 
                title="Programmes publiés"
                value={`${stats?.published_programs || 0}/${stats?.total_programs || 0}`}
                icon={<Package className="h-6 w-6 text-primary" />}
              />
              <StatCard 
                title="Note moyenne"
                value={stats?.average_rating?.toFixed(1) || '—'}
                icon={<Star className="h-6 w-6 text-yellow-500" />}
                subtitle={`${stats?.total_reviews || 0} avis`}
              />
            </div>

            {/* Pending Payout */}
            {(stats?.pending_payout || 0) > 0 && (
              <Card className="mb-8 border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Solde disponible</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(stats?.pending_payout || 0)}
                      </p>
                    </div>
                    <Button onClick={() => requestPayout()} className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Demander un virement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Programs */}
            <Card>
              <CardHeader>
                <CardTitle>Programmes récents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {programs.slice(0, 5).map(program => (
                  <ProgramRow 
                    key={program.id}
                    program={program}
                    onEdit={() => {}}
                    onSubmit={submitForReview}
                  />
                ))}
                {programs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun programme créé. Commencez maintenant !
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tous les programmes</CardTitle>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouveau
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {programs.map(program => (
                  <ProgramRow 
                    key={program.id}
                    program={program}
                    onEdit={() => {}}
                    onSubmit={submitForReview}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des paiements</CardTitle>
                </CardHeader>
                <CardContent>
                  {payouts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun paiement effectué
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {payouts.map(payout => (
                        <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{formatCurrency(payout.amount_cents)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(payout.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant={
                            payout.status === 'completed' ? 'default' :
                            payout.status === 'processing' ? 'secondary' : 'outline'
                          }>
                            {payout.status === 'completed' ? 'Effectué' :
                             payout.status === 'processing' ? 'En cours' : 'En attente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorDashboard;
