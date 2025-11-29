# Frontend API Integration Layer - Usage Guide

## Overview

This directory contains the complete API integration layer for the GeneSys frontend. It provides React Query hooks, Zustand stores, TypeScript types, and utilities that you can use in your components to interact with the backend API.

## Table of Contents

- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [Data Fetching](#data-fetching)
- [State Management](#state-management)
- [Utilities](#utilities)
- [Examples](#examples)

---

## Getting Started

### 1. Wrap Your App with Providers

First, wrap your application with the `Providers` component in your root layout:

```tsx
// src/app/layout.tsx
import { Providers } from '@/components/Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### 2. Environment Variables

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ENV=development
```

---

## Architecture

### Directory Structure

```
src/
├── lib/
│   ├── api/              # API service modules
│   │   ├── client.ts     # Axios client with interceptors
│   │   ├── auth.ts       # Authentication API calls
│   │   ├── questions.ts  # Questions API calls
│   │   └── rooms.ts      # Rooms API calls
│   └── react-query.tsx   # React Query provider setup
├── hooks/
│   ├── useAuth.ts        # Authentication hooks
│   ├── useQuestions.ts   # Question management hooks
│   └── useRooms.ts       # Room management hooks
├── store/
│   ├── authStore.ts      # Auth state (Zustand)
│   ├── uiStore.ts        # UI state (Zustand)
│   └── appStore.ts       # App state (Zustand)
├── types/
│   ├── models.ts         # Backend model interfaces
│   └── api.ts            # API response types
├── utils/
│   ├── token.ts          # Token management
│   ├── errors.ts         # Error handling
│   ├── date.ts           # Date formatting
│   └── roomCode.ts       # Room code utilities
└── middleware/
    ├── withAuth.tsx      # HOC for protected routes
    └── routeGuard.ts     # Route protection utilities
```

---

## Authentication

### Login Example

```tsx
'use client';

import { useLogin } from '@/hooks';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login.mutateAsync({ email, password });
      // Token is automatically stored
      // User data is cached in React Query
      // Redirect handled by your component
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
      {login.isError && <p>Login failed</p>}
    </form>
  );
}
```

### Register Example

```tsx
import { useRegister } from '@/hooks';

export default function RegisterPage() {
  const register = useRegister();

  const handleRegister = async (data: ITeacherRegistration) => {
    await register.mutateAsync(data);
  };

  // ... form implementation
}
```

### Get Current User

```tsx
import { useAuth } from '@/hooks';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;

  return (
    <div>
      <h1>Welcome, {user?.fullName || user?.firstName}!</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### Logout

```tsx
import { useLogout } from '@/hooks';

export default function LogoutButton() {
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    // Token removed, cache cleared
    // Redirect to login
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Protect Routes

```tsx
// Option 1: Using HOC
import { withAuth } from '@/middleware';

function DashboardPage() {
  return <div>Protected Dashboard</div>;
}

export default withAuth(DashboardPage);

// Option 2: Using hooks
import { useRequireAuth } from '@/middleware';

export default function DashboardPage() {
  useRequireAuth(); // Redirects if not authenticated

  return <div>Protected Dashboard</div>;
}
```

---

## Data Fetching

### Questions

#### Get All Questions

```tsx
import { useQuestions } from '@/hooks';

export default function QuestionsPage() {
  const { data, isLoading, isError } = useQuestions({
    page: 1,
    limit: 10,
    topic: 'genetics',
    difficulty: 'medium'
  });

  if (isLoading) return <div>Loading questions...</div>;
  if (isError) return <div>Error loading questions</div>;

  return (
    <div>
      {data?.data.map((question) => (
        <div key={question._id}>
          <h3>{question.questionText}</h3>
          <p>Topic: {question.topic}</p>
          <p>Difficulty: {question.difficulty}</p>
        </div>
      ))}
      <p>Total: {data?.pagination.total}</p>
    </div>
  );
}
```

#### Get Single Question

```tsx
import { useQuestion } from '@/hooks';

export default function QuestionDetail({ id }: { id: string }) {
  const { data, isLoading } = useQuestion(id);

  if (isLoading) return <div>Loading...</div>;

  const question = data?.data.question;

  return <div>{question?.questionText}</div>;
}
```

#### Create Question

```tsx
import { useCreateQuestion } from '@/hooks';

export default function CreateQuestionForm() {
  const createQuestion = useCreateQuestion();

  const handleSubmit = async (data: IQuestionCreate) => {
    try {
      await createQuestion.mutateAsync(data);
      // Question created, cache invalidated automatically
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        type: 'multiple-choice',
        topic: 'genetics',
        difficulty: 'easy',
        questionText: 'What is DNA?',
        options: [
          { text: 'Deoxyribonucleic acid', isCorrect: true },
          { text: 'Ribonucleic acid', isCorrect: false }
        ],
        points: 10
      });
    }}>
      <button type="submit" disabled={createQuestion.isPending}>
        {createQuestion.isPending ? 'Creating...' : 'Create Question'}
      </button>
    </form>
  );
}
```

#### Update Question

```tsx
import { useUpdateQuestion } from '@/hooks';

export default function EditQuestionForm({ questionId }: { questionId: string }) {
  const updateQuestion = useUpdateQuestion();

  const handleUpdate = async (data: IQuestionUpdate) => {
    await updateQuestion.mutateAsync({ id: questionId, data });
  };

  // ... form implementation
}
```

#### Delete Question

```tsx
import { useDeleteQuestion } from '@/hooks';

export default function DeleteQuestionButton({ id }: { id: string }) {
  const deleteQuestion = useDeleteQuestion();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await deleteQuestion.mutateAsync(id);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### Rooms

#### Get All Rooms

```tsx
import { useRooms } from '@/hooks';

export default function RoomsPage() {
  const { data, isLoading } = useRooms(1, 10);

  if (isLoading) return <div>Loading rooms...</div>;

  return (
    <div>
      {data?.data.map((room) => (
        <div key={room._id}>
          <h3>{room.title}</h3>
          <p>Code: {room.roomCode}</p>
          <p>Status: {room.status}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Get Room by Code (Student Join)

```tsx
import { useJoinRoom } from '@/hooks';
import { useState } from 'react';

export default function JoinRoomPage() {
  const [code, setCode] = useState('');
  const { data, isLoading, isError } = useJoinRoom(code);

  return (
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        maxLength={6}
        placeholder="Enter room code"
      />
      {isLoading && <p>Loading room...</p>}
      {isError && <p>Room not found</p>}
      {data && (
        <div>
          <h2>{data.data.room.title}</h2>
          <p>{data.data.room.description}</p>
        </div>
      )}
    </div>
  );
}
```

#### Create Room

```tsx
import { useCreateRoom } from '@/hooks';

export default function CreateRoomForm() {
  const createRoom = useCreateRoom();

  const handleCreate = async () => {
    await createRoom.mutateAsync({
      title: 'Biology Quiz 1',
      description: 'Chapter 1-3 Review',
      allowLateJoin: true,
      showResults: true
    });
  };

  return <button onClick={handleCreate}>Create Room</button>;
}
```

#### Update Room Status

```tsx
import { useUpdateRoomStatus } from '@/hooks';

export default function RoomStatusControl({ roomId }: { roomId: string }) {
  const updateStatus = useUpdateRoomStatus();

  const activateRoom = async () => {
    await updateStatus.mutateAsync({
      roomId,
      data: { status: 'active' }
    });
  };

  return <button onClick={activateRoom}>Start Quiz</button>;
}
```

#### Add Questions to Room

```tsx
import { useAddQuestionsToRoom } from '@/hooks';

export default function AddQuestionsButton({ 
  roomId, 
  questionIds 
}: { 
  roomId: string; 
  questionIds: string[] 
}) {
  const addQuestions = useAddQuestionsToRoom();

  const handleAdd = async () => {
    await addQuestions.mutateAsync({
      roomId,
      data: { questionIds }
    });
  };

  return <button onClick={handleAdd}>Add Questions</button>;
}
```

---

## State Management

### Auth Store (Zustand)

```tsx
import { useAuthStore } from '@/store';

export default function UserProfile() {
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <p>Logged in as {user?.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
```

### UI Store

```tsx
import { useUIStore } from '@/store';

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={sidebarOpen ? 'open' : 'closed'}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  );
}
```

### App Store

```tsx
import { useAppStore } from '@/store';

export default function QuizSession() {
  const { 
    activeQuiz, 
    startQuiz, 
    nextQuestion, 
    endQuiz 
  } = useAppStore();

  if (!activeQuiz) {
    return <button onClick={() => startQuiz('room123', questions)}>
      Start Quiz
    </button>;
  }

  return (
    <div>
      <h2>Question {activeQuiz.currentQuestionIndex + 1}</h2>
      <button onClick={nextQuestion}>Next</button>
      <button onClick={endQuiz}>End Quiz</button>
    </div>
  );
}
```

---

## Utilities

### Token Management

```tsx
import { getToken, setToken, removeToken, isAuthenticated } from '@/utils';

// Check if user has token
if (isAuthenticated()) {
  console.log('User is logged in');
}

// Get token for manual API calls
const token = getToken();

// Manually set token (usually not needed)
setToken('your-jwt-token');

// Remove token
removeToken();
```

### Error Handling

```tsx
import { formatErrorMessage, parseApiError } from '@/utils';

try {
  await someApiCall();
} catch (error) {
  const message = formatErrorMessage(error);
  console.error(message);
}
```

### Date Formatting

```tsx
import { formatDate, formatDateTime, getRelativeTime } from '@/utils';

const createdAt = room.createdAt;

<p>Created: {formatDate(createdAt)}</p>
<p>Full: {formatDateTime(createdAt)}</p>
<p>Relative: {getRelativeTime(createdAt)}</p>
```

### Room Code Validation

```tsx
import { isValidRoomCode, formatRoomCode, displayRoomCode } from '@/utils';

const code = 'abc123';

if (isValidRoomCode(formatRoomCode(code))) {
  console.log('Valid code');
}

// Display with hyphen: ABC-123
<p>Code: {displayRoomCode(code)}</p>
```

---

## React Query Features

### Loading States

```tsx
const { data, isLoading, isFetching, isError, error } = useQuestions();

if (isLoading) return <Spinner />;
if (isError) return <Error message={error.message} />;

return <QuestionsList questions={data?.data} />;
```

### Automatic Refetching

React Query automatically refetches data when:
- Component remounts
- Window regains focus
- Network reconnects

### Cache Invalidation

Mutations automatically invalidate related queries:

```tsx
const createQuestion = useCreateQuestion();

// After creating, the questions list is automatically refetched
await createQuestion.mutateAsync(newQuestion);
```

### Optimistic Updates

Use optimistic update hooks for instant UI feedback:

```tsx
import { useOptimisticUpdateQuestion } from '@/hooks';

const updateQuestion = useOptimisticUpdateQuestion();

// UI updates immediately, rolls back on error
await updateQuestion.mutateAsync({ id, data });
```

---

## Best Practices

### 1. Use React Query for Server State

```tsx
// ✅ Good - Use hooks for API data
const { data: user } = useAuth();

// ❌ Bad - Don't store API data in local state
const [user, setUser] = useState(null);
```

### 2. Use Zustand for Client State

```tsx
// ✅ Good - UI state in Zustand
const { theme, setTheme } = useUIStore();

// ❌ Bad - Don't use React Query for UI state
```

### 3. Handle Loading and Error States

```tsx
const { data, isLoading, isError } = useQuestions();

if (isLoading) return <Skeleton />;
if (isError) return <ErrorAlert />;
if (!data) return null;

return <QuestionsList data={data} />;
```

### 4. Use TypeScript Types

```tsx
import { IQuestion, IRoom } from '@/types';

const question: IQuestion = data?.data.question;
```

---

## API Endpoints Reference

All hooks correspond to these backend endpoints:

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `GET /api/questions/topic/:topic` - Get by topic

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/rooms/code/:code` - Get room by code (public)
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `POST /api/rooms/:id/questions` - Add questions
- `PATCH /api/rooms/:id/status` - Update status

---

## Troubleshooting

### Token Issues

If you get 401 errors:
1. Check if `NEXT_PUBLIC_API_URL` is set correctly
2. Verify token exists: `console.log(getToken())`
3. Check token expiration: `isTokenExpired(token)`

### CORS Errors

Make sure backend CORS is configured for `http://localhost:3000`

### Type Errors

All types are exported from `@/types`:

```tsx
import type { IQuestion, IRoom, ITeacher } from '@/types';
```

---

## Next Steps

Now you can:
1. Create your UI components
2. Use these hooks to fetch/mutate data
3. Use stores for client state
4. Protect routes with middleware
5. Handle loading/error states in your components

All the data layer is ready - just build your components and plug in the hooks! 🚀
