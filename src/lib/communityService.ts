
import { faker } from '@faker-js/faker';
import { Post, Comment, Group, GroupMember, CommunityStats } from '@/types/community';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockUsers';

// Mock posts for community
export const mockPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: `post-${i + 1}`,
  user_id: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
  content: faker.lorem.paragraphs(Math.floor(Math.random() * 2) + 1),
  created_at: faker.date.recent({ days: 5 }).toISOString(),
  likes_count: Math.floor(Math.random() * 50),
  comments_count: Math.floor(Math.random() * 10),
  tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => 
    faker.helpers.arrayElement(['travail', 'bien-être', 'stress', 'équilibre', 'santé', 'méditation'])
  ),
  is_anonymous: Math.random() > 0.7,
})).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

// Mock comments
const mockComments: Comment[] = [];
mockPosts.forEach(post => {
  const commentCount = post.comments_count || 0;
  
  // Generate comments for this post
  Array.from({ length: commentCount }).forEach((_, i) => {
    mockComments.push({
      id: `comment-${post.id}-${i}`,
      post_id: post.id,
      user_id: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      content: faker.lorem.sentences(Math.floor(Math.random() * 2) + 1),
      created_at: faker.date.recent({ days: 2 }).toISOString(),
      likes_count: Math.floor(Math.random() * 10),
      is_anonymous: Math.random() > 0.8,
    });
  });
});

// Mock groups
export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Bien-être au travail',
    description: 'Discussions et astuces pour améliorer le bien-être quotidien',
    created_at: faker.date.past().toISOString(),
    member_count: 28,
    is_private: false,
    image_url: faker.image.urlPicsumPhotos()
  },
  {
    id: 'group-2',
    name: 'Gestion du stress',
    description: 'Partagez vos techniques pour gérer le stress professionnel',
    created_at: faker.date.past().toISOString(),
    member_count: 17,
    is_private: false,
    image_url: faker.image.urlPicsumPhotos()
  },
  {
    id: 'group-3',
    name: 'Soutien équipe de nuit',
    description: 'Groupe dédié aux professionnels travaillant de nuit',
    created_at: faker.date.past().toISOString(),
    member_count: 12,
    is_private: true,
    image_url: faker.image.urlPicsumPhotos()
  },
];

// Mock group members
export const mockGroupMembers: GroupMember[] = [
  // Group 1 members
  { group_id: 'group-1', user_id: '1', role: 'admin', joined_at: faker.date.past().toISOString() },
  { group_id: 'group-1', user_id: '2', role: 'member', joined_at: faker.date.past().toISOString() },
  { group_id: 'group-1', user_id: '3', role: 'member', joined_at: faker.date.past().toISOString() },
  
  // Group 2 members
  { group_id: 'group-2', user_id: '2', role: 'admin', joined_at: faker.date.past().toISOString() },
  { group_id: 'group-2', user_id: '1', role: 'member', joined_at: faker.date.past().toISOString() },
  
  // Group 3 members
  { group_id: 'group-3', user_id: '3', role: 'admin', joined_at: faker.date.past().toISOString() },
  { group_id: 'group-3', user_id: '4', role: 'member', joined_at: faker.date.past().toISOString() },
];

// Community stats
export const mockCommunityStats: CommunityStats = {
  total_users: mockUsers.length,
  active_users_today: Math.floor(mockUsers.length * 0.7),
  posts_today: 5,
  comments_today: 12,
  top_tags: [
    { name: 'bien-être', count: 32 },
    { name: 'stress', count: 28 },
    { name: 'équilibre', count: 15 },
    { name: 'santé', count: 12 },
  ]
};

// Get all posts with user information
export const getCommunityPosts = async (limit = 10): Promise<Post[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const posts = mockPosts.slice(0, limit).map(post => {
        const user = mockUsers.find(u => u.id === post.user_id);
        return {
          ...post,
          user: post.is_anonymous ? 
            { name: 'Anonyme', avatar: '' } : 
            { name: user?.name || 'Utilisateur', avatar: user?.avatar || '' }
        };
      });
      resolve(posts);
    }, 500);
  });
};

// Get comments for a post
export const getPostComments = async (postId: string): Promise<Comment[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const comments = mockComments
        .filter(comment => comment.post_id === postId)
        .map(comment => {
          const user = mockUsers.find(u => u.id === comment.user_id);
          return {
            ...comment,
            user: comment.is_anonymous ? 
              { name: 'Anonyme', avatar: '' } : 
              { name: user?.name || 'Utilisateur', avatar: user?.avatar || '' }
          };
        })
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
      resolve(comments);
    }, 300);
  });
};

