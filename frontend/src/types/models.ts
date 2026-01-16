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
  FILL_IN_BLANK = 'fill-in-the-blank',
  ESSAY = 'essay',
  SHORT_ANSWER = 'short-answer'
}

export enum QuestionTopic {
  GENETIC_ENGINEERING = 'Genetic Engineering',
  RECOMBINANT_DNA_TECHNOLOGY = 'Recombinant DNA Technology',
  GEOLOGIC_TIMELINE = 'Geologic Timeline',
  MECHANISMS_OF_EVOLUTION = 'Mechanisms of Evolution',
  DESCENT_WITH_MODIFICATION = 'Descent with Modification',
  DEVELOPMENT_OF_EVOLUTIONARY_THOUGHT = 'Development of Evolutionary Thought',
  OTHERS = 'Others'
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface IMultipleChoiceOption {
  _id?: string;
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
  questionType: QuestionType;
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  questionText: string;
  
  // For multiple-choice
  choices?: IMultipleChoiceOption[];
  
  // For true-false, fill-in-blank (array), essay/short-answer (string), or any mixed type
  correctAnswer?: boolean | string | string[];
  
  // For matching
  pairs?: IMatchingPair[];
  
  points: number;
  timeLimit?: number; // In seconds
  createdAt: string;
  updatedAt: string;
}

export interface IQuestionCreate {
  questionType: QuestionType;
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  questionText: string;
  choices?: IMultipleChoiceOption[];
  correctAnswer?: boolean | string | string[];
  pairs?: IMatchingPair[];
  points: number;
}

export type IQuestionUpdate = Partial<IQuestionCreate>;

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

export interface IRoomSettings {
  timeLimit?: number; // in minutes
  shuffleQuestions?: boolean;
  shuffleChoices?: boolean;
  showResultsImmediately?: boolean;
  allowReview?: boolean;
  maxStudents?: number;
  requiredFields?: {
    name?: boolean;
    lrn?: boolean;
    section?: boolean;
    email?: boolean;
  };
}

export interface IRoom {
  _id: string;
  teacher: string | ITeacher; // Can be populated
  roomCode: string;
  title: string;
  description?: string;
  status: RoomStatus;
  questions: string[] | IQuestion[]; // Can be populated
  settings: IRoomSettings;
  startDate?: string;
  endDate?: string;
  stats: {
    totalParticipants: number;
    totalSubmissions: number;
    averageScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IRoomJoinResponse {
  _id?: string; // May not be included for security
  roomCode: string;
  title: string;
  description?: string;
  status?: RoomStatus;
  teacher?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  settings: IRoomSettings;
  questions?: IQuestion[];
  questionCount: number;
}

export interface IRoomCreate {
  title: string;
  description?: string;
  questions: string[]; // Question IDs
  settings: IRoomSettings;
}

export interface IRoomUpdate extends Partial<IRoom> {
  status?: RoomStatus;
}

export interface IAddQuestionsToRoom {
  questionIds: string[];
}

export interface IUpdateRoomStatus {
  status: RoomStatus;
}

// ==================== Student Response Model ====================
export interface IStudentInfo {
  name: string;
  lrn?: string;
  section?: string;
  email?: string;
}

export interface IResponseAnswer {
  questionId: string;
  answer: string | boolean | object | string[]; // Mixed type - can be string, boolean, array, object
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
}

export enum ResponseStatus {
  IN_PROGRESS = 'in-progress',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed'
}

export interface IStudentResponse {
  _id: string;
  room: string | IRoom; // Can be populated
  studentInfo: IStudentInfo;
  answers: IResponseAnswer[];
  startedAt: string;
  submittedAt?: string;
  totalTimeSpent: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: ResponseStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStudentResponseCreate {
  roomId: string;
  studentInfo: IStudentInfo;
  ipAddress?: string;
  userAgent?: string;
}
