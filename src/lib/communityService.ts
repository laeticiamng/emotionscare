import { faker } from '@faker-js/faker';
import { Post, Comment, Group, GroupMember, CommunityStats, BuddyRequest } from '@/types/community';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockUsers';

// Mock posts for community
export const mockPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: `post-${i + 1}`,
  user_id: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
  content: faker.lorem.paragraphs(Math.floor(Math.random() * 2) + 1),
  created_at: faker.date.recent({ days: 5 }).toISOString(),
  likes: Math.floor(Math.random() * 50),
  comments_count: Math.floor(Math.random() * 10),
  tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => 
    faker.helpers.arrayElement(['travail', 'bien-être', 'stress', 'équilibre', 'santé', 'méditation'])
  ),
  is_anonymous: Math.random() > 0.7,
  date: faker.date.recent({ days: 5 }).toISOString(),
})).sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());

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
      likes: Math.floor(Math.random() * 10),
      is_anonymous: Math.random() > 0.8,
      date: faker.date.recent({ days: 2 }).toISOString(),
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
    members_count: 28,
    member_count: 28,
    is_private: false,
    image_url: faker.image.urlPicsumPhotos(),
    topic: 'Bien-être'
  },
  {
    id: 'group-2',
    name: 'Gestion du stress',
    description: 'Partagez vos techniques pour gérer le stress professionnel',
    created_at: faker.date.past().toISOString(),
    members_count: 17,
    member_count: 17,
    is_private: false,
    image_url: faker.image.urlPicsumPhotos(),
    topic: 'Stress'
  },
  {
    id: 'group-3',
    name: 'Soutien équipe de nuit',
    description: 'Groupe dédié aux professionnels travaillant de nuit',
    created_at: faker.date.past().toISOString(),
    members_count: 12,
    member_count: 12,
    is_private: true,
    image_url: faker.image.urlPicsumPhotos(),
    topic: 'Organisation'
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
        .sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
        
      resolve(comments);
    }, 300);
  });
};

// Create a new post
export const createPost = async (
  userId: string, 
  content: string, 
  isAnonymous: boolean, 
  tags?: string[]
): Promise<Post> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
        likes: 0,
        comments_count: 0,
        tags: tags || [],
        is_anonymous: isAnonymous,
        date: new Date().toISOString(),
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
  isAnonymous: boolean = false
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
        likes: 0,
        is_anonymous: isAnonymous,
        date: new Date().toISOString(),
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

// Like a post (react to post)
export const reactToPost = async (postId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.likes = (post.likes || 0) + 1;
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
  topic: string, // Changed from description to match the component
  description?: string
): Promise<Group> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name,
        description: description || '',
        created_at: new Date().toISOString(),
        members_count: 1,
        member_count: 1,
        is_private: false,
        image_url: faker.image.urlPicsumPhotos(),
        topic: topic
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
              email: user?.email || '', // Added email which is required by User type
              role: user?.role || UserRole.USER,
              avatar: user?.avatar || ''
            } as GroupMember // Added type assertion to fix TypeScript error
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
          group.members_count = (group.members_count || 0) + 1;
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
        if (group) {
          if (group.members_count && group.members_count > 0) {
            group.members_count -= 1;
          }
          if (group.member_count && group.member_count > 0) {
            group.member_count -= 1;
          }
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

// Mock BuddyRequests
const mockBuddyRequests: BuddyRequest[] = [
  {
    id: 'req-1',
    user_id: '2',
    buddy_id: '1',
    status: 'pending',
    user: {
      id: '2',
      name: 'Thomas Dubois',
      email: 'thomas@example.com',
      role: UserRole.USER,
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  },
  {
    id: 'req-2',
    user_id: '3',
    buddy_id: '1',
    status: 'accepted',
    user: {
      id: '3',
      name: 'Emma Petit',
      email: 'emma@example.com',
      role: UserRole.USER,
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  }
];

// Get buddy requests
export const getBuddyRequests = async (userId: string): Promise<BuddyRequest[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const requests = mockBuddyRequests.filter(req => req.buddy_id === userId);
      resolve(requests);
    }, 300);
  });
};

// Send buddy request
export const sendBuddyRequest = async (userId: string, email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const targetUser = mockUsers.find(u => u.email === email);
      
      if (!targetUser) {
        reject(new Error('Utilisateur non trouvé'));
        return;
      }
      
      // Check if request already exists
      const existingRequest = mockBuddyRequests.find(
        req => req.user_id === userId && req.buddy_id === targetUser.id
      );
      
      if (existingRequest) {
        reject(new Error('Une demande existe déjà'));
        return;
      }
      
      // Add new request
      const newRequest: BuddyRequest = {
        id: `req-${Date.now()}`,
        user_id: userId,
        buddy_id: targetUser.id,
        status: 'pending',
        user: mockUsers.find(u => u.id === userId)
      };
      
      mockBuddyRequests.push(newRequest);
      resolve();
    }, 500);
  });
};

// Accept buddy request
export const acceptBuddyRequest = async (requestId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const request = mockBuddyRequests.find(req => req.id === requestId);
      if (request) {
        request.status = 'accepted';
      }
      resolve();
    }, 300);
  });
};

// Reject buddy request
export const rejectBuddyRequest = async (requestId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const request = mockBuddyRequests.find(req => req.id === requestId);
      if (request) {
        request.status = 'rejected';
      }
      resolve();
    }, 300);
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

// Mock API for CommunityFeed.tsx
export const fetchPosts = async (): Promise<Post[]> => {
  return getCommunityPosts(20);
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === id) || null;
      resolve(user);
    }, 100);
  });
};

// Mock API for GroupListPage.tsx
export const fetchGroups = async (): Promise<Group[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockGroups);
    }, 300);
  });
};
