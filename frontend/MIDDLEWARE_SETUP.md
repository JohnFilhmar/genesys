# Authentication Middleware Setup Guide

## Overview

The GeneSys frontend now includes a **Next.js middleware** that handles authentication and route protection automatically. This middleware runs on every request before rendering pages.

## Features

✅ **Automatic Route Protection** - Protects dashboard, rooms, questions, and profile routes  
✅ **JWT Token Verification** - Verifies tokens using the secret from environment variables  
✅ **Cookie & Header Support** - Checks both cookies and Authorization headers  
✅ **Decoded Token Storage** - Stores decoded token data in Zustand state  
✅ **Smart Redirects** - Redirects unauthenticated users to login, authenticated users away from login  
✅ **Server-Side Headers** - Passes user data to server components via headers  

---

## Setup Instructions

### 1. Install Required Dependency

```bash
npm install jose
```

The `jose` library is used for secure JWT verification in the middleware.

### 2. Configure Environment Variables

Create or update `frontend/.env.local`:

```env
# JWT Secret (must match backend secret)
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** The JWT secret MUST match your backend secret!

### 3. Middleware Configuration

The middleware is located at `src/middleware.ts` and runs automatically.

**Public Routes** (no authentication required):
- `/` - Home/landing page
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset

**Protected Routes** (authentication required):
- `/dashboard` - Teacher dashboard
- `/rooms` - Room management
- `/questions` - Question bank
- `/profile` - User profile
- `/settings` - Settings

---

## How It Works

### 1. Token Storage

When a user logs in, tokens are stored in **two places**:

```typescript
// In your login handler
const { data } = await loginMutation.mutateAsync({ email, password });

// Store in Zustand + localStorage + cookie
useAuthStore.getState().setToken(data.token);
```

This stores the token in:
- ✅ **localStorage** - For client-side access
- ✅ **Cookie** - For middleware access (server-side)
- ✅ **Zustand store** - For React components

### 2. Middleware Flow

```
User visits page
      ↓
Middleware runs
      ↓
Check for token in cookies/headers
      ↓
Verify token with JWT secret
      ↓
Token valid?
   ├─ Yes → Allow access (if protected route)
   │         Redirect to dashboard (if on login page)
   └─ No  → Redirect to login (if protected route)
             Allow access (if public route)
```

### 3. Token Verification

The middleware verifies tokens using the `jose` library:

```typescript
import { jwtVerify } from 'jose';

async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET
  );
  
  const { payload } = await jwtVerify(token, secret);
  return payload; // Contains userId, email, role, etc.
}
```

---

## Usage in Components

### Check Authentication Status

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { isAuthenticated, decodedToken, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {decodedToken?.email}</h1>
      <p>Role: {decodedToken?.role}</p>
    </div>
  );
}
```

### Logout

```typescript
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

function LogoutButton() {
  const logout = useAuthStore(state => state.logout);
  const router = useRouter();
  
  const handleLogout = () => {
    logout(); // Clears tokens, cookies, and state
    router.push('/login');
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

### Access User Data from Server Components

The middleware passes user data via headers:

```typescript
// In a server component or API route
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');
  const isAuthenticated = headersList.get('x-authenticated') === 'true';
  
  return <div>User ID: {userId}</div>;
}
```

---

## Customization

### Add/Remove Protected Routes

Edit `src/middleware.ts`:

```typescript
const PROTECTED_ROUTES = [
  '/dashboard',
  '/rooms',
  '/questions',
  '/profile',
  '/settings',
  '/my-custom-route', // Add your route here
];
```

### Change Default Redirect Paths

```typescript
const DEFAULT_PROTECTED_PATH = '/dashboard'; // Where authenticated users go
const DEFAULT_PUBLIC_PATH = '/'; // Where logged-out users go
```

### Custom Token Claims

If your backend includes custom JWT claims, update the middleware:

```typescript
// In src/middleware.ts, add custom headers
response.headers.set('x-user-department', decodedToken.department || '');
response.headers.set('x-user-permissions', JSON.stringify(decodedToken.permissions || []));
```

---

## Debugging

### Enable Logging

Add console logs in `src/middleware.ts`:

```typescript
export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware running for:', request.nextUrl.pathname);
  
  // ... existing code
  
  if (isAuthenticated) {
    console.log('✅ User authenticated:', decodedToken.email);
  } else {
    console.log('❌ User not authenticated');
  }
}
```

### Check Token in Browser

```javascript
// In browser console
document.cookie.split(';').find(c => c.trim().startsWith('token='))
localStorage.getItem('genesys_auth_token')
```

### Verify JWT Secret Match

Ensure frontend and backend use the same secret:

```bash
# Backend .env
JWT_SECRET=your-secret-key

# Frontend .env.local
JWT_SECRET=your-secret-key
NEXT_PUBLIC_JWT_SECRET=your-secret-key
```

---

## Security Notes

🔒 **HTTPS Required in Production** - Cookies with `Secure` flag only work over HTTPS  
🔒 **SameSite Protection** - Cookies use `SameSite=Lax` to prevent CSRF attacks  
🔒 **Token Expiration** - Middleware checks token expiration automatically  
🔒 **Secret Storage** - Never commit `.env.local` to git  

---

## Testing

### Test Protected Route Access

1. Go to `http://localhost:3000/dashboard` (logged out)
2. Should redirect to `/login?redirect=/dashboard`
3. Log in successfully
4. Should redirect back to `/dashboard`

### Test Public Route Access

1. Log in to your account
2. Go to `http://localhost:3000/login`
3. Should redirect to `/dashboard`

### Test Token Expiration

1. Log in with a short-lived token
2. Wait for token to expire
3. Try to access protected route
4. Should redirect to login

---

## Troubleshooting

### "Invalid token" error

- Check that JWT secret matches between frontend and backend
- Verify token format is correct (should have 3 parts: `xxx.yyy.zzz`)
- Check token hasn't expired

### Middleware not running

- Verify `src/middleware.ts` exists in the correct location
- Check the `matcher` config in the middleware
- Ensure route is not in the excluded paths

### Cookie not being set

- Check browser developer tools → Application → Cookies
- Verify `Secure` flag is compatible with your environment (HTTP vs HTTPS)
- Try removing `Secure` flag for local development

### Infinite redirect loop

- Check that public routes are correctly defined
- Verify protected route logic doesn't redirect to itself
- Ensure login page is in the public routes list

---

## Next Steps

- [ ] Install `jose` package: `npm install jose`
- [ ] Configure environment variables
- [ ] Update login handler to use `setToken()`
- [ ] Test authentication flow
- [ ] Customize protected routes
- [ ] Add role-based access control (optional)

---

## Related Files

- `src/middleware.ts` - Main middleware logic
- `src/utils/token.ts` - Token utilities
- `src/store/authStore.ts` - Authentication state management
- `.env.local.example` - Environment variable template