// Create a new post
export const createPost = async (userId: string, content: string, isAnonymous: boolean, tags?: string[]): Promise<Post> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        tags: tags || [],
        is_anonymous: isAnonymous,
        // Add user info directly
        user: isAnonymous ? 
          { name: 'Anonyme', avatar: '' } : 
          { 
            name: mockUsers.find(u => u.id === userId)?.name || 'Utilisateur', 
            avatar: mockUsers.find(u => u.id === userId)?.avatar || '' 
          }
      };
      
      // Add to mock posts
      mockPosts.unshift(newPost);
      
      resolve(newPost);
    }, 500);
  });
};

// Create a comment
export const createComment = async (
  postId: string, 
  userId: string, 
  content: string,
  isAnonymous: boolean
): Promise<Comment> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Create comment
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        post_id: postId,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
        likes_count: 0,
        is_anonymous: isAnonymous,
        // Add user info directly
        user: isAnonymous ? 
          { name: 'Anonyme', avatar: '' } : 
          { 
            name: mockUsers.find(u => u.id === userId)?.name || 'Utilisateur', 
            avatar: mockUsers.find(u => u.id === userId)?.avatar || '' 
          }
      };
      
      // Add to mock comments
      mockComments.push(newComment);
      
      // Update the post's comment count
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.comments_count = (post.comments_count || 0) + 1;
      }
      
      resolve(newComment);
    }, 300);
  });
};

// Like a post
export const likePost = async (postId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.likes_count = (post.likes_count || 0) + 1;
      }
      resolve();
    }, 200);
  });
};

// Get recommended buddies
export const getRecommendedBuddies = async (userId: string): Promise<User[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Filter out the current user and get 3 random users
      const filteredUsers = mockUsers.filter(u => u.id !== userId);
      const randomUsers = [...filteredUsers]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      resolve(randomUsers);
    }, 400);
  });
};

// Get user's groups
export const getUserGroups = async (userId: string): Promise<Group[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const userMemberships = mockGroupMembers.filter(m => m.user_id === userId);
      const userGroups = mockGroups.filter(g => 
        userMemberships.some(m => m.group_id === g.id)
      );
      resolve(userGroups);
    }, 300);
  });
};

// Create new group
export const createGroup = async (
  userId: string,
  name: string,
  description: string,
  isPrivate: boolean
): Promise<Group> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name,
        description,
        created_at: new Date().toISOString(),
        member_count: 1,
        is_private: isPrivate,
        image_url: faker.image.urlPicsumPhotos()
      };
      
      // Add to mock groups
      mockGroups.push(newGroup);
      
      // Add creator as admin
      mockGroupMembers.push({
        group_id: newGroup.id,
        user_id: userId,
        role: 'admin',
        joined_at: new Date().toISOString()
      });
      
      resolve(newGroup);
    }, 500);
  });
};

// Get group details
export const getGroupDetails = async (groupId: string): Promise<Group | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const group = mockGroups.find(g => g.id === groupId) || null;
      resolve(group);
    }, 200);
  });
};

// Get group members
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const members = mockGroupMembers
        .filter(m => m.group_id === groupId)
        .map(member => {
          const user = mockUsers.find(u => u.id === member.user_id);
          return {
            ...member,
            user: {
              id: user?.id || '',
              name: user?.name || 'Utilisateur',
              role: user?.role || UserRole.USER,
              avatar: user?.avatar || ''
            }
          };
        });
      resolve(members);
    }, 300);
  });
};

// Join a group
export const joinGroup = async (groupId: string, userId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Check if already a member
      const existingMembership = mockGroupMembers.find(
        m => m.group_id === groupId && m.user_id === userId
      );
      
      if (!existingMembership) {
        // Add as member
        mockGroupMembers.push({
          group_id: groupId,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString()
        });
        
        // Update member count
        const group = mockGroups.find(g => g.id === groupId);
        if (group) {
          group.member_count = (group.member_count || 0) + 1;
        }
      }
      
      resolve();
    }, 300);
  });
};

// Leave a group
export const leaveGroup = async (groupId: string, userId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Find membership index
      const membershipIndex = mockGroupMembers.findIndex(
        m => m.group_id === groupId && m.user_id === userId
      );
      
      if (membershipIndex !== -1) {
        // Remove membership
        mockGroupMembers.splice(membershipIndex, 1);
        
        // Update member count
        const group = mockGroups.find(g => g.id === groupId);
        if (group && group.member_count > 0) {
          group.member_count -= 1;
        }
      }
      
      resolve();
    }, 300);
  });
};

// Get community stats
export const getCommunityStats = async (): Promise<CommunityStats> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockCommunityStats);
    }, 200);
  });
};

// Generate mock tags for post creation
export const getRecommendedTags = (): string[] => {
  return [
    'bien-être', 
    'stress', 
    'équilibre', 
    'santé', 
    'méditation', 
    'sommeil', 
    'nutrition', 
    'exercice', 
    'travail', 
    'vie personnelle'
  ];
};
