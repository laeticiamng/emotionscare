
import React from 'react';
import { Link } from 'react-router-dom';

const VRPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">🥽 Réalité Virtuelle</h1>
          <p className="text-xl mb-8 text-cyan-100">
            Expériences immersives pour la relaxation et la méditation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🌊</div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">Océan Zen</h3>
              <p className="text-cyan-100">Méditation au bord de l'océan</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">🌲</div>
              <h3 className="text-xl font-semibold mb-4 text-green-300">Forêt Apaisante</h3>
              <p className="text-green-100">Promenade relaxante en forêt</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-4 text-purple-300">Cosmos Infini</h3>
              <p className="text-purple-100">Voyage méditatif dans l'espace</p>
            </div>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-300 mb-2">🎮 Casque VR requis</h3>
            <p className="text-sm text-blue-200">
              Compatible avec Meta Quest, HTC Vive, Valve Index et autres casques VR
            </p>
          </div>
          
          <Link to="/" className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VRPage;
