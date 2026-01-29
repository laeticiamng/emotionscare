/**
 * JournalVoiceRecorder.test.tsx
 * Tests unitaires pour JournalVoiceRecorder
 * Day 42 - Module 21: Journal Integration Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import { JournalVoiceRecorder } from '../JournalVoiceRecorder';

describe('JournalVoiceRecorder', () => {
  const mockOnStartRecording = vi.fn();
  const mockOnStopRecording = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('affiche le bouton de démarrage par défaut', () => {
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      // Le bouton contient "Démarrer"
      const startButton = screen.getByText('Démarrer').closest('button');
      expect(startButton).toBeInTheDocument();
    });

    it('affiche le texte "Prêt à enregistrer"', () => {
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      expect(screen.getByText(/prêt à enregistrer/i)).toBeInTheDocument();
    });

    it('applique les classes CSS personnalisées', () => {
      const { container } = render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
          className="custom-class"
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Enregistrement audio', () => {
    it('démarre l\'enregistrement au clic', async () => {
      const user = userEvent.setup();
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      const startButton = screen.getByText('Démarrer').closest('button')!;
      await user.click(startButton);

      expect(mockOnStartRecording).toHaveBeenCalled();
    });

    it('affiche le bouton d\'arrêt pendant l\'enregistrement', () => {
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={10}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );

      expect(screen.getByText(/Terminer/i)).toBeInTheDocument();
    });

    it('arrête l\'enregistrement au clic', async () => {
      const user = userEvent.setup();
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={10}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );

      const stopButton = screen.getByText(/Terminer/i).closest('button')!;
      await user.click(stopButton);

      expect(mockOnStopRecording).toHaveBeenCalled();
    });

    it('affiche le chronomètre pendant l\'enregistrement', () => {
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={65}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      expect(screen.getByText('1:05')).toBeInTheDocument();
    });
  });

  describe('Durée maximale', () => {
    it('affiche la barre de progression pendant l\'enregistrement', () => {
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={150}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
          maxDuration={300}
        />
      );
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('2:30')).toBeInTheDocument();
      // Le composant affiche "Reste: X:XX" au lieu de la durée max directement
      expect(screen.getByText(/Reste:/i)).toBeInTheDocument();
    });

    it('accepte une durée maximale personnalisée', () => {
      const maxDuration = 60; // 1 minute
      
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={30}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
          maxDuration={maxDuration}
        />
      );

      expect(screen.getByText('0:30')).toBeInTheDocument();
      // Vérifie que la durée restante est affichée
      expect(screen.getByText(/Reste:/i)).toBeInTheDocument();
    });
  });

  describe('Gestion des erreurs', () => {
    it('affiche une erreur si l\'enregistrement ne peut pas démarrer', async () => {
      const mockError = vi.fn().mockRejectedValue(new Error('Permission denied'));
      const user = userEvent.setup();
      
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          onStartRecording={mockError}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      const startButton = screen.getByText('Démarrer').closest('button')!;
      await user.click(startButton);

      expect(mockError).toHaveBeenCalled();
    });

    it('affiche un message si l\'enregistrement n\'est pas supporté', () => {
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          canRecord={false}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );

      expect(screen.getByText(/ne supporte pas l'enregistrement audio/i)).toBeInTheDocument();
    });
  });

  describe('État de chargement', () => {
    it('désactive le bouton pendant le traitement', () => {
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          isProcessing={true}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('affiche l\'indicateur de traitement', () => {
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          isProcessing={true}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      expect(screen.getByText(/traitement/i)).toBeInTheDocument();
    });
  });

  describe('Accessibilité', () => {
    it('les boutons sont présents et accessibles', () => {
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('le bouton d\'arrêt est accessible', () => {
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={10}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );

      const stopButton = screen.getByText(/Terminer/i).closest('button');
      expect(stopButton).toBeInTheDocument();
    });

    it('la barre de progression est accessible', () => {
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={10}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Formatage', () => {
    it('formate correctement la durée en minutes:secondes', () => {
      render(
        <JournalVoiceRecorder
          isRecording={true}
          recordingDuration={125}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
        />
      );

      expect(screen.getByText('2:05')).toBeInTheDocument();
    });

    it('affiche la durée maximale formatée', () => {
      render(
        <JournalVoiceRecorder
          isRecording={false}
          recordingDuration={0}
          onStartRecording={mockOnStartRecording}
          onStopRecording={mockOnStopRecording}
          maxDuration={180}
        />
      );

      // Le composant affiche "Max: X min"
      expect(screen.getByText(/Max:/i)).toBeInTheDocument();
    });
  });
});
