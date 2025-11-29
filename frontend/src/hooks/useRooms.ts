/**
 * Room management hooks using React Query
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '@/lib/api';
import { QUERY_KEYS } from '@/types';
import type {
  IRoomCreate,
  IRoomUpdate,
  IAddQuestionsToRoom,
  IUpdateRoomStatus,
} from '@/types';

/**
 * Hook to get all rooms for authenticated teacher
 */
export const useRooms = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms.list({ page, limit }),
    queryFn: () => roomsApi.getRooms(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get a single room by ID
 */
export const useRoom = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms.detail(id),
    queryFn: () => roomsApi.getRoom(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get room by code (for students to join)
 */
export const useJoinRoom = (code: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.rooms.byCode(code),
    queryFn: () => roomsApi.getRoomByCode(code),
    enabled: !!code && code.length === 6,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new room
 */
export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IRoomCreate) => roomsApi.createRoom(data),
    onSuccess: () => {
      // Invalidate rooms list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
    },
  });
};

/**
 * Hook to update a room
 */
export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IRoomUpdate }) =>
      roomsApi.updateRoom(id, data),
    onSuccess: (response, variables) => {
      // Update the room in cache
      queryClient.setQueryData(
        QUERY_KEYS.rooms.detail(variables.id),
        response
      );
      
      // Invalidate rooms list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
    },
  });
};

/**
 * Hook to delete a room
 */
export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomsApi.deleteRoom(id),
    onSuccess: (_, id) => {
      // Remove room from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.rooms.detail(id) });
      
      // Invalidate rooms list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
    },
  });
};

/**
 * Hook to add questions to a room
 */
export const useAddQuestionsToRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: IAddQuestionsToRoom }) =>
      roomsApi.addQuestionsToRoom(roomId, data),
    onSuccess: (response, variables) => {
      // Update the room in cache
      queryClient.setQueryData(
        QUERY_KEYS.rooms.detail(variables.roomId),
        response
      );
      
      // Invalidate rooms list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
    },
  });
};

/**
 * Hook to update room status (draft/active/closed)
 */
export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, data }: { roomId: string; data: IUpdateRoomStatus }) =>
      roomsApi.updateRoomStatus(roomId, data),
    onSuccess: (response, variables) => {
      // Update the room in cache
      queryClient.setQueryData(
        QUERY_KEYS.rooms.detail(variables.roomId),
        response
      );
      
      // Invalidate rooms list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
    },
  });
};

/**
 * Hook for optimistic room updates
 */
export const useOptimisticUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IRoomUpdate }) =>
      roomsApi.updateRoom(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.rooms.detail(id) });

      // Snapshot previous value
      const previousRoom = queryClient.getQueryData(QUERY_KEYS.rooms.detail(id));

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.rooms.detail(id), (old: unknown) => {
        const oldData = old as { data?: { room?: Record<string, unknown> } };
        return {
          ...oldData,
          data: {
            room: {
              ...oldData?.data?.room,
              ...data,
            },
          },
        };
      });

      return { previousRoom };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousRoom) {
        queryClient.setQueryData(QUERY_KEYS.rooms.detail(id), context.previousRoom);
      }
    },
    onSettled: (_, __, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms.all });
    },
  });
};
