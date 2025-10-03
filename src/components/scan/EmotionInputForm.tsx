
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Scan, CirclePlus } from "lucide-react";
import EmojiSelector from '@/components/scan/input/EmojiSelector';
import EmotionTextInput from '@/components/scan/input/EmotionTextInput';
import AudioRecorder from '@/components/scan/AudioRecorder';

interface EmotionInputFormProps {
  emojis: string;
  text: string;
  audioUrl: string | null;
  onEmojiClick: (emoji: string) => void;
  onEmojisChange: (emojis: string) => void; 
  onTextChange: (text: string) => void;
  onAudioChange: (url: string | null) => void;
  onAnalyze: () => void;
  analyzing: boolean;
}

const EmotionInputForm: React.FC<EmotionInputFormProps> = ({
  emojis,
  text,
  audioUrl,
  onEmojiClick,
  onEmojisChange,
  onTextChange,
  onAudioChange,
  onAnalyze,
  analyzing
}) => {
  const formIsEmpty = !emojis && !text && !audioUrl;
  
  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      }
    })
  };
  
  return (
    <div className="space-y-8">
      {/* First Card - Emoji selector */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="overflow-hidden border-primary/10 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Comment vous sentez-vous aujourd'hui ?
            </CardTitle>
            <CardDescription>Utilisez des emojis pour exprimer votre humeur</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <EmojiSelector 
              emojis={emojis} 
              onEmojiClick={onEmojiClick} 
              onClear={() => onEmojisChange('')}
            />
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Second Card - Text input */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="overflow-hidden border-blue-500/10 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-blue-500/10">
            <CardTitle className="flex items-center gap-2">
              <CirclePlus className="h-5 w-5 text-blue-500" />
              Décrivez votre état
            </CardTitle>
            <CardDescription>Partagez vos ressentis en quelques mots</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <EmotionTextInput 
              value={text} 
              onChange={onTextChange}
            />
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Third Card - Audio recording */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="overflow-hidden border-purple-500/10 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-purple-500" />
              Message vocal
            </CardTitle>
            <CardDescription>Enregistrez un message vocal pour exprimer votre ressenti</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AudioRecorder 
              audioUrl={audioUrl} 
              setAudioUrl={onAudioChange} 
            />
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex justify-center"
      >
        <Button 
          onClick={onAnalyze}
          disabled={analyzing || formIsEmpty}
          className="w-full max-w-md gap-2 relative overflow-hidden group"
          size="lg"
        >
          {/* Button background animation */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></span>
          
          {/* Button content */}
          <Sparkles className="h-5 w-5" />
          {analyzing ? "Analyse en cours..." : "Analyser mon état"}
          
          {/* Moving particles for analyzing state */}
          {analyzing && (
            <>
              <motion.span 
                className="absolute h-1 w-1 rounded-full bg-blue-300"
                animate={{
                  x: ['-20px', '20px'],
                  y: ['-5px', '5px'],
                  opacity: [0, 1, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <motion.span 
                className="absolute h-1 w-1 rounded-full bg-purple-300"
                animate={{
                  x: ['20px', '-20px'],
                  y: ['5px', '-5px'],
                  opacity: [0, 1, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default EmotionInputForm;
