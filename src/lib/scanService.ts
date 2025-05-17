
import { EmotionResult } from '@/types/emotion';

// Simulateur d'analyse d'émotions 
export const analyzeEmotion = async (text: string): Promise<EmotionResult> => {
  // Dans une implémentation réelle, ceci serait un appel API à un service d'IA
  console.log("Analyzing emotion in text:", text);
  
  // Simuler un délai d'analyse
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Liste des émotions possibles
  const emotions = ['joy', 'calm', 'focused', 'anxious', 'sad', 'excited', 'stressed'];
  const confidences = [0.87, 0.92, 0.78, 0.85, 0.89, 0.76, 0.94];
  
  // Calcul d'émotion basé sur des mots clés dans le texte
  let selectedEmotionIndex = 0;
  
  // Analyse simpliste basée sur des mots-clés
  if (text.toLowerCase().match(/heur(eux|euse)|joie|content|plaisir|sourire/)) {
    selectedEmotionIndex = 0; // joy
  } else if (text.toLowerCase().match(/calme|tranquille|paisible|serein/)) {
    selectedEmotionIndex = 1; // calm
  } else if (text.toLowerCase().match(/concentr(é|e)|focus|attenti(f|ve)/)) {
    selectedEmotionIndex = 2; // focused
  } else if (text.toLowerCase().match(/anxi(eux|euse)|inquiet|stress|peur|nerv(eux|euse)/)) {
    selectedEmotionIndex = 3; // anxious
  } else if (text.toLowerCase().match(/triste|malheur(eux|euse)|d(é|e)prim(é|e)|morose/)) {
    selectedEmotionIndex = 4; // sad
  } else if (text.toLowerCase().match(/excit(é|e)|enthousiaste|passionn(é|e)/)) {
    selectedEmotionIndex = 5; // excited
  } else if (text.toLowerCase().match(/stress(é|e)|sous pression|tendu/)) {
    selectedEmotionIndex = 6; // stressed
  }
  
  // Résultat de l'analyse
  const result: EmotionResult = {
    id: `analysis-${Date.now()}`,
    emotion: emotions[selectedEmotionIndex],
    score: Math.random() * 0.3 + 0.7, // Score entre 0.7 et 1.0
    confidence: confidences[selectedEmotionIndex],
    intensity: Math.random() * 0.5 + 0.5, // Intensité entre 0.5 et 1.0
    timestamp: new Date().toISOString(),
    text: text,
    feedback: generateFeedback(emotions[selectedEmotionIndex]),
    recommendations: generateRecommendations(emotions[selectedEmotionIndex]),
  };
  
  return result;
};

// Générer un feedback basé sur l'émotion détectée
const generateFeedback = (emotion: string): string => {
  const feedbacks: Record<string, string> = {
    joy: "Votre expression reflète un sentiment de joie et d'optimisme. C'est une excellente base pour aborder les défis avec une attitude positive.",
    calm: "Vous semblez être dans un état de calme et de sérénité. Cette tranquillité d'esprit vous permet de réfléchir clairement.",
    focused: "Votre langage indique une grande concentration et détermination. Vous êtes dans un état mental idéal pour accomplir des tâches complexes.",
    anxious: "Je perçois une certaine anxiété dans votre expression. Il est important d'identifier ce qui provoque ce sentiment pour mieux le gérer.",
    sad: "Il semble y avoir une tonalité de tristesse dans votre texte. N'hésitez pas à exprimer vos sentiments et à chercher du soutien.",
    excited: "Votre expression montre de l'enthousiasme et de l'excitation. Cette énergie peut être canalisée de façon productive.",
    stressed: "Je détecte des signes de stress dans votre langage. Prendre du recul et quelques respirations profondes pourrait vous aider."
  };
  
  return feedbacks[emotion] || "Votre état émotionnel semble complexe. N'hésitez pas à explorer davantage vos sentiments.";
};

// Générer des recommandations basées sur l'émotion détectée
const generateRecommendations = (emotion: string): string[] => {
  const recommendations: Record<string, string[]> = {
    joy: [
      "Partagez votre joie avec votre entourage",
      "Notez ce moment positif dans votre journal",
      "Utilisez cette énergie pour des activités créatives"
    ],
    calm: [
      "Pratiquez la méditation pour maintenir cet état",
      "Écoutez de la musique relaxante",
      "Profitez de ce calme pour réfléchir à vos objectifs"
    ],
    focused: [
      "Définissez des objectifs clairs pour votre session de travail",
      "Utilisez la technique Pomodoro pour maintenir votre concentration",
      "Prenez de courtes pauses pour rester efficace sur la durée"
    ],
    anxious: [
      "Pratiquez des exercices de respiration profonde",
      "Notez vos pensées anxieuses pour les examiner objectivement",
      "Faites une courte promenade pour vous changer les idées"
    ],
    sad: [
      "Contactez un proche pour partager vos sentiments",
      "Écoutez une musique qui vous réconforte",
      "Accordez-vous un moment de gentillesse envers vous-même"
    ],
    excited: [
      "Canalisez cette énergie vers des projets créatifs",
      "Partagez votre enthousiasme avec d'autres",
      "Notez vos idées pendant que vous êtes dans cet état inspiré"
    ],
    stressed: [
      "Prenez 5 minutes pour faire des exercices de respiration",
      "Identifiez la source principale de votre stress",
      "Divisez vos tâches en petites étapes plus gérables"
    ]
  };
  
  return recommendations[emotion] || [
    "Prenez un moment pour réfléchir à votre état émotionnel",
    "Notez vos pensées dans un journal",
    "Pratiquez une activité qui vous apaise habituellement"
  ];
};
