// src/utils/validation.ts
/**
 * Utility functions for validation
 */

/**
 * Validates if a string is a valid GitHub repository URL
 * 
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is a valid GitHub repository URL
 */
export const isValidGitHubUrl = (url: string): boolean => {
  // Basic validation - Check if URL is non-empty
  if (!url || url.trim() === '') {
    return false;
  }
  
  try {
    // Parse URL to check structure
    const parsedUrl = new URL(url);
    
    // Check if the hostname is github.com
    if (!parsedUrl.hostname.includes('github.com')) {
      return false;
    }
    
    // Check if URL path has at least 2 segments (owner and repo)
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2) {
      return false;
    }
    
    // Additional checks could be added here (e.g., blacklisted paths)
    
    return true;
  } catch (error) {
    // URL parsing failed (i.e., not a valid URL)
    return false;
  }
};

/**
 * Extract the owner and repository name from a GitHub URL
 * 
 * @param url - GitHub repository URL
 * @returns Object containing owner and repo name
 */
export const extractRepoDetails = (url: string): { owner: string; repo: string } | null => {
  if (!isValidGitHubUrl(url)) {
    return null;
  }
  
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    
    return {
      owner: pathSegments[0],
      repo: pathSegments[1]
    };
  } catch (error) {
    return null;
  }
};