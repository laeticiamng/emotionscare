
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Animations for tab content transitions
const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ScanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("quick");
  const [emotion, setEmotion] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  
  const handleQuickScan = () => {
    setIsScanning(true);
    
    // Simulate scan process
    setTimeout(() => {
      setEmotion("Calme");
      setIsScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Scanner émotionnel</h1>
        
        <Tabs defaultValue="quick" className="mb-8" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Scan rapide</TabsTrigger>
            <TabsTrigger value="detailed">Scan détaillé</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick">
            <motion.div 
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
              className="bg-card rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold mb-4">Scan émotionnel rapide</h2>
              <p className="text-muted-foreground mb-6">
                Analysez rapidement votre état émotionnel actuel. Cela prendra moins d'une minute.
              </p>
              
              {!scanComplete ? (
                <button 
                  onClick={handleQuickScan}
                  disabled={isScanning}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full"
                >
                  {isScanning ? "Analyse en cours..." : "Démarrer le scan"}
                </button>
              ) : (
                <div className="border border-border rounded-lg p-4 bg-background/50">
                  <p className="text-lg mb-2">Résultat de l'analyse :</p>
                  <p className="text-2xl font-bold text-primary">{emotion}</p>
                  <button 
                    onClick={() => setScanComplete(false)}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                  >
                    Recommencer
                  </button>
                </div>
              )}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="detailed">
            <motion.div 
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
              className="bg-card rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold mb-4">Analyse émotionnelle détaillée</h2>
              <p className="text-muted-foreground mb-6">
                Une analyse approfondie de votre état émotionnel et de vos facteurs de stress.
              </p>
              
              {/* Detailed scan form would go here */}
              <p className="text-muted-foreground">
                Cette fonctionnalité sera disponible prochainement.
              </p>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="history">
            <motion.div 
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
              className="bg-card rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold mb-4">Historique des analyses</h2>
              <p className="text-muted-foreground mb-6">
                Consultez votre historique d'analyses émotionnelles et suivez votre évolution.
              </p>
              
              {/* History would go here */}
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune analyse précédente trouvée.</p>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanPage;
