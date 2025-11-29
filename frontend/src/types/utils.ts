export interface DecodedToken {
  userId?: string;
  sub?: string;
  email?: string;
  role?: string;
  name?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export interface UserFromToken {
  id: string;
  email: string;
  role: string;
  name?: string;
}