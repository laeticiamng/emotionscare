// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  Search, Filter, TrendingUp, Users, MessageSquare, Star,
  Bug, Lightbulb, Heart, Plus, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import { FeedbackEntry, QualityMetrics } from '@/types/feedback';

interface FeedbackDashboardProps {
  feedbacks: FeedbackEntry[];
  metrics: QualityMetrics;
  onStatusChange: (id: string, status: FeedbackEntry['status']) => void;
}

const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({
  feedbacks,
  metrics,
  onStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const feedbackTypeIcons = {
    bug: { icon: Bug, color: 'text-red-500', bg: 'bg-red-50' },
    suggestion: { icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    compliment: { icon: Heart, color: 'text-green-500', bg: 'bg-green-50' },
    feature_request: { icon: Plus, color: 'text-blue-500', bg: 'bg-blue-50' }
  };

  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    reviewed: { label: 'Examiné', color: 'bg-blue-100 text-blue-800', icon: MessageSquare },
    in_progress: { label: 'En cours', color: 'bg-purple-100 text-purple-800', icon: TrendingUp },
    resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || feedback.type === filterType;
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Données pour les graphiques
  const typeDistribution = Object.keys(feedbackTypeIcons).map(type => ({
    name: type,
    value: feedbacks.filter(f => f.type === type).length,
    color: type === 'bug' ? '#ef4444' : type === 'suggestion' ? '#eab308' : 
           type === 'compliment' ? '#22c55e' : '#3b82f6'
  }));

  const statusDistribution = Object.keys(statusConfig).map(status => ({
    name: status,
    value: feedbacks.filter(f => f.status === status).length
  }));

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length
  }));

  const monthlyFeedbacks = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString('fr-FR', { month: 'short' });
    return {
      month: monthKey,
      count: Math.floor(Math.random() * 20) + 5 // Données de démonstration
    };
  }).reverse();

  return (
    <div className="space-y-6">
      {/* Métriques de qualité */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score de satisfaction</p>
                <p className="text-2xl font-bold">{metrics.satisfaction_score}%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score NPS</p>
                <p className="text-2xl font-bold">{metrics.nps_score}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'adoption</p>
                <p className="text-2xl font-bold">{metrics.feature_adoption_rate}%</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Feedbacks</p>
                <p className="text-2xl font-bold">{feedbacks.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évolution mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyFeedbacks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedbacks" className="space-y-4">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher dans les feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="bug">Bugs</SelectItem>
                <SelectItem value="suggestion">Suggestions</SelectItem>
                <SelectItem value="compliment">Compliments</SelectItem>
                <SelectItem value="feature_request">Demandes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="reviewed">Examiné</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
                <SelectItem value="closed">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des feedbacks */}
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => {
              const typeConfig = feedbackTypeIcons[feedback.type];
              const StatusIcon = statusConfig[feedback.status].icon;
              
              return (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${typeConfig.bg}`}>
                        <typeConfig.icon className={`h-4 w-4 ${typeConfig.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{feedback.title}</h3>
                          <Badge className={statusConfig[feedback.status].color}>
                            {statusConfig[feedback.status].label}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: feedback.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feedback.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Module: {feedback.module}</span>
                          <span>{new Date(feedback.created_at).toLocaleDateString('fr-FR')}</span>
                          {feedback.tags && feedback.tags.length > 0 && (
                            <div className="flex gap-1">
                              {feedback.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Select
                      value={feedback.status}
                      onValueChange={(status: any) => onStatusChange(feedback.id, status)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              <config.icon className="h-3 w-3" />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statuts des feedbacks</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackDashboard;
