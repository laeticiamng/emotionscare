
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface VRTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
}

const VRPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<VRTemplate | null>(null);
  
  // Sample VR templates
  const templates: VRTemplate[] = [
    {
      id: 'forest',
      title: 'Forêt apaisante',
      description: 'Une promenade calme dans une forêt paisible avec des sons naturels',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      duration: '15 min'
    },
    {
      id: 'ocean',
      title: 'Fonds marins',
      description: "Plongez dans les profondeurs de l'océan pour une relaxation intense",
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      duration: '18 min'
    },
    {
      id: 'mountain',
      title: 'Sommet montagneux',
      description: 'Admirez le panorama depuis un sommet montagneux serein',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      duration: '12 min'
    }
  ];
  
  const selectTemplate = (template: VRTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("session");
  };
  
  const closeSession = () => {
    setSelectedTemplate(null);
    setActiveTab("templates");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Expériences virtuelles</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Expériences</TabsTrigger>
            <TabsTrigger value="session" disabled={!selectedTemplate}>Session active</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => selectTemplate(template)}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={template.image} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{template.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{template.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="session">
            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-lg overflow-hidden shadow-lg"
              >
                <div className="aspect-video relative">
                  <img 
                    src={selectedTemplate.image} 
                    alt={selectedTemplate.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="bg-white/90 text-black rounded-full p-4 hover:bg-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{selectedTemplate.title}</h2>
                    <span className="text-muted-foreground">{selectedTemplate.duration}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{selectedTemplate.description}</p>
                  
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
                      Démarrer
                    </button>
                    <button 
                      onClick={closeSession}
                      className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/80 transition-colors"
                    >
                      Retour
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Historique des sessions</h2>
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune session précédente trouvée.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VRPage;
