// src/utils/formatting.ts
/**
 * Utility functions for formatting data
 */

/**
 * Format a Date object into a human-readable string
 * 
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatTimestamp = (date: Date): string => {
  // Check if it's today
  const today = new Date();
  const isToday = date.getDate() === today.getDate() &&
                 date.getMonth() === today.getMonth() &&
                 date.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // If it's not today, show date and time
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format file size in bytes to human-readable format
 * 
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Format a repository name from a URL
 * 
 * @param url - GitHub repository URL
 * @returns Formatted repository name
 */
export const formatRepoName = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 2) {
      return `${pathSegments[0]}/${pathSegments[1]}`;
    }
    
    return url;
  } catch (error) {
    return url;
  }
};