
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRgpdExplainer, GdprRequestType } from "@/hooks/useRgpdExplainer";
import { Shield, MessageSquare, FileText, Search, RefreshCw, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const commonRgpdTopics = [
  {
    id: "right-access",
    title: "Droit d'accès",
    description: "Comment accéder à vos données personnelles"
  },
  {
    id: "right-rectification",
    title: "Droit de rectification",
    description: "Comment corriger vos données personnelles"
  },
  {
    id: "right-deletion",
    title: "Droit à l'effacement",
    description: "Comment demander la suppression de vos données"
  },
  {
    id: "right-portability",
    title: "Droit à la portabilité",
    description: "Comment récupérer et réutiliser vos données"
  },
  {
    id: "right-objection",
    title: "Droit d'opposition",
    description: "Comment s'opposer au traitement de vos données"
  },
  {
    id: "data-breach",
    title: "Violation de données",
    description: "Comprendre les notifications de violation"
  }
];

const GdprPortal: React.FC = () => {
  const { toast } = useToast();
  const { 
    isLoading, 
    explanation, 
    questionResponse, 
    requestTemplate,
    previousQuestions,
    getExplanation, 
    askQuestion, 
    getRequestTemplate,
    resetConversation
  } = useRgpdExplainer();

  // États locaux pour les différentes fonctionnalités
  const [activeTab, setActiveTab] = useState('explorer');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [question, setQuestion] = useState('');
  const [requestType, setRequestType] = useState<GdprRequestType>('access');
  const [requestDetails, setRequestDetails] = useState({
    name: '',
    email: '',
    company: 'ÉmotionCare',
    details: ''
  });
  const [readingLevel, setReadingLevel] = useState<'simple' | 'standard' | 'detailed'>('simple');

  // Gérer la soumission des questions
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    await askQuestion(question);
    setQuestion('');
  };

  // Gérer la recherche de sujets
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    await getExplanation(searchQuery, { readingLevel });
    setSelectedTopic(null);
  };

  // Gérer la sélection d'un sujet
  const handleTopicSelect = async (topicId: string) => {
    const topic = commonRgpdTopics.find(t => t.id === topicId);
    if (!topic) return;
    
    setSelectedTopic(topicId);
    await getExplanation(topic.title, { readingLevel });
  };

  // Générer un modèle de demande
  const handleGenerateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    await getRequestTemplate(requestType, requestDetails);
  };

  // Copier le modèle généré dans le presse-papiers
  const copyTemplateToClipboard = () => {
    if (requestTemplate) {
      navigator.clipboard.writeText(requestTemplate.template);
      toast({
        title: "Copié !",
        description: "Le modèle a été copié dans votre presse-papiers"
      });
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Portail RGPD</h1>
      <p className="text-muted-foreground mb-8">
        Comprenez vos droits en matière de protection des données avec des explications claires et empathiques
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="explorer" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Explorer
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Assistant RGPD
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Modèles de demande
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="explorer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Sujets courants</CardTitle>
                  <CardDescription>
                    Sélectionnez un sujet pour obtenir des explications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    {commonRgpdTopics.map((topic) => (
                      <Button 
                        key={topic.id}
                        variant={selectedTopic === topic.id ? "default" : "ghost"} 
                        className="w-full justify-start text-left"
                        onClick={() => handleTopicSelect(topic.id)}
                      >
                        <div>
                          <p>{topic.title}</p>
                          <p className="text-xs text-muted-foreground">{topic.description}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <form onSubmit={handleSearch} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="searchQuery">Rechercher un sujet</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="searchQuery"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Exemple: cookies, consentement..."
                            className="flex-1"
                          />
                          <Button type="submit" size="sm" disabled={isLoading}>
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="readingLevel">Niveau de détail</Label>
                        <Select 
                          value={readingLevel} 
                          onValueChange={(val) => setReadingLevel(val as any)}
                        >
                          <SelectTrigger id="readingLevel">
                            <SelectValue placeholder="Niveau de détail" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simplifié</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="detailed">Détaillé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Explication simplifiée
                  </CardTitle>
                  <CardDescription>
                    {explanation 
                      ? selectedTopic 
                        ? commonRgpdTopics.find(t => t.id === selectedTopic)?.title 
                        : searchQuery 
                      : "Sélectionnez un sujet ou effectuez une recherche"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : explanation ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <p className="text-muted-foreground italic">
                          Cette explication a été générée par IA pour rendre le RGPD plus accessible.
                        </p>
                        
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-lg">{explanation.explanation}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Points clés à retenir :</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {explanation.simplifiedPoints.map((point, index) => (
                              <li key={index} className="pl-1">{point}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {explanation.nextSteps && explanation.nextSteps.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-medium">Étapes pratiques :</h3>
                            <ul className="list-decimal pl-5 space-y-1">
                              {explanation.nextSteps.map((step, index) => (
                                <li key={index} className="pl-1">{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="pt-4">
                          <p className="text-sm text-muted-foreground">
                            Ces informations sont simplifiées à titre indicatif.
                            Pour des questions spécifiques, utilisez l'assistant RGPD ou contactez notre DPO à l'adresse dpo@emotioncare.com.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <h3 className="text-lg font-medium">Aucun sujet sélectionné</h3>
                      <p className="text-muted-foreground">
                        Sélectionnez un sujet dans la liste ou recherchez un terme spécifique
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Assistant RGPD
              </CardTitle>
              <CardDescription>
                Posez vos questions sur la protection des données et obtenez des réponses claires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {previousQuestions.length > 0 && (
                <div className="space-y-6 max-h-[400px] overflow-y-auto p-2">
                  {previousQuestions.map((interaction, index) => (
                    <div key={index} className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg rounded-br-none">
                        <p className="font-medium">Vous</p>
                        <p>{interaction.question}</p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg rounded-bl-none ml-6">
                        <p className="font-medium text-primary">Assistant RGPD</p>
                        <p>{interaction.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {questionResponse && previousQuestions.length === 0 && (
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="font-medium mb-2">Réponse :</p>
                  <p>{questionResponse.answer}</p>
                  
                  {questionResponse.relatedArticles && questionResponse.relatedArticles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <p className="font-medium mb-2">Articles RGPD associés :</p>
                      <div className="flex flex-wrap gap-2">
                        {questionResponse.relatedArticles.map(article => (
                          <div key={article.id} className="bg-primary/5 px-2 py-1 rounded text-xs">
                            {article.title} ({article.id})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Posez votre question sur la protection des données..."
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !question.trim()}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {previousQuestions.length > 0 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={resetConversation}
                      title="Réinitialiser la conversation"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Exemples : "Qu'est-ce que le droit à l'oubli ?", "Comment puis-je exercer mon droit d'accès ?", 
                  "Combien de temps conservez-vous mes données ?"
                </p>
              </form>
              
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="faq">
                  <AccordionTrigger>Questions fréquentes</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => {
                          setQuestion("Quelles sont mes données personnelles traitées par ÉmotionCare ?");
                          handleQuestionSubmit(new Event('submit') as any);
                        }}
                      >
                        Quelles sont mes données personnelles traitées par ÉmotionCare ?
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => {
                          setQuestion("Combien de temps conservez-vous mes données émotionnelles ?");
                          handleQuestionSubmit(new Event('submit') as any);
                        }}
                      >
                        Combien de temps conservez-vous mes données émotionnelles ?
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => {
                          setQuestion("Comment exercer mon droit à l'oubli ?");
                          handleQuestionSubmit(new Event('submit') as any);
                        }}
                      >
                        Comment exercer mon droit à l'oubli ?
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => {
                          setQuestion("Mes données émotionnelles sont-elles partagées ?");
                          handleQuestionSubmit(new Event('submit') as any);
                        }}
                      >
                        Mes données émotionnelles sont-elles partagées ?
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Modèles de demande</CardTitle>
                  <CardDescription>
                    Générez des modèles personnalisés pour exercer vos droits RGPD
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleGenerateTemplate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="requestType">Type de demande</Label>
                      <Select 
                        value={requestType} 
                        onValueChange={(val) => setRequestType(val as GdprRequestType)}
                      >
                        <SelectTrigger id="requestType">
                          <SelectValue placeholder="Type de demande" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="access">Droit d'accès</SelectItem>
                          <SelectItem value="rectification">Droit de rectification</SelectItem>
                          <SelectItem value="deletion">Droit à l'effacement</SelectItem>
                          <SelectItem value="portability">Droit à la portabilité</SelectItem>
                          <SelectItem value="objection">Droit d'opposition</SelectItem>
                          <SelectItem value="restriction">Droit à la limitation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Votre nom (optionnel)</Label>
                      <Input
                        id="name"
                        value={requestDetails.name}
                        onChange={(e) => setRequestDetails({...requestDetails, name: e.target.value})}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Votre email (optionnel)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={requestDetails.email}
                        onChange={(e) => setRequestDetails({...requestDetails, email: e.target.value})}
                        placeholder="jean.dupont@exemple.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="details">Précisions supplémentaires (optionnel)</Label>
                      <Textarea
                        id="details"
                        value={requestDetails.details}
                        onChange={(e) => setRequestDetails({...requestDetails, details: e.target.value})}
                        placeholder="Ajoutez des détails spécifiques à votre demande..."
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Génération...
                        </>
                      ) : "Générer le modèle"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Modèle généré
                  </CardTitle>
                  <CardDescription>
                    {requestTemplate ? `Modèle pour exercer votre ${
                      requestType === 'access' ? "droit d'accès" :
                      requestType === 'rectification' ? "droit de rectification" :
                      requestType === 'deletion' ? "droit à l'effacement" :
                      requestType === 'portability' ? "droit à la portabilité" :
                      requestType === 'objection' ? "droit d'opposition" : "droit à la limitation"
                    }` : "Remplissez le formulaire pour générer un modèle"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : requestTemplate ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap font-mono text-sm">
                        {requestTemplate.template}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Instructions :</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {requestTemplate.instructions.map((instruction, index) => (
                              <li key={index} className="pl-1">{instruction}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-1">Délai de traitement estimé :</h3>
                          <p>{requestTemplate.estimatedProcessingTime}</p>
                        </div>
                        
                        <Button 
                          onClick={copyTemplateToClipboard} 
                          className="w-full"
                          variant="outline"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copier le modèle
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Ce modèle est généré automatiquement à titre indicatif et peut nécessiter des ajustements.
                        Vous pouvez également envoyer votre demande directement via notre formulaire dans l'onglet "Conformité".
                      </p>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <h3 className="text-lg font-medium">Aucun modèle généré</h3>
                      <p className="text-muted-foreground">
                        Complétez le formulaire pour générer un modèle de demande personnalisé
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GdprPortal;
