
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useExtensions } from '@/providers/ExtensionsProvider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Filter, Package, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';
import { useToast } from '@/hooks/use-toast';
import StatusIndicator from '@/components/ui/status/StatusIndicator';

const ExtensionsPage: React.FC = () => {
  const { available, installed, toggleExtension } = useExtensions();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredExtensions = available.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ext.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || ext.category === category;
    return matchesSearch && matchesCategory;
  });
  
  const handleInstallToggle = (extId: string, isInstalled: boolean) => {
    toggleExtension(extId);
    toast({
      title: isInstalled ? "Extension désinstallée" : "Extension installée",
      description: isInstalled ? 
        "L'extension a été retirée avec succès." : 
        "L'extension a été ajoutée à votre espace. Rafraîchissez pour voir les nouvelles fonctionnalités.",
      variant: isInstalled ? "info" : "success",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Shell>
      <div className="container mx-auto py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
                Marketplace d'extensions
              </h1>
              <p className="text-muted-foreground mt-1">
                Découvrez et intégrez de nouvelles fonctionnalités pour personnaliser votre expérience
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="beta" className="text-sm">
                <Star className="h-3 w-3 mr-1" />
                Early Access
              </Badge>
            </div>
          </div>

          {loading ? (
            <StatusIndicator 
              type="loading" 
              title="Chargement des extensions" 
              message="Veuillez patienter pendant que nous récupérons les dernières extensions disponibles..." 
            />
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher une extension..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrer
                </Button>
              </div>

              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setCategory('all')}>Toutes</TabsTrigger>
                  <TabsTrigger value="installed" onClick={() => setCategory('all')}>Installées</TabsTrigger>
                  <TabsTrigger value="new" onClick={() => setCategory('all')}>Nouveautés</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <motion.div 
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredExtensions.map((ext) => (
                      <ExtensionCard 
                        key={ext.id}
                        extension={ext}
                        isInstalled={installed.includes(ext.id)}
                        onToggle={handleInstallToggle}
                      />
                    ))}
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="installed">
                  <motion.div 
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredExtensions
                      .filter(ext => installed.includes(ext.id))
                      .map((ext) => (
                        <ExtensionCard 
                          key={ext.id}
                          extension={ext}
                          isInstalled={true}
                          onToggle={handleInstallToggle}
                        />
                      ))
                    }
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="new">
                  <motion.div 
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredExtensions
                      .filter(ext => ext.isNew)
                      .map((ext) => (
                        <ExtensionCard 
                          key={ext.id}
                          extension={ext}
                          isInstalled={installed.includes(ext.id)}
                          onToggle={handleInstallToggle}
                        />
                      ))
                    }
                  </motion.div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </motion.div>
      </div>
    </Shell>
  );
};

interface ExtensionCardProps {
  extension: any;
  isInstalled: boolean;
  onToggle: (id: string, isInstalled: boolean) => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, isInstalled, onToggle }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        {extension.thumbnail && (
          <div className="h-40 w-full overflow-hidden bg-muted">
            <img 
              src={extension.thumbnail} 
              alt={extension.name} 
              className="h-full w-full object-cover transition-transform hover:scale-105" 
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{extension.name}</CardTitle>
            <div className="flex gap-1">
              {extension.isNew && <Badge variant="new">Nouveau</Badge>}
              {extension.isBeta && <Badge variant="beta">Beta</Badge>}
            </div>
          </div>
          <CardDescription className="line-clamp-2">{extension.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {extension.version && <span>v{extension.version}</span>}
            {extension.rating && (
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{extension.rating}/5</span>
              </div>
            )}
            {extension.usageCount && <span>{extension.usageCount} utilisations</span>}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => onToggle(extension.id, isInstalled)}
            variant={isInstalled ? "secondary" : "default"}
            className="w-full"
          >
            {isInstalled ? 'Désinstaller' : 'Installer'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ExtensionsPage;
