/**
 * CoachSuggestionsPanel - Suggestions et techniques du coach
 */

import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, Music, Heart, Sparkles } from 'lucide-react';

interface CoachResource {
  type: string;
  title: string;
  description: string;
}

interface CoachSuggestionsPanelProps {
  techniques: string[];
  resources: CoachResource[];
  followUpQuestions: string[];
  onQuestionClick?: (question: string) => void;
}

function getResourceIcon(type: string) {
  const map: Record<string, typeof Lightbulb> = {
    méditation: Heart,
    meditation: Heart,
    exercice: Sparkles,
    exercise: Sparkles,
    musique: Music,
    music: Music,
    lecture: BookOpen,
    reading: BookOpen,
    respiration: Heart,
    breathing: Heart,
    ancrage: Sparkles,
    grounding: Sparkles,
  };
  return map[type.toLowerCase()] || Lightbulb;
}

function getResourceLink(type: string): string | null {
  const map: Record<string, string> = {
    méditation: '/app/breath',
    meditation: '/app/breath',
    respiration: '/app/breath',
    breathing: '/app/breath',
    musique: '/app/music',
    music: '/app/music',
    exercice: '/app/wellness',
    exercise: '/app/wellness',
  };
  return map[type.toLowerCase()] || null;
}

export const CoachSuggestionsPanel = memo(function CoachSuggestionsPanel({
  techniques,
  resources,
  followUpQuestions,
  onQuestionClick,
}: CoachSuggestionsPanelProps) {
  if (!techniques.length && !resources.length && !followUpQuestions.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Techniques */}
      {techniques.length > 0 && (
        <Card className="border-dashed bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
              Techniques suggérées
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1.5">
              {techniques.map((technique, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {technique}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {resources.map((resource, i) => {
            const Icon = getResourceIcon(resource.type);
            const link = getResourceLink(resource.type);
            const content = (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-accent cursor-pointer transition"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{resource.title}</span>
              </Badge>
            );
            return link ? (
              <Link key={i} to={link}>
                {content}
              </Link>
            ) : (
              <div key={i}>{content}</div>
            );
          })}
        </div>
      )}

      {/* Follow-up questions */}
      {followUpQuestions.length > 0 && onQuestionClick && (
        <div className="flex flex-wrap gap-2">
          {followUpQuestions.map((question, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onQuestionClick(question)}
              className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
            >
              {question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
