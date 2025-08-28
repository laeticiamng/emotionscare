import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Type, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TextScanComponentProps {
  onResults: (results: any) => void;
  isScanning: boolean;
}

const TextScanComponent: React.FC<TextScanComponentProps> = ({ onResults, isScanning }) => {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (value: string) => {
    setText(value);
    setWordCount(value.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const analyzeText = () => {
    if (text.trim().length < 10) return;

    // Simulation d'analyse de sentiment
    setTimeout(() => {
      const positiveWords = ['bon', 'bien', 'heureux', 'content', 'joyeux', 'excellent', 'super', 'génial'];
      const negativeWords = ['mal', 'triste', 'difficile', 'problème', 'stress', 'fatigue', 'inquiet'];
      
      const words = text.toLowerCase().split(/\s+/);
      const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
      const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;
      
      const sentimentScore = (positiveCount - negativeCount) / words.length * 100 + 50;
      
      onResults({
        type: 'text',
        confidence: 88,
        emotions: {
          'Joie': Math.max(0, sentimentScore + Math.random() * 20 - 10),
          'Sérénité': Math.random() * 30 + 40,
          'Confiance': Math.random() * 40 + 30,
          'Anxiété': Math.max(0, 100 - sentimentScore + Math.random() * 15),
          'Énergie': Math.random() * 50 + 25
        },
        textMetrics: {
          sentiment: sentimentScore > 55 ? 'Positif' : sentimentScore < 45 ? 'Négatif' : 'Neutre',
          wordCount: wordCount,
          complexity: wordCount > 50 ? 'Élevée' : 'Modérée',
          themes: ['bien-être', 'quotidien', 'émotions']
        }
      });
    }, 1500);
  };

  const suggestions = [
    "Comment vous sentez-vous aujourd'hui ?",
    "Décrivez votre journée en quelques mots",
    "Quelles sont vos préoccupations actuelles ?",
    "Qu'est-ce qui vous rend heureux en ce moment ?"
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Analyse Textuelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Textarea
            placeholder="Écrivez vos pensées, sentiments, ou décrivez votre journée..."
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant={wordCount >= 10 ? "default" : "secondary"}>
                {wordCount} mots
              </Badge>
              <Badge variant={text.length >= 50 ? "default" : "secondary"}>
                {text.length} caractères
              </Badge>
            </div>
            <Button 
              onClick={analyzeText} 
              disabled={text.trim().length < 10 || isScanning}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Analyser le texte
            </Button>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Suggestions d'écriture
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setText(suggestion)}
                className="justify-start text-green-700 hover:bg-green-100"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📝 Conseils pour une meilleure analyse</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Écrivez au minimum 10 mots pour une analyse précise</li>
            <li>• Soyez authentique dans vos expressions</li>
            <li>• Utilisez des mots qui décrivent vos vrais ressentis</li>
            <li>• N'hésitez pas à détailler vos émotions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextScanComponent;