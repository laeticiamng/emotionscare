/**
 * AuraFullscreenToggle - Bouton pour activer le mode plein écran immersif
 */
import { memo, useState, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AuraFullscreenToggleProps {
  targetRef: React.RefObject<HTMLDivElement>;
}

export const AuraFullscreenToggle = memo(function AuraFullscreenToggle({
  targetRef,
}: AuraFullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggle = useCallback(async () => {
    if (!targetRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await targetRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      toast.error('Mode plein écran non disponible');
    }
  }, [targetRef]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      aria-label={isFullscreen ? 'Quitter le plein écran' : 'Mode plein écran'}
      title={isFullscreen ? 'Quitter le plein écran' : 'Mode immersif'}
    >
      {isFullscreen ? (
        <Minimize2 className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Maximize2 className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
});
