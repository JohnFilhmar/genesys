/**
 * Question management hooks using React Query
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/lib/api';
import { QUERY_KEYS } from '@/types';
import type {
  IQuestionCreate,
  IQuestionUpdate,
  IQuestionFilters,
  QuestionTopic,
} from '@/types';

/**
 * Hook to get all questions with filters and pagination
 */
export const useQuestions = (filters?: IQuestionFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.questions.list(filters),
    queryFn: () => questionsApi.getQuestions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single question by ID
 */
export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.questions.detail(id),
    queryFn: () => questionsApi.getQuestion(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get questions by topic
 */
export const useQuestionsByTopic = (topic: QuestionTopic) => {
  return useQuery({
    queryKey: QUERY_KEYS.questions.byTopic(topic),
    queryFn: () => questionsApi.getQuestionsByTopic(topic),
    enabled: !!topic,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a new question
 */
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IQuestionCreate) => questionsApi.createQuestion(data),
    onSuccess: () => {
      // Invalidate questions list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.all });
    },
  });
};

/**
 * Hook to update a question
 */
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IQuestionUpdate }) =>
      questionsApi.updateQuestion(id, data),
    onSuccess: (response, variables) => {
      // Update the question in cache
      queryClient.setQueryData(
        QUERY_KEYS.questions.detail(variables.id),
        response
      );
      
      // Invalidate questions list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.all });
    },
  });
};

/**
 * Hook to delete a question
 */
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionsApi.deleteQuestion(id),
    onSuccess: (_, id) => {
      // Remove question from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.questions.detail(id) });
      
      // Invalidate questions list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.all });
    },
  });
};

/**
 * Hook for optimistic question updates
 */
export const useOptimisticUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IQuestionUpdate }) =>
      questionsApi.updateQuestion(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.questions.detail(id) });

      // Snapshot previous value
      const previousQuestion = queryClient.getQueryData(QUERY_KEYS.questions.detail(id));

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.questions.detail(id), (old: unknown) => {
        const oldData = old as { data?: { question?: Record<string, unknown> } };
        return {
          ...oldData,
          data: {
            question: {
              ...oldData?.data?.question,
              ...data,
            },
          },
        };
      });

      return { previousQuestion };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousQuestion) {
        queryClient.setQueryData(QUERY_KEYS.questions.detail(id), context.previousQuestion);
      }
    },
    onSettled: (_, __, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.detail(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.all });
    },
  });
};
