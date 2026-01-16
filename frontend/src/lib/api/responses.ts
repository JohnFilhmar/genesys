import apiClient from './client';
import type { IStudentResponse, IStudentInfo } from '@/types';

// Response API interfaces
interface CreateResponsePayload {
  roomId: string;
  studentInfo: IStudentInfo;
  ipAddress?: string;
  userAgent?: string;
}

interface UpdateResponsePayload {
  answers: Array<{
    questionId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: any;
    timeSpent?: number;
  }>;
  totalTimeSpent?: number;
}

interface SubmitResponsePayload {
  answers: Array<{
    questionId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: any;
    timeSpent?: number;
  }>;
  totalTimeSpent: number;
}

interface GradeAnswerPayload {
  questionId: string;
  isCorrect: boolean;
  pointsEarned: number;
}

interface ResponseStats {
  total: number;
  submitted: number;
  inProgress: number;
  averageScore: number;
  averagePercentage: number;
  averageTime: number;
}

interface RoomResponsesResponse {
  success: boolean;
  count: number;
  stats: ResponseStats;
  data: IStudentResponse[];
}

/**
 * Create a new response when student joins a room
 */
export const createResponse = async (
  payload: CreateResponsePayload
): Promise<IStudentResponse> => {
  const { data } = await apiClient.post<{ success: boolean; data: IStudentResponse }>(
    '/responses',
    payload
  );
  return data.data;
};

/**
 * Update response answers while taking quiz
 */
export const updateResponse = async (
  responseId: string,
  payload: UpdateResponsePayload
): Promise<IStudentResponse> => {
  const { data } = await apiClient.put<{ success: boolean; data: IStudentResponse }>(
    `/responses/${responseId}`,
    payload
  );
  return data.data;
};

/**
 * Submit response (finalize and auto-grade)
 */
export const submitResponse = async (
  responseId: string,
  payload: SubmitResponsePayload
): Promise<IStudentResponse> => {
  const { data } = await apiClient.post<{ success: boolean; data: IStudentResponse }>(
    `/responses/${responseId}/submit`,
    payload
  );
  return data.data;
};

/**
 * Get all responses for a room (teacher analytics)
 */
export const getRoomResponses = async (
  roomId: string,
  status?: 'in-progress' | 'submitted' | 'reviewed'
): Promise<RoomResponsesResponse> => {
  const params = status ? { status } : {};
  const { data } = await apiClient.get<RoomResponsesResponse>(
    `/responses/room/${roomId}`,
    { params }
  );
  return data;
};

/**
 * Get a single response by ID
 */
export const getResponse = async (responseId: string): Promise<IStudentResponse> => {
  const { data } = await apiClient.get<{ success: boolean; data: IStudentResponse }>(
    `/responses/${responseId}`
  );
  return data.data;
};

/**
 * Delete a response (teacher only)
 */
export const deleteResponse = async (responseId: string): Promise<void> => {
  await apiClient.delete(`/responses/${responseId}`);
};

/**
 * Grade a response manually (for essay/short-answer questions)
 */
export const gradeResponse = async (
  responseId: string,
  answers: GradeAnswerPayload[]
): Promise<IStudentResponse> => {
  const { data } = await apiClient.put<{ success: boolean; data: IStudentResponse }>(
    `/responses/${responseId}/grade`,
    { answers }
  );
  return data.data;
};
