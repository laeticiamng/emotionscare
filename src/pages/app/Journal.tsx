import React, { useState } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { SessionResultComponent } from '@/components/modules/SessionResult';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useModuleSession } from '@/hooks/useModuleSession';
import { useRewards } from '@/hooks/useRewards';
import { PenTool, Trash2, Heart } from 'lucide-react';

const Journal: React.FC = () => {
  const { state, isActive, startSession, endSession } = useModuleSession();
  const { unlockReward } = useRewards();
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [entry, setEntry] = useState('');
  const [burnAfter, setBurnAfter] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleStartWriting = async () => {
    await startSession({
      id: 'journal',
      name: 'Journal 1 ligne',
      duration: 30
    });
  };

  const handleSaveEntry = async (shouldBurn: boolean) => {
    setBurnAfter(shouldBurn);
    
    // Generate PANAS responses (simulated)
    const positiveAffect = Math.floor(Math.random() * 45) + 5; // 5-50
    const negativeAffect = Math.floor(Math.random() * 45) + 5; // 5-50
    
    const responses = [
      { questionId: 'panas_pa', value: positiveAffect },
      { questionId: 'panas_na', value: negativeAffect }
    ];

    const result = await endSession({
      id: 'journal',
      name: 'Journal 1 ligne',
      duration: 30
    }, responses);

    // Save entry if not burning (in localStorage for demo)
    if (!shouldBurn && entry.trim()) {
      const savedEntries = JSON.parse(localStorage.getItem('ec_journal_entries') || '[]');
      savedEntries.push({
        text: entry,
        date: new Date().toISOString(),
        mood: positiveAffect > negativeAffect ? 'positive' : 'neutral'
      });
      localStorage.setItem('ec_journal_entries', JSON.stringify(savedEntries));
      
      // Unlock sticker for saving entry
      const reward = unlockReward({
        type: 'sticker',
        name: 'Mot phare',
        description: 'Épingle ce moment sur ta Home'
      });
      
      setSessionResult({ ...result, reward });
    } else {
      setSessionResult(result);
    }
  };

  if (state === 'verbal-feedback' && sessionResult) {
    return (
      <ModuleLayout 
        title="Journal 1 ligne"
        state={state}
        showBack={false}
      >
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {burnAfter && (
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-muted-foreground">
                Brûlé en douceur... 🔥
              </p>
            </div>
          )}
          <SessionResultComponent result={sessionResult} />
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout 
      title="Journal 1 ligne"
      subtitle="Un mot suffit"
      state={state}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!isActive && (
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <PenTool className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-medium text-foreground mb-4">
              Écrire 1 ligne
            </h2>
            <p className="text-muted-foreground mb-8">
              Évacuer ou ancrer un bon moment
            </p>
            <Button 
              onClick={handleStartWriting}
              size="lg"
              className="w-full"
            >
              Commencer
            </Button>
          </div>
        )}

        {isActive && !showOptions && (
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Qu'est-ce qui te traverse ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Une phrase, un mot, un ressenti...
              </p>
            </div>
            
            <div className="space-y-6">
              <Textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Une minute pour toi..."
                className="min-h-[120px] text-lg leading-relaxed resize-none"
                maxLength={280}
                autoFocus
              />
              
              <div className="text-right text-xs text-muted-foreground">
                {entry.length}/280
              </div>
              
              <Button
                onClick={() => setShowOptions(true)}
                disabled={!entry.trim()}
                size="lg"
                className="w-full"
              >
                Terminé
              </Button>
            </div>
          </div>
        )}

        {showOptions && (
          <div className="text-center max-w-sm">
            <h3 className="text-lg font-medium text-foreground mb-6">
              Que faire de ces mots ?
            </h3>
            
            <div className="space-y-4">
              <Button
                onClick={() => handleSaveEntry(false)}
                size="lg"
                className="w-full gap-2"
              >
                <Heart className="w-4 h-4" />
                Garder précieusement
              </Button>
              
              <Button
                onClick={() => handleSaveEntry(true)}
                variant="outline"
                size="lg"
                className="w-full gap-2"
              >
                <Trash2 className="w-4 h-4" />
                À brûler après lecture
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-6">
              Les deux choix sont parfaits
            </p>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
};

export default Journal;