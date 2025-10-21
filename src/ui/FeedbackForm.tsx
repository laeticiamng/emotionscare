// @ts-nocheck
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logger } from '@/lib/logger';

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    logger.info('Feedback submitted', { name, email, message }, 'UI');
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <Card className="p-4 space-y-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
        />
        <Input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message"
        />
        <Button type="submit">Envoyer</Button>
      </form>
    </Card>
  );
}
