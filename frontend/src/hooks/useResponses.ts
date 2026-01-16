import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { responsesApi } from '@/lib/api';
import type { 
  IStudentInfo,
  ResponseStatus 
} from '@/types';

// ==================== Query Keys ====================
export const responseKeys = {
  all: ['responses'] as const,
  response: (id: string) => [...responseKeys.all, id] as const,
  roomResponses: (roomId: string, status?: ResponseStatus) => 
    [...responseKeys.all, 'room', roomId, status] as const,
};

// ==================== Create Response ====================
interface CreateResponseParams {
  roomId: string;
  studentInfo: IStudentInfo;
  ipAddress?: string;
  userAgent?: string;
}

export const useCreateResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateResponseParams) => 
      responsesApi.createResponse(params),
    onSuccess: (data) => {
      // Invalidate room responses
      queryClient.invalidateQueries({ 
        queryKey: responseKeys.roomResponses(data.room as string) 
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const message = axiosError?.response?.data?.message || axiosError?.response?.data?.error || 'Failed to join room';
      console.error('Failed to create response:', { error, message });
      throw error;
    },
  });
};

// ==================== Update Response ====================
interface UpdateResponseParams {
  responseId: string;
  answers: Array<{
    questionId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: any;
    timeSpent?: number;
  }>;
  totalTimeSpent?: number;
}

export const useUpdateResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId, ...payload }: UpdateResponseParams) => 
      responsesApi.updateResponse(responseId, payload),
    onSuccess: (data) => {
      // Update cached response
      queryClient.setQueryData(
        responseKeys.response(data._id),
        data
      );
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const message = axiosError?.response?.data?.message || axiosError?.response?.data?.error || 'Failed to update response';
      console.error('Failed to update response:', { error, message });
      throw error; // Re-throw to allow components to handle it
    },
  });
};

// ==================== Submit Response ====================
interface SubmitResponseParams {
  responseId: string;
  answers: Array<{
    questionId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    answer: any;
    timeSpent?: number;
  }>;
  totalTimeSpent: number;
}

export const useSubmitResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId, ...payload }: SubmitResponseParams) => 
      responsesApi.submitResponse(responseId, payload),
    onSuccess: (data) => {
      // Update cached response
      queryClient.setQueryData(
        responseKeys.response(data._id),
        data
      );
      
      // Invalidate room responses
      queryClient.invalidateQueries({ 
        queryKey: responseKeys.roomResponses(data.room as string) 
      });
      
      console.log('Quiz submitted successfully!');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const message = axiosError?.response?.data?.message || axiosError?.response?.data?.error || 'Failed to submit quiz';
      console.error('Failed to submit quiz:', { error, message });
      throw error; // Re-throw to allow components to handle it
    },
  });
};

// ==================== Get Response ====================
export const useResponse = (responseId: string) => {
  return useQuery({
    queryKey: responseKeys.response(responseId),
    queryFn: () => responsesApi.getResponse(responseId),
    enabled: !!responseId,
  });
};

// ==================== Get Room Responses ====================
interface UseRoomResponsesParams {
  roomId: string;
  status?: ResponseStatus;
  enabled?: boolean;
}

export const useRoomResponses = ({ 
  roomId, 
  status, 
  enabled = true 
}: UseRoomResponsesParams) => {
  return useQuery({
    queryKey: responseKeys.roomResponses(roomId, status),
    queryFn: () => responsesApi.getRoomResponses(roomId, status),
    enabled: enabled && !!roomId,
  });
};

// ==================== Delete Response ====================
export const useDeleteResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responseId: string) => responsesApi.deleteResponse(responseId),
    onSuccess: (_, responseId) => {
      // Remove from cache
      queryClient.removeQueries({ 
        queryKey: responseKeys.response(responseId) 
      });
      
      // Invalidate all room responses
      queryClient.invalidateQueries({ 
        queryKey: responseKeys.all 
      });
      
      console.log('Response deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const message = axiosError?.response?.data?.message || axiosError?.response?.data?.error || 'Failed to delete response';
      console.error('Failed to delete response:', { error, message });
      throw error;
    },
  });
};

// ==================== Grade Response ====================
interface GradeResponseParams {
  responseId: string;
  answers: Array<{
    questionId: string;
    isCorrect: boolean;
    pointsEarned: number;
  }>;
}

export const useGradeResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId, answers }: GradeResponseParams) => 
      responsesApi.gradeResponse(responseId, answers),
    onSuccess: (data) => {
      // Update cached response
      queryClient.setQueryData(
        responseKeys.response(data._id),
        data
      );
      
      // Invalidate room responses
      queryClient.invalidateQueries({ 
        queryKey: responseKeys.roomResponses(data.room as string) 
      });
      
      console.log('Response graded successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const message = axiosError?.response?.data?.message || axiosError?.response?.data?.error || 'Failed to grade response';
      console.error('Failed to grade response:', { error, message });
      throw error;
    },
  });
};
