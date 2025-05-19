
// Update the timestamp handling to be a string
const createMockResult = (): EmotionResult => {
  const recommendations: EmotionRecommendation[] = [
    {
      type: "activity",
      title: "Exercice de respiration",
      description: "3 minutes de respiration profonde",
      content: "Inspirez lentement, retenez, expirez lentement",
      category: "wellness"
    },
    {
      type: "music",
      title: "Playlist recommandée",
      description: "Musique relaxante pour vous aider à vous détendre",
      content: "Écouter notre playlist zen",
      category: "audio"
    }
  ];

  return {
    id: `voice-${Date.now()}`,
    emotion: randomEmotion(),
    confidence: Math.random() * 0.4 + 0.6,
    intensity: Math.random() * 0.5 + 0.5,
    recommendations,
    timestamp: new Date().toISOString(), // Convert Date to string
    emojis: ["😌", "🧘‍♀️"],
    feedback: "Vous semblez calme et détendu. Continuez ainsi!",
    emotions: { calm: 0.8, happy: 0.2 } // Add required emotions property
  };
};
