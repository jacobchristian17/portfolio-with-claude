/**
 * String helper utilities for common text manipulation tasks
 * This utility module provides simple, reusable string functions for the portfolio
 */

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if applicable
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalizes the first letter of a string
 * @param text - The text to capitalize
 * @returns String with first letter capitalized
 */
export function capitalizeFirst(text: string): string {
  if (text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converts a string to kebab-case
 * @param text - The text to convert
 * @returns String in kebab-case format
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
