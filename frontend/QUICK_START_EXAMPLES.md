# Quick Start Examples

## Complete Working Examples

### 1. Login Page (Complete)

```tsx
// app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useLogin } from '@/hooks';
import { useRouter } from 'next/navigation';
import { withGuest } from '@/middleware';

function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await login.mutateAsync(formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to GeneSys
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                email: e.target.value 
              }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                password: e.target.value 
              }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {login.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              Login failed. Please check your credentials.
            </div>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {login.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default withGuest(LoginPage);
```

### 2. Dashboard Page (Protected)

```tsx
// app/dashboard/page.tsx
'use client';

import { useAuth, useRooms, useQuestions } from '@/hooks';
import { withAuth } from '@/middleware';
import { formatDate } from '@/utils';

function DashboardPage() {
  const { data: user, isLoading: userLoading } = useAuth();
  const { data: roomsData, isLoading: roomsLoading } = useRooms(1, 5);
  const { data: questionsData, isLoading: questionsLoading } = useQuestions({ 
    limit: 5 
  });

  if (userLoading) {
    return <div className="flex justify-center items-center h-screen">
      Loading...
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mb-8">{user?.email}</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Rooms */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Rooms</h2>
            
            {roomsLoading ? (
              <p>Loading rooms...</p>
            ) : (
              <div className="space-y-3">
                {roomsData?.data.map((room) => (
                  <div 
                    key={room._id} 
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <h3 className="font-medium">{room.title}</h3>
                    <p className="text-sm text-gray-600">
                      Code: <span className="font-mono">{room.roomCode}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="capitalize">{room.status}</span>
                    </p>
                  </div>
                ))}
                
                {roomsData?.data.length === 0 && (
                  <p className="text-gray-500">No rooms yet. Create one!</p>
                )}
              </div>
            )}
          </div>

          {/* Recent Questions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Questions</h2>
            
            {questionsLoading ? (
              <p>Loading questions...</p>
            ) : (
              <div className="space-y-3">
                {questionsData?.data.map((question) => (
                  <div 
                    key={question._id} 
                    className="border-l-4 border-green-500 pl-4 py-2"
                  >
                    <p className="font-medium line-clamp-2">
                      {question.questionText}
                    </p>
                    <p className="text-sm text-gray-600">
                      {question.topic} • {question.difficulty} • {question.points}pts
                    </p>
                  </div>
                ))}
                
                {questionsData?.data.length === 0 && (
                  <p className="text-gray-500">No questions yet. Create one!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
```

### 3. Create Question Page

```tsx
// app/questions/create/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useCreateQuestion } from '@/hooks';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/middleware';
import type { 
  QuestionType, 
  QuestionTopic, 
  QuestionDifficulty 
} from '@/types';

function CreateQuestionPage() {
  const router = useRouter();
  const createQuestion = useCreateQuestion();
  
  const [formData, setFormData] = useState({
    type: 'multiple-choice' as QuestionType,
    topic: 'genetics' as QuestionTopic,
    difficulty: 'medium' as QuestionDifficulty,
    questionText: '',
    points: 10,
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await createQuestion.mutateAsync(formData);
      router.push('/questions');
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }],
    }));
  };

  const updateOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Create New Question</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Question Text *
            </label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                questionText: e.target.value 
              }))}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Topic, Difficulty, Points */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  topic: e.target.value as QuestionTopic 
                }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="genetics">Genetics</option>
                <option value="cell-structure">Cell Structure</option>
                <option value="evolution">Evolution</option>
                <option value="ecology">Ecology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  difficulty: e.target.value as QuestionDifficulty 
                }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  points: parseInt(e.target.value) 
                }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
                required
              />
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Answer Options
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <label className="flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          options: prev.options.map((opt, i) => ({
                            ...opt,
                            isCorrect: i === index,
                          })),
                        }));
                      }}
                    />
                    <span className="text-sm">Correct</span>
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Option
            </button>
          </div>

          {/* Error Message */}
          {createQuestion.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              Failed to create question. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createQuestion.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {createQuestion.isPending ? 'Creating...' : 'Create Question'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateQuestionPage);
```

### 4. Student Join Room Page

```tsx
// app/join/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useJoinRoom } from '@/hooks';
import { formatRoomCode, isValidRoomCode } from '@/utils';

export default function JoinRoomPage() {
  const [code, setCode] = useState('');
  const [submittedCode, setSubmittedCode] = useState('');
  
  const { 
    data, 
    isLoading, 
    isError 
  } = useJoinRoom(submittedCode);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formatted = formatRoomCode(code);
    
    if (isValidRoomCode(formatted)) {
      setSubmittedCode(formatted);
    } else {
      alert('Please enter a valid 6-character room code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          Join Quiz Room
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter the 6-character room code
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="ABC123"
              className="w-full px-6 py-4 text-center text-2xl font-mono tracking-wider border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Finding room...' : 'Join Room'}
          </button>
        </form>

        {/* Error State */}
        {isError && submittedCode && (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg text-center">
            Room not found. Please check the code and try again.
          </div>
        )}

        {/* Success State */}
        {data && !isLoading && (
          <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2">
              {data.data.room.title}
            </h3>
            
            {data.data.room.description && (
              <p className="text-gray-600 text-center mb-4">
                {data.data.room.description}
              </p>
            )}

            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600">Questions:</span>
                <span className="font-semibold">
                  {Array.isArray(data.data.room.questions) 
                    ? data.data.room.questions.length 
                    : 0}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold capitalize">
                  {data.data.room.status}
                </span>
              </p>
            </div>

            <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Start Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 5. Using Zustand Stores

```tsx
// components/ThemeToggle.tsx
'use client';

import { useUIStore } from '@/store';

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

```tsx
// components/Sidebar.tsx
'use client';

import { useUIStore } from '@/store';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      <button onClick={toggleSidebar} className="p-2">
        ☰ Menu
      </button>
      
      {sidebarOpen && (
        <aside className="w-64 bg-white shadow-lg">
          {/* Sidebar content */}
        </aside>
      )}
    </>
  );
}
```

### 6. App Layout with Providers

```tsx
// app/layout.tsx
import { Providers } from '@/components/Providers';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GeneSys - Digital Game-Based Learning',
  description: 'Interactive biology learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

---

## That's It! 🎉

You now have:
- ✅ Complete authentication flow
- ✅ Protected dashboard
- ✅ Question creation
- ✅ Student join interface
- ✅ Theme and sidebar management

Just copy these examples, customize the styling, and you're ready to go!
