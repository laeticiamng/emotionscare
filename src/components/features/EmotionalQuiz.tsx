
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Heart, BarChart, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmotionalQuizProps {
  isAdmin?: boolean;
}

const EmotionalQuiz: React.FC<EmotionalQuizProps> = ({ isAdmin = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  
  const questions = [
    {
      question: "Comment vous sentez-vous aujourd'hui ?",
      options: ["Très bien", "Bien", "Neutre", "Pas très bien", "Mal"]
    },
    {
      question: "Comment évaluez-vous votre niveau d'énergie ?",
      options: ["Très énergique", "Énergique", "Normal", "Fatigué", "Épuisé"]
    },
    {
      question: "Comment décririez-vous votre humeur actuelle ?",
      options: ["Très positive", "Positive", "Neutre", "Négative", "Très négative"]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 400);
    } else {
      setShowResults(true);
      
      // Pour les admins B2B, simulons l'enregistrement des données anonymisées
      if (isAdmin) {
        toast({
          title: "Résultats agrégés mis à jour",
          description: "Les nouvelles données ont été ajoutées aux statistiques de l'équipe",
        });
      } else {
        toast({
          title: "Merci pour votre participation !",
          description: "Vos réponses nous aident à vous proposer un contenu adapté",
        });
      }
    }
  };
  
  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };
  
  // Calculer un "score de bien-être" basique basé sur les réponses
  const calculateWellbeingScore = () => {
    let score = 0;
    Object.keys(answers).forEach(questionIndex => {
      const idx = parseInt(questionIndex);
      const answer = answers[idx];
      const optionIndex = questions[idx].options.findIndex(opt => opt === answer);
      // Plus l'index est petit, meilleure est la réponse (inverser pour le score)
      score += 4 - optionIndex; // 4, 3, 2, 1, 0 points selon la réponse
    });
    return (score / (questions.length * 4)) * 100; // Normaliser à 100
  };

  if (isAdmin && showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-medium mb-1">Tendances émotionnelles de l'équipe</h3>
          <p className="text-sm text-muted-foreground">Données anonymisées des 7 derniers jours</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Niveau de bien-être général</span>
              <span className="font-medium">78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Niveau d'énergie moyen</span>
              <span className="font-medium">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Humeur positive</span>
              <span className="font-medium">72%</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="outline" onClick={handleReset} className="w-full">
            Nouveau sondage
          </Button>
          <Button className="w-full">
            Télécharger rapport
          </Button>
        </div>
      </div>
    );
  }
  
  if (showResults) {
    const score = calculateWellbeingScore();
    return (
      <motion.div 
        className="space-y-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-medium">Votre score de bien-être</h3>
          <div className="text-4xl font-bold text-primary mt-2">{Math.round(score)}%</div>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground">
            {score > 80 ? 
              "Excellent ! Votre bien-être émotionnel est très positif." :
              score > 60 ?
              "Bien ! Votre état émotionnel est généralement positif." :
              score > 40 ?
              "Votre bien-être émotionnel est moyen. Prenez soin de vous." :
              "Votre bien-être émotionnel semble bas. Nous vous recommandons d'utiliser nos outils de relaxation."
            }
          </p>
          
          <div className="bg-primary/5 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Recommandations personnalisées</h4>
            <ul className="text-sm text-left space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Pratiquez 5 minutes de respiration profonde</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Écoutez notre playlist "Calme intérieur"</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Notez vos pensées positives dans votre journal</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Button onClick={handleReset} className="w-full">
          Refaire le quiz
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} sur {questions.length}
        </span>
        <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
          Anonyme
        </span>
      </div>
      
      <Progress value={(currentQuestion / questions.length) * 100} className="h-1.5" />
      
      <div className="py-2">
        <h3 className="text-xl font-medium mb-4">
          {questions[currentQuestion].question}
        </h3>
        
        <RadioGroup>
          {questions[currentQuestion].options.map((option, idx) => (
            <div 
              key={option}
              className="flex items-center space-x-2 bg-muted/30 hover:bg-muted/50 transition-colors p-3 rounded-lg mb-2 cursor-pointer"
              onClick={() => handleAnswer(option)}
            >
              <RadioGroupItem value={option} id={`option-${idx}`} />
              <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </motion.div>
  );
};

export default EmotionalQuiz;
