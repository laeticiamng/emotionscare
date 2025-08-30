import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Users, Lock, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SafeSpace {
  id: string;
  name: string;
  emoji: string;
  members: number;
  description: string;
  privacy: 'private' | 'semi-private' | 'guided';
  color: string;
}

const B2CSocialCoconPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [showJoinAnimation, setShowJoinAnimation] = useState<string>('');

  const spaces: SafeSpace[] = [
    {
      id: '1',
      name: 'Cocon Sérénité',
      emoji: '🌙',
      members: 127,
      description: 'Espace dédié à la méditation et à la paix intérieure',
      privacy: 'guided',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: '2', 
      name: 'Refuge Créatif',
      emoji: '🎨',
      members: 89,
      description: 'Partage d\'inspirations et d\'expressions artistiques',
      privacy: 'semi-private',
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: '3',
      name: 'Cercle d\'Écoute',
      emoji: '🤝',
      members: 203,
      description: 'Écoute bienveillante et soutien mutuel',
      privacy: 'private',
      color: 'from-green-400 to-teal-500'
    },
    {
      id: '4',
      name: 'Jardin des Pensées',
      emoji: '🌸',
      members: 156,
      description: 'Réflexions profondes et partage de sagesse',
      privacy: 'guided',
      color: 'from-rose-400 to-orange-400'
    }
  ];

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'private': return <Lock className="w-4 h-4" />;
      case 'semi-private': return <Eye className="w-4 h-4" />;
      case 'guided': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case 'private': return 'Privé';
      case 'semi-private': return 'Semi-privé';
      case 'guided': return 'Guidé';
      default: return 'Public';
    }
  };

  const handleJoinSpace = (spaceId: string) => {
    setShowJoinAnimation(spaceId);
    setTimeout(() => {
      setShowJoinAnimation('');
      setSelectedSpace(spaceId);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Social Cocon</h1>
        <div className="w-9" />
      </div>

      {/* Hero Section */}
      <div className="p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center"
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-xl font-semibold mb-2">Espaces Protégés</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          Rejoignez des communautés bienveillantes où l'authenticité et le respect sont prioritaires
        </p>
      </div>

      {/* Spaces List */}
      <div className="p-4 space-y-4">
        {spaces.map((space, index) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden"
          >
            <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/20 ${
              selectedSpace === space.id ? 'ring-2 ring-emerald-400' : ''
            }`}>
              {/* Space Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${space.color} flex items-center justify-center text-xl shadow-lg`}>
                  {space.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{space.name}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      {getPrivacyIcon(space.privacy)}
                      <span>{getPrivacyLabel(space.privacy)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{space.description}</p>
                </div>
              </div>

              {/* Space Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{space.members} membres</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Actif aujourd'hui</span>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleJoinSpace(space.id)}
                disabled={selectedSpace === space.id || showJoinAnimation === space.id}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedSpace === space.id 
                    ? 'bg-emerald-500 text-white'
                    : showJoinAnimation === space.id
                    ? 'bg-emerald-400 text-white'
                    : `bg-gradient-to-r ${space.color} text-white hover:shadow-lg`
                }`}
              >
                {selectedSpace === space.id ? '✓ Membre' : showJoinAnimation === space.id ? 'Rejoindre...' : 'Rejoindre'}
              </motion.button>

              {/* Join Animation */}
              <AnimatePresence>
                {showJoinAnimation === space.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 bg-emerald-500/20 rounded-2xl flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Safety Guidelines */}
      <div className="p-4 mx-4 mb-6 bg-emerald-50 rounded-2xl border border-emerald-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-emerald-800 mb-1">Environnement Sécurisé</h4>
            <p className="text-sm text-emerald-700">
              Modération active, anonymat respecté, conversations bienveillantes uniquement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CSocialCoconPage;