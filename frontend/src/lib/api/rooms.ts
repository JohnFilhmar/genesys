/**
 * Rooms API service
 */

import apiClient from './client';
import {
  RoomResponse,
  RoomsResponse,
  RoomByCodeResponse,
  IRoomCreate,
  IRoomUpdate,
  IAddQuestionsToRoom,
  IUpdateRoomStatus,
  ApiResponse,
} from '@/types';

/**
 * Get all rooms for authenticated teacher
 */
export const getRooms = async (page = 1, limit = 10): Promise<RoomsResponse> => {
  const response = await apiClient.get<RoomsResponse>(
    `/rooms?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Get a single room by ID
 */
export const getRoom = async (id: string): Promise<RoomResponse> => {
  const response = await apiClient.get<RoomResponse>(`/rooms/${id}`);
  return response.data;
};

/**
 * Get room by code (public endpoint for students)
 */
export const getRoomByCode = async (code: string): Promise<RoomByCodeResponse> => {
  const response = await apiClient.get<RoomByCodeResponse>(`/rooms/code/${code}`);
  return response.data;
};

/**
 * Create a new room
 */
export const createRoom = async (data: IRoomCreate): Promise<RoomResponse> => {
  const response = await apiClient.post<RoomResponse>('/rooms', data);
  return response.data;
};

/**
 * Update an existing room
 */
export const updateRoom = async (id: string, data: IRoomUpdate): Promise<RoomResponse> => {
  const response = await apiClient.put<RoomResponse>(`/rooms/${id}`, data);
  return response.data;
};

/**
 * Delete a room
 */
export const deleteRoom = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/rooms/${id}`);
  return response.data;
};

/**
 * Add questions to a room
 */
export const addQuestionsToRoom = async (
  id: string,
  data: IAddQuestionsToRoom
): Promise<RoomResponse> => {
  const response = await apiClient.post<RoomResponse>(`/rooms/${id}/questions`, data);
  return response.data;
};

/**
 * Update room status (draft/active/closed)
 */
export const updateRoomStatus = async (
  id: string,
  data: IUpdateRoomStatus
): Promise<RoomResponse> => {
  const response = await apiClient.patch<RoomResponse>(`/rooms/${id}/status`, data);
  return response.data;
};
