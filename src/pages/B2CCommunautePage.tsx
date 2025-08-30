import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Heart, MessageCircle, Share, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  mood: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const B2CCommunautePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Luna',
      avatar: '🌙',
      content: 'Moment de sérénité retrouvé après une journée intense...',
      mood: 'zen',
      timestamp: 'Il y a 2h',
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: '2',
      author: 'Alex',
      avatar: '⭐',
      content: 'Petite victoire du jour : j\'ai réussi ma présentation !',
      mood: 'confiant',
      timestamp: 'Il y a 4h',
      likes: 8,
      comments: 2,
      isLiked: true
    },
    {
      id: '3',
      author: 'Maya',
      avatar: '🌸',
      content: 'Gratitude pour ce coucher de soleil magique',
      mood: 'reconnaissant',
      timestamp: 'Il y a 6h',
      likes: 15,
      comments: 5,
      isLiked: false
    }
  ]);

  const moods = [
    { name: 'zen', emoji: '🧘', color: 'from-blue-400 to-teal-400' },
    { name: 'joyeux', emoji: '😊', color: 'from-yellow-400 to-orange-400' },
    { name: 'reconnaissant', emoji: '🙏', color: 'from-pink-400 to-purple-400' },
    { name: 'confiant', emoji: '💪', color: 'from-green-400 to-blue-400' },
    { name: 'créatif', emoji: '🎨', color: 'from-purple-400 to-pink-400' }
  ];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = selectedMood 
    ? posts.filter(post => post.mood === selectedMood)
    : posts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Communauté</h1>
        <div className="w-9" />
      </div>

      {/* Mood Filter */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood('')}
            className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200 ${
              selectedMood === '' 
                ? 'bg-primary text-white' 
                : 'bg-white/70 text-gray-700 hover:bg-white/90'
            }`}
          >
            Tous
          </motion.button>
          {moods.map((mood) => (
            <motion.button
              key={mood.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                selectedMood === mood.name
                  ? `bg-gradient-to-r ${mood.color} text-white`
                  : 'bg-white/70 text-gray-700 hover:bg-white/90'
              }`}
            >
              <span>{mood.emoji}</span>
              <span className="capitalize">{mood.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="p-4 space-y-4">
        <AnimatePresence mode="wait">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{post.author}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${
                      moods.find(m => m.name === post.mood)?.color || 'from-gray-400 to-gray-500'
                    } text-white`}>
                      {moods.find(m => m.name === post.mood)?.emoji} {post.mood}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm">{post.likes}</span>
                  </motion.button>

                  <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>

                <button className="text-gray-600 hover:text-purple-500 transition-colors">
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <Star className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default B2CCommunautePage;