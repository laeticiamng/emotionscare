
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronRight, Upload } from 'lucide-react';
import StorySynthButton from '@/components/features/StorySynthButton';
import { useStorySynth } from '@/hooks/useStorySynth';

const StorySynthLabPage: React.FC = () => {
  const { currentStory, navigateToChapter } = useStorySynth();
  const currentChapter = currentStory?.chapters[currentStory.currentChapterIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Story Synth Lab
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Créez des histoires interactives personnalisées avec l'IA
          </p>
        </div>

        {/* Action principale */}
        <div className="flex justify-center">
          <StorySynthButton />
        </div>

        {/* Upload d'image optionnel */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-muted-foreground">
                Uploadez une image pour inspirer votre histoire (optionnel)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Histoire actuelle */}
        {currentStory && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  {currentStory.title}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Chapitre actuel */}
            {currentChapter && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {currentChapter.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed">{currentChapter.content}</p>
                  
                  {/* Image générée (placeholder) */}
                  {currentChapter.imagePrompt && (
                    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        🎨 Image: {currentChapter.imagePrompt}
                      </p>
                    </div>
                  )}

                  {/* Choix interactifs */}
                  {currentChapter.choices && (
                    <div className="space-y-2">
                      <p className="font-medium">Que voulez-vous faire ?</p>
                      {currentChapter.choices.map((choice, index) => (
                        <button
                          key={index}
                          onClick={() => navigateToChapter(index + 1)}
                          className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-between"
                        >
                          <span>{choice.text}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation chapitres */}
            <div className="flex justify-center space-x-2">
              {currentStory.chapters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToChapter(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStory.currentChapterIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorySynthLabPage;
