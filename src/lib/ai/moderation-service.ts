// @ts-nocheck

import { toast } from "@/hooks/use-toast";
import { NODE_ENV } from "@/lib/env";
import { logger } from '@/lib/logger';

const OPENAI_API_KEY = ''; // Clé gérée côté serveur via Supabase Edge Functions

export async function moderateText(input: string): Promise<boolean> {
  if (!OPENAI_API_KEY) {
    logger.warn("OPENAI_API_KEY is not set. Skipping moderation.", undefined, 'API');
    return true;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      logger.error("Moderation API error", new Error(`${response.status} ${response.statusText}`), 'API');
      return true;
    }

    const data = await response.json();
    const result = data.results[0];

    if (!result.flagged) {
      return true;
    }

    logger.warn("Moderation flags", result.categories, 'API');
    return false;
  } catch (error) {
    logger.error("Moderation API failed", error as Error, 'API');
    return true;
  }
}

export async function checkContentSafety(input: string): Promise<{flagged: boolean, reason?: string}> {
  if (!OPENAI_API_KEY) {
    logger.warn("OPENAI_API_KEY is not set. Skipping content safety check.", undefined, 'API');
    return { flagged: false };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      return { flagged: false };
    }

    const data = await response.json();
    const result = data.results[0];
    
    if (result.flagged) {
      const categories = Object.keys(result.categories).filter(cat => result.categories[cat]);
      return { 
        flagged: true, 
        reason: `This content may violate our community guidelines (${categories.join(', ')}).`
      };
    }
    
    return { flagged: false };
  } catch (error) {
    logger.error("Content safety check failed", error as Error, 'API');
    return { flagged: false };
  }
}

export const showModerationWarning = (message: string) => {
  toast({
    title: "Content Warning",
    description: message,
    variant: "default"
  });
};
