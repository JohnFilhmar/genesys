/**
 * Room code validation utilities
 */

/**
 * Validate room code format (6 alphanumeric characters)
 */
export const isValidRoomCode = (code: string): boolean => {
  const roomCodeRegex = /^[A-Z0-9]{6}$/;
  return roomCodeRegex.test(code);
};

/**
 * Format room code to uppercase and remove spaces
 */
export const formatRoomCode = (code: string): string => {
  return code.toUpperCase().replace(/\s/g, '');
};

/**
 * Add hyphen to room code for display (ABC-123)
 */
export const displayRoomCode = (code: string): string => {
  if (code.length !== 6) return code;
  return `${code.slice(0, 3)}-${code.slice(3)}`;
};

/**
 * Generate a random room code (client-side fallback)
 * Note: Backend generates the actual code
 */
export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
