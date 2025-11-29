/**
 * TypeScript interfaces matching backend MongoDB models
 */

// ==================== Teacher Model ====================
export interface ITeacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Not returned from API
  createdAt: string;
  updatedAt: string;
  fullName?: string; // Virtual field
}

export interface ITeacherRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ITeacherLogin {
  email: string;
  password: string;
}

export interface ITeacherUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

// ==================== Question Model ====================
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple-choice',
  TRUE_FALSE = 'true-false',
  MATCHING = 'matching',
  FILL_IN_BLANK = 'fill-in-blank',
  ESSAY = 'essay',
  SHORT_ANSWER = 'short-answer'
}

export enum QuestionTopic {
  CELL_STRUCTURE = 'cell-structure',
  GENETICS = 'genetics',
  EVOLUTION = 'evolution',
  ECOLOGY = 'ecology',
  HUMAN_BIOLOGY = 'human-biology',
  PLANT_BIOLOGY = 'plant-biology',
  BIOCHEMISTRY = 'biochemistry',
  MOLECULAR_BIOLOGY = 'molecular-biology',
  OTHER = 'other'
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface IMultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

export interface IMatchingPair {
  left: string;
  right: string;
}

export interface IQuestion {
  _id: string;
  teacher: string | ITeacher; // Can be populated
  type: QuestionType;
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  questionText: string;
  
  // For multiple-choice
  options?: IMultipleChoiceOption[];
  
  // For true-false
  correctAnswer?: boolean;
  
  // For matching
  pairs?: IMatchingPair[];
  
  // For fill-in-blank
  correctAnswers?: string[];
  
  // For essay and short-answer (no specific fields)
  
  points: number;
  timeLimit?: number; // In seconds
  createdAt: string;
  updatedAt: string;
}

export interface IQuestionCreate {
  type: QuestionType;
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  questionText: string;
  options?: IMultipleChoiceOption[];
  correctAnswer?: boolean;
  pairs?: IMatchingPair[];
  correctAnswers?: string[];
  points: number;
  timeLimit?: number;
}

export interface IQuestionUpdate extends Partial<IQuestionCreate> {}

export interface IQuestionFilters {
  topic?: QuestionTopic;
  difficulty?: QuestionDifficulty;
  type?: QuestionType;
  page?: number;
  limit?: number;
}

// ==================== Room Model ====================
export enum RoomStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed'
}

export interface IRoom {
  _id: string;
  teacher: string | ITeacher; // Can be populated
  roomCode: string;
  title: string;
  description?: string;
  status: RoomStatus;
  questions: string[] | IQuestion[]; // Can be populated
  maxStudents?: number;
  allowLateJoin: boolean;
  showResults: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRoomCreate {
  title: string;
  description?: string;
  questions?: string[]; // Question IDs
  maxStudents?: number;
  allowLateJoin?: boolean;
  showResults?: boolean;
}

export interface IRoomUpdate extends Partial<IRoomCreate> {
  status?: RoomStatus;
}

export interface IAddQuestionsToRoom {
  questionIds: string[];
}

export interface IUpdateRoomStatus {
  status: RoomStatus;
}

// ==================== Student Response Model ====================
export interface IStudentResponse {
  _id: string;
  room: string | IRoom; // Can be populated
  question: string | IQuestion; // Can be populated
  studentName: string;
  studentAnswer: any; // Can be string, boolean, array, etc.
  isCorrect?: boolean;
  score: number;
  timeSpent?: number; // In seconds
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStudentResponseCreate {
  room: string;
  question: string;
  studentName: string;
  studentAnswer: any;
  timeSpent?: number;
}
