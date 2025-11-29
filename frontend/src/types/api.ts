import { ITeacher, IQuestion, IRoom } from './models';

// ==================== Base API Response ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  stack?: string; // Only in development
}

// ==================== Pagination ====================
export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== Authentication Responses ====================
export interface AuthResponse {
  success: boolean;
  message: string;
  data: ITeacher;
  token: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    teacher: ITeacher;
  };
}

// ==================== Question Responses ====================
export interface QuestionResponse {
  success: boolean;
  message: string;
  data: {
    question: IQuestion;
  };
}

export interface QuestionsResponse extends PaginatedResponse<IQuestion> {}

export interface QuestionsByTopicResponse {
  success: boolean;
  message: string;
  data: {
    questions: IQuestion[];
  };
}

// ==================== Room Responses ====================
export interface RoomResponse {
  success: boolean;
  message: string;
  data: {
    room: IRoom;
  };
}

export interface RoomsResponse extends PaginatedResponse<IRoom> {}

export interface RoomByCodeResponse {
  success: boolean;
  message: string;
  data: {
    room: IRoom;
  };
}

// ==================== Query Keys ====================
export const QUERY_KEYS = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
    profile: ['auth', 'profile'] as const,
  },
  
  // Questions
  questions: {
    all: ['questions'] as const,
    list: (filters?: Record<string, any>) => 
      ['questions', 'list', filters] as const,
    detail: (id: string) => 
      ['questions', 'detail', id] as const,
    byTopic: (topic: string) => 
      ['questions', 'byTopic', topic] as const,
  },
  
  // Rooms
  rooms: {
    all: ['rooms'] as const,
    list: (filters?: Record<string, any>) => 
      ['rooms', 'list', filters] as const,
    detail: (id: string) => 
      ['rooms', 'detail', id] as const,
    byCode: (code: string) => 
      ['rooms', 'byCode', code] as const,
  },
  
  // Student Responses
  responses: {
    all: ['responses'] as const,
    byRoom: (roomId: string) => 
      ['responses', 'byRoom', roomId] as const,
    byQuestion: (questionId: string) => 
      ['responses', 'byQuestion', questionId] as const,
  },
} as const;

// ==================== API Error Types ====================
export class ApiErrorException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message);
    this.name = 'ApiErrorException';
  }
}
