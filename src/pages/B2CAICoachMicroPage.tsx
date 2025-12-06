import React, { useState } from 'react';
import { Send, Mic, Zap, Target, Clock, TrendingUp, Sparkles } from 'lucide-react';
import PageRoot from '@/components/common/PageRoot';

interface CoachResponse {
  id: string;
  message: string;
  suggestions: string[];
  confidence: number;
}

const B2CAICoachMicroPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState<CoachResponse[]>([]);

  const generateCoachResponse = async (question: string): Promise<CoachResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          message: "Voici mon analyse rapide :",
          suggestions: [
            "Évalue l'urgence réelle de la situation",
            "Considère tes priorités du moment",
            "Prends une décision rapide et avance"
          ],
          confidence: 85
        });
      }, 1500);
    });
  };

  const handleSubmit = async () => {
    if (!currentQuestion.trim()) return;

    setIsProcessing(true);
    
    try {
      const response = await generateCoachResponse(currentQuestion);
      setResponses(prev => [...prev, response]);
    } catch (error) {
      console.error('Erreur:', error);
    }

    setCurrentQuestion('');
    setIsProcessing(false);
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Coach IA Micro-Décisions
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Obtenez des conseils instantanés pour vos petites décisions quotidiennes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Posez votre question
              </h2>
              
              <div className="space-y-4">
                <textarea
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="Ex: Dois-je prendre cette pause café maintenant ou finir cette tâche d'abord ?"
                  className="w-full h-24 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  disabled={isProcessing}
                />
                
                <button
                  onClick={handleSubmit}
                  disabled={!currentQuestion.trim() || isProcessing}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-medium py-3 px-6 rounded-lg hover:from-yellow-300 hover:to-orange-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Obtenir des conseils
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-black" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Coach IA</h3>
                        <div className="text-xs text-gray-400">
                          Confiance: {response.confidence}%
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{response.message}</p>
                      
                      <div className="space-y-2">
                        {response.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-300">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CAICoachMicroPage;