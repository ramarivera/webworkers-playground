import { SHA256 } from 'crypto-js';

export function hashString(str: string): string {
  const hash = SHA256(str);
  return hash.toString();
}
