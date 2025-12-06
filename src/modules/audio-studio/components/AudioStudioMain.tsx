/**
 * Composant principal du module audio-studio
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic2 } from 'lucide-react';
import { useAudioStudio } from '../useAudioStudio';
import { RecordingControls } from '../ui/RecordingControls';
import { TrackList } from '../ui/TrackList';

export function AudioStudioMain() {
  const {
    recordingStatus,
    tracks,
    elapsedTime,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    deleteTrack
  } = useAudioStudio();

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic2 className="h-5 w-5 text-primary" />
            Studio Audio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <RecordingControls
            status={recordingStatus}
            elapsedTime={elapsedTime}
            onStart={startRecording}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={() => stopRecording()}
          />
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Enregistrements ({tracks.length})
        </h3>
        <TrackList tracks={tracks} onDelete={deleteTrack} />
      </div>
    </div>
  );
}

export default AudioStudioMain;
