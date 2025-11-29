import { create } from 'zustand';
import { IRoom, IQuestion } from '@/types';

interface AppState {
  // Current room context
  currentRoom: IRoom | null;
  setCurrentRoom: (room: IRoom | null) => void;

  // Active quiz session
  activeQuiz: {
    roomId: string;
    questions: IQuestion[];
    currentQuestionIndex: number;
    startedAt: Date;
  } | null;
  startQuiz: (roomId: string, questions: IQuestion[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  endQuiz: () => void;

  // Student responses during quiz
  studentResponses: Record<string, unknown>;
  addStudentResponse: (questionId: string, response: unknown) => void;
  clearResponses: () => void;

  // Room filters/search
  roomFilters: {
    search: string;
    status: 'all' | 'draft' | 'active' | 'closed';
  };
  setRoomFilters: (filters: Partial<AppState['roomFilters']>) => void;

  // Question filters/search
  questionFilters: {
    search: string;
    topic: string | null;
    difficulty: string | null;
    type: string | null;
  };
  setQuestionFilters: (filters: Partial<AppState['questionFilters']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Current room
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),

  // Active quiz
  activeQuiz: null,
  startQuiz: (roomId, questions) =>
    set({
      activeQuiz: {
        roomId,
        questions,
        currentQuestionIndex: 0,
        startedAt: new Date(),
      },
    }),
  nextQuestion: () =>
    set((state) => {
      if (!state.activeQuiz) return state;
      return {
        activeQuiz: {
          ...state.activeQuiz,
          currentQuestionIndex: Math.min(
            state.activeQuiz.currentQuestionIndex + 1,
            state.activeQuiz.questions.length - 1
          ),
        },
      };
    }),
  previousQuestion: () =>
    set((state) => {
      if (!state.activeQuiz) return state;
      return {
        activeQuiz: {
          ...state.activeQuiz,
          currentQuestionIndex: Math.max(state.activeQuiz.currentQuestionIndex - 1, 0),
        },
      };
    }),
  endQuiz: () => set({ activeQuiz: null, studentResponses: {} }),

  // Student responses
  studentResponses: {},
  addStudentResponse: (questionId, response) =>
    set((state) => ({
      studentResponses: {
        ...state.studentResponses,
        [questionId]: response,
      },
    })),
  clearResponses: () => set({ studentResponses: {} }),

  // Room filters
  roomFilters: {
    search: '',
    status: 'all',
  },
  setRoomFilters: (filters) =>
    set((state) => ({
      roomFilters: { ...state.roomFilters, ...filters },
    })),

  // Question filters
  questionFilters: {
    search: '',
    topic: null,
    difficulty: null,
    type: null,
  },
  setQuestionFilters: (filters) =>
    set((state) => ({
      questionFilters: { ...state.questionFilters, ...filters },
    })),
}));
