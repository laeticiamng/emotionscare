const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          EmotionsCare
        </h1>
        <p className="text-xl text-slate-200 max-w-2xl mx-auto">
          Votre plateforme de bien-être émotionnel alimentée par l'IA
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Commencer
          </button>
          <button className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-colors">
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;