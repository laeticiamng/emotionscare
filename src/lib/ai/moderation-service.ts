import { toast } from "@/hooks/use-toast";
import { env } from "@/env.mjs";

const OPENAI_API_KEY = env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function moderateText(input: string): Promise<boolean> {
  if (!OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. Skipping moderation.");
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
      console.error("Moderation API error:", response.status, response.statusText);
      return true;
    }

    const data = await response.json();
    const result = data.results[0];

    if (!result.flagged) {
      return true;
    }

    console.warn("Moderation flags:", result.categories);
    return false;
  } catch (error) {
    console.error("Moderation API failed:", error);
    return true;
  }
}

export const showModerationWarning = (message: string) => {
  toast({
    title: "Content Warning",
    description: message,
    variant: "default", // Changed from "warning" to "default"
    duration: 5000,
  });
};
