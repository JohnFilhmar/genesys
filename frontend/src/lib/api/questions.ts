import apiClient from './client';
import {
  QuestionResponse,
  QuestionsResponse,
  QuestionsByTopicResponse,
  IQuestionCreate,
  IQuestionUpdate,
  IQuestionFilters,
  ApiResponse,
} from '@/types';

/**
 * Get all questions with pagination and filters
 */
export const getQuestions = async (filters?: IQuestionFilters): Promise<QuestionsResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.topic) params.append('topic', filters.topic);
  if (filters?.difficulty) params.append('difficulty', filters.difficulty);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const response = await apiClient.get<QuestionsResponse>(
    `/questions${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data;
};

/**
 * Get a single question by ID
 */
export const getQuestion = async (id: string): Promise<QuestionResponse> => {
  const response = await apiClient.get<QuestionResponse>(`/questions/${id}`);
  return response.data;
};

/**
 * Create a new question
 */
export const createQuestion = async (data: IQuestionCreate): Promise<QuestionResponse> => {
  const response = await apiClient.post<QuestionResponse>('/questions', data);
  return response.data;
};

/**
 * Update an existing question
 */
export const updateQuestion = async (
  id: string,
  data: IQuestionUpdate
): Promise<QuestionResponse> => {
  const response = await apiClient.put<QuestionResponse>(`/questions/${id}`, data);
  return response.data;
};

/**
 * Delete a question
 */
export const deleteQuestion = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/questions/${id}`);
  return response.data;
};

/**
 * Get questions by topic
 */
export const getQuestionsByTopic = async (topic: string): Promise<QuestionsByTopicResponse> => {
  const response = await apiClient.get<QuestionsByTopicResponse>(`/questions/topic/${topic}`);
  return response.data;
};
