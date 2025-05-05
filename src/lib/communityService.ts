
// Add this function if it doesn't exist
export const getRecommendedTags = () => {
  return [
    "Bien-être",
    "Stress",
    "Méditation",
    "Sport",
    "Nutrition",
    "Sommeil",
    "Productivité",
    "Équilibre",
    "Mindfulness",
    "Yoga",
    "Résilience",
    "Management",
    "Remote Work"
  ];
};

// Update the createGroup function to accept expected parameters
export const createGroup = async (
  groupData: { name: string; description: string; tags?: string[] },
  userId?: string,
  join = true
) => {
  // Simulate API call with setTimeout
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      const newGroup = {
        id: crypto.randomUUID(),
        name: groupData.name,
        description: groupData.description,
        tags: groupData.tags || [],
        owner_id: userId || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        members_count: join ? 1 : 0
      };
      
      // Simulate storing in database
      // In a real app, this would be a supabase/firebase call
      
      resolve(newGroup);
    }, 500);
  });
};

// If fetchGroups doesn't exist, add it
export const fetchGroups = async () => {
  // Simulate API call with setTimeout
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const groups = [
        {
          id: "1",
          name: "Groupe Bien-être",
          description: "Partagez vos conseils et expériences pour améliorer votre bien-être au travail",
          tags: ["Bien-être", "Méditation", "Santé"],
          owner_id: "user-1",
          created_at: new Date().toISOString(),
          members_count: 24
        },
        {
          id: "2",
          name: "Anti-stress",
          description: "Groupe de soutien pour gérer le stress professionnel",
          tags: ["Stress", "Anxiété", "Relaxation"],
          owner_id: "user-2",
          created_at: new Date().toISOString(),
          members_count: 18
        },
        {
          id: "3",
          name: "Activités sportives",
          description: "Organisez des activités sportives entre collègues",
          tags: ["Sport", "Team building", "Santé"],
          owner_id: "user-3",
          created_at: new Date().toISOString(),
          members_count: 12
        }
      ];
      
      resolve(groups);
    }, 800);
  });
};
