
import { v4 as uuid } from 'uuid';

// Mock data for posts
const mockPosts = [
  {
    id: uuid(),
    user_id: 'user1',
    date: new Date().toISOString(),
    content: 'Just had a great mindfulness session today!',
    reactions: 5,
    image_url: null,
  },
  {
    id: uuid(),
    user_id: 'user2',
    date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    content: 'Seeking recommendations for meditation apps. What are you all using?',
    reactions: 3,
    image_url: '/images/meditation.jpg',
  },
];

// Mock data for comments
const mockComments = [
  {
    id: uuid(),
    post_id: mockPosts[0].id,
    user_id: 'user2',
    date: new Date().toISOString(),
    content: 'That sounds wonderful! What techniques did you practice?',
  },
  {
    id: uuid(),
    post_id: mockPosts[1].id,
    user_id: 'user1',
    date: new Date().toISOString(),
    content: 'I recommend Calm or Headspace, both are great!',
  },
];

// Mock tags
const mockTags = [
  'mindfulness', 'meditation', 'wellness', 'self-care', 'motivation',
  'journaling', 'gratitude', 'emotional-intelligence', 'mental-health'
];

// Function to get all posts
export const getPosts = async () => {
  return mockPosts;
};

// Function to get a post by ID
export const getPostById = async (id) => {
  return mockPosts.find(post => post.id === id);
};

// Function to create a new post
export const createPost = async (postData) => {
  const newPost = {
    id: uuid(),
    date: new Date().toISOString(),
    reactions: 0,
    ...postData,
  };
  mockPosts.unshift(newPost);
  return newPost;
};

// Function to react to a post
export const reactToPost = async (postId, userId, reactionType = 'like') => {
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    post.reactions = (post.reactions || 0) + 1;
    return post;
  }
  throw new Error('Post not found');
};

// Function to get comments for a post
export const getCommentsForPost = async (postId) => {
  return mockComments.filter(comment => comment.post_id === postId);
};

// Function to create a comment
export const createComment = async (commentData) => {
  const newComment = {
    id: uuid(),
    date: new Date().toISOString(),
    ...commentData
  };
  mockComments.push(newComment);
  return newComment;
};

// Function to get recommended tags
export const getRecommendedTags = async (query = '') => {
  if (!query) {
    return mockTags;
  }
  return mockTags.filter(tag => tag.includes(query.toLowerCase()));
};

// Function to create a group
export const createGroup = async (groupData) => {
  const newGroup = {
    id: uuid(),
    created_at: new Date().toISOString(),
    members: [groupData.user_id],
    ...groupData,
  };
  return newGroup;
};
