
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessageItem from "@/components/chat/ChatMessageItem";

interface CoachChatInterfaceProps {
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<string | undefined>;
  isProcessing: boolean;
}

const CoachChatInterface: React.FC<CoachChatInterfaceProps> = ({
  messages,
  sendMessage,
  isProcessing
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      const message = input.trim();
      setInput("");
      await sendMessage(message);
    }
  };
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-secondary/30">
        <h2 className="text-xl font-semibold">Coach IA</h2>
        <p className="text-sm text-muted-foreground">
          Discutez avec votre coach émotionnel personnel
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Commencez à discuter avec votre coach émotionnel.</p>
              <p className="mt-2 text-sm">
                Posez une question ou partagez comment vous vous sentez.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={isProcessing}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isProcessing || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default CoachChatInterface;
