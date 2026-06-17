import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names safely, resolving conflicts in the correct order.
 * Combines clsx (conditional classes) with tailwind-merge (conflict resolution).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
