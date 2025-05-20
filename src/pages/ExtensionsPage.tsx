
import React, { useState, useEffect } from 'react';
import Shell from '@/Shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useExtensions } from '@/contexts/ExtensionsContext';
import { Download, Search, Check, Star, ArrowUpRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ExtensionsList from '@/components/extensions/ExtensionsList';
import FeaturedExtensions from '@/components/extensions/FeaturedExtensions';
import TopExtensions from '@/components/extensions/TopExtensions';
import { ExtensionMeta } from '@/types/extensions';
import { Confetti } from '@/components/ui/confetti';

const ExtensionsPage: React.FC = () => {
  const { available, installed, toggleExtension } = useExtensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExtensions, setFilteredExtensions] = useState<ExtensionMeta[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let filtered = [...available];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ext => 
        ext.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ext.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(ext => ext.category === activeCategory);
    }
    
    setFilteredExtensions(filtered);
  }, [searchQuery, available, activeCategory]);

  const handleToggleExtension = (extension: ExtensionMeta) => {
    toggleExtension(extension.id);
    
    if (!installed.includes(extension.id)) {
      toast({
        title: "Extension activée",
        description: `${extension.name} est maintenant disponible dans votre espace`,
        variant: "success",
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      toast({
        title: "Extension désactivée",
        description: `${extension.name} a été retirée de votre espace`,
      });
    }
  };

  const handleViewDetails = (extension: ExtensionMeta) => {
    navigate(`/extensions/${extension.id}`);
  };

  // Extract unique categories
  const categories = Array.from(new Set(available.map(ext => ext.category).filter(Boolean)));

  return (
    <Shell>
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Extensions & Innovations
            </h1>
            <p className="text-muted-foreground">
              Découvrez et activez les nouveaux modules pour améliorer votre expérience
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Rechercher une extension..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
            startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
          <div className="flex gap-2 overflow-auto pb-2 no-scrollbar">
            <Button 
              variant={activeCategory === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="rounded-full whitespace-nowrap"
            >
              Toutes
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category === activeCategory ? null : category)}
                className="rounded-full whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="installed">Installées ({installed.length})</TabsTrigger>
            <TabsTrigger value="new">
              Nouvelles <Badge variant="outline" className="ml-2">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="popular">Populaires</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <FeaturedExtensions />
            <ExtensionsList 
              extensions={filteredExtensions} 
              installed={installed} 
              onToggle={handleToggleExtension}
              onViewDetails={handleViewDetails}
            />
          </TabsContent>
          
          <TabsContent value="installed">
            <ExtensionsList 
              extensions={available.filter(ext => installed.includes(ext.id))} 
              installed={installed} 
              onToggle={handleToggleExtension}
              onViewDetails={handleViewDetails} 
            />
          </TabsContent>
          
          <TabsContent value="new">
            <ExtensionsList 
              extensions={filteredExtensions.filter(ext => ext.isNew)} 
              installed={installed} 
              onToggle={handleToggleExtension}
              onViewDetails={handleViewDetails} 
            />
          </TabsContent>
          
          <TabsContent value="popular">
            <TopExtensions />
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Soumettre une idée d'extension</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vous avez une idée pour améliorer l'application ? Soumettez votre proposition et participez à l'évolution d'EmotionsCare !
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Proposer une idée
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Shell>
  );
};

export default ExtensionsPage;
