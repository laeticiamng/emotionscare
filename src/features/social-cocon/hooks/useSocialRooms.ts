// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Sentry } from '@/lib/errors/sentry-compat';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import {
  createSocialRoom,
  fetchSocialRooms,
  joinSocialRoom,
  leaveSocialRoom,
  toggleSoftMode,
} from '../api';
import {
  type CreateSocialRoomPayload,
  type JoinSocialRoomPayload,
  type LeaveSocialRoomPayload,
  type SocialRoom,
  type SocialRoomMember,
  type ToggleSoftModePayload,
} from '../types';

interface UseSocialRoomsOptions {
  enabled?: boolean;
}

interface UseSocialRoomsResult {
  rooms: SocialRoom[];
  memberships: Record<string, SocialRoomMember>;
  isLoading: boolean;
  error: Error | null;
  createRoom: (payload: CreateSocialRoomPayload) => Promise<void>;
  joinRoom: (payload: JoinSocialRoomPayload) => Promise<void>;
  leaveRoom: (payload: LeaveSocialRoomPayload) => Promise<void>;
  setSoftMode: (payload: ToggleSoftModePayload) => Promise<void>;
  isCreating: boolean;
  isJoining: boolean;
  isLeaving: boolean;
  isSoftModeUpdating: boolean;
}

export const useSocialRooms = (options?: UseSocialRoomsOptions): UseSocialRoomsResult => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<SocialRoom[]>([]);
  const [memberships, setMemberships] = useState<Record<string, SocialRoomMember>>({});

  const roomsQuery = useQuery({
    queryKey: ['social-rooms'],
    queryFn: fetchSocialRooms,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 30,
    refetchInterval: options?.enabled === false ? false : 1000 * 60,
  });

  useEffect(() => {
    if (roomsQuery.data) {
      setRooms(roomsQuery.data);
    }
  }, [roomsQuery.data]);

  const handleRoomUpdate = useCallback((updatedRoom: SocialRoom) => {
    setRooms((prev) => {
      const exists = prev.some((room) => room.id === updatedRoom.id);
      if (exists) {
        return prev.map((room) => (room.id === updatedRoom.id ? updatedRoom : room));
      }
      return [updatedRoom, ...prev];
    });
  }, []);

  const createRoomMutation = useMutation({
    mutationFn: createSocialRoom,
    onSuccess: (room) => {
      handleRoomUpdate(room);
      toast({
        title: 'Room créée',
        description: 'Votre espace privé est prêt à accueillir vos invités.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Création interrompue',
        description: "Impossible de créer la room pour le moment.",
        variant: 'destructive',
      });
      Sentry.captureException(error, {
        tags: { feature: 'social-cocon', mutation: 'create-room' },
      });
    },
  });

  const joinRoomMutation = useMutation({
    mutationFn: joinSocialRoom,
    onSuccess: (member, variables) => {
      setMemberships((prev) => ({ ...prev, [variables.roomId]: member }));
      setRooms((prev) =>
        prev.map((room) =>
          room.id === variables.roomId
            ? {
                ...room,
                members: room.members.some((existing) => existing.id === member.id)
                  ? room.members
                  : [...room.members, member],
              }
            : room
        )
      );
      toast({
        title: 'Room rejointe',
        description: 'Vous êtes dans la salle. Prenez un moment pour respirer.',
        variant: 'info',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Rejoindre la room a échoué',
        description: 'Un souci est survenu, réessayez dans quelques instants.',
        variant: 'destructive',
      });
      Sentry.captureException(error, {
        tags: { feature: 'social-cocon', mutation: 'join-room' },
      });
    },
  });

  const leaveRoomMutation = useMutation({
    mutationFn: leaveSocialRoom,
    onSuccess: (_, variables) => {
      setMemberships((prev) => {
        const next = { ...prev };
        delete next[variables.roomId];
        return next;
      });
      setRooms((prev) =>
        prev.map((room) =>
          room.id === variables.roomId
            ? {
                ...room,
                members: room.members.filter((member) => member.id !== variables.memberId),
              }
            : room
        )
      );
    },
    onError: (error: Error) => {
      toast({
        title: 'Sortie impossible',
        description: 'La salle reste ouverte mais vous pouvez fermer la page en sécurité.',
        variant: 'warning',
      });
      Sentry.captureException(error, {
        tags: { feature: 'social-cocon', mutation: 'leave-room' },
      });
    },
  });

  const toggleSoftModeMutation = useMutation({
    mutationFn: toggleSoftMode,
    onSuccess: (softMode, variables) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === variables.roomId
            ? {
                ...room,
                softModeEnabled: softMode,
              }
            : room
        )
      );
    },
  });

  const createRoom = useCallback(async (payload: CreateSocialRoomPayload) => {
    logger.info('social:create', { allowAudio: payload.allowAudio }, 'SOCIAL');
    await createRoomMutation.mutateAsync(payload);
  }, [createRoomMutation]);

  const joinRoom = useCallback(async (payload: JoinSocialRoomPayload) => {
    logger.info('social:join', { roomId: payload.roomId }, 'SOCIAL');
    await joinRoomMutation.mutateAsync(payload);
  }, [joinRoomMutation]);

  const leaveRoom = useCallback(async (payload: LeaveSocialRoomPayload) => {
    logger.info('social:leave', { roomId: payload.roomId }, 'SOCIAL');
    await leaveRoomMutation.mutateAsync(payload);
  }, [leaveRoomMutation]);

  const setSoftMode = useCallback(
    async (payload: ToggleSoftModePayload) => {
      await toggleSoftModeMutation.mutateAsync(payload);
    },
    [toggleSoftModeMutation]
  );

  return useMemo(
    () => ({
      rooms,
      memberships,
      isLoading: roomsQuery.isLoading,
      error: (roomsQuery.error as Error) || null,
      createRoom,
      joinRoom,
      leaveRoom,
      setSoftMode,
      isCreating: createRoomMutation.isPending,
      isJoining: joinRoomMutation.isPending,
      isLeaving: leaveRoomMutation.isPending,
      isSoftModeUpdating: toggleSoftModeMutation.isPending,
    }),
    [
      rooms,
      memberships,
      roomsQuery.isLoading,
      roomsQuery.error,
      createRoom,
      joinRoom,
      leaveRoom,
      setSoftMode,
      createRoomMutation.isPending,
      joinRoomMutation.isPending,
      leaveRoomMutation.isPending,
      toggleSoftModeMutation.isPending,
    ]
  );
};

export default useSocialRooms;
