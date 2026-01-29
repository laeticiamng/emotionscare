/**
 * MarketplaceBrowser - Navigation et découverte des programmes
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Users, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '../hooks/useMarketplace';
import type { Program, ProgramCategory } from '../types';

const CATEGORY_LABELS: Record<ProgramCategory, string> = {
  stress_management: 'Gestion du stress',
  anxiety_relief: 'Soulagement anxiété',
  sleep_improvement: 'Amélioration sommeil',
  emotional_regulation: 'Régulation émotionnelle',
  burnout_prevention: 'Prévention burn-out',
  mindfulness: 'Pleine conscience',
  breathing_techniques: 'Techniques respiratoires',
  resilience_building: 'Renforcement résilience'
};

interface ProgramCardProps {
  program: Program;
  onSelect: (program: Program) => void;
}

const ProgramCardItem: React.FC<ProgramCardProps> = ({ program, onSelect }) => {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cents / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="h-full cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group"
        onClick={() => onSelect(program)}
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={program.cover_image_url || '/placeholder.svg'} 
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {program.is_featured && (
            <Badge className="absolute top-2 left-2 bg-primary">
              Recommandé
            </Badge>
          )}
          <Badge variant="secondary" className="absolute top-2 right-2">
            {program.format === 'audio' ? '🎧 Audio' : 
             program.format === 'video' ? '🎬 Vidéo' : 
             program.format === 'pdf' ? '📄 PDF' : '📚 Programme'}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{program.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {program.short_description}
          </p>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>{program.rating.toFixed(1)}</span>
              <span>({program.review_count})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{program.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{program.total_purchases}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {program.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {program.creator?.avatar_url && (
              <img 
                src={program.creator.avatar_url} 
                alt={program.creator.display_name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span className="text-sm text-muted-foreground">
              {program.creator?.display_name}
            </span>
          </div>
          <span className="font-bold text-primary">
            {formatPrice(program.price_cents)}
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const MarketplaceBrowser: React.FC = () => {
  const { 
    programs, 
    featuredPrograms,
    categories,
    filters,
    isLoading,
    searchPrograms,
    filterByCategory,
    updateFilters
  } = useMarketplace();

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchPrograms(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Marketplace Créateurs
          </motion.h1>
          <p className="text-xl text-muted-foreground mb-8">
            Programmes thérapeutiques créés par des experts certifiés
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un programme..." 
                className="pl-10 h-12"
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" className="h-12 px-4">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <Button 
            variant={!filters.category ? "default" : "outline"}
            onClick={() => filterByCategory(undefined)}
            className="whitespace-nowrap"
          >
            Tous
          </Button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Button 
              key={key}
              variant={filters.category === key ? "default" : "outline"}
              onClick={() => filterByCategory(key as ProgramCategory)}
              className="whitespace-nowrap"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Featured Section */}
        {featuredPrograms.length > 0 && !filters.category && !filters.searchQuery && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Programmes recommandés</h2>
              <Button variant="ghost" className="gap-2">
                Voir tout <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrograms.slice(0, 3).map(program => (
                <ProgramCardItem 
                  key={program.id} 
                  program={program} 
                  onSelect={setSelectedProgram}
                />
              ))}
            </div>
          </section>
        )}

        {/* Sort & Filter Bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {programs.length} programme{programs.length > 1 ? 's' : ''} trouvé{programs.length > 1 ? 's' : ''}
          </p>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value) => updateFilters({ sortBy: value as any })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="rating">Mieux notés</SelectItem>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
              <SelectItem value="price_desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Programs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Aucun programme trouvé</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                filterByCategory(undefined);
                searchPrograms('');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map(program => (
              <ProgramCardItem 
                key={program.id} 
                program={program} 
                onSelect={setSelectedProgram}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceBrowser;
