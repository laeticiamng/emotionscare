
export const useChatIntents = () => {
  // Function to determine the user's intention
  const determineIntent = (userText: string, aiResponse: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('vr') || lowerText.includes('pause') || aiResponse.toLowerCase().includes('session vr')) {
      return "vr_session";
    } else if (lowerText.includes('musique') || lowerText.includes('playlist') || aiResponse.toLowerCase().includes('playlist')) {
      return "music_playlist";
    } else if (lowerText.includes('merci') || lowerText.includes('thanks')) {
      return "gratitude";
    } else if (lowerText.includes('stress') || lowerText.includes('anxiété')) {
      return "stress_management";
    } else {
      return "general";
    }
  };

  return { determineIntent };
};
