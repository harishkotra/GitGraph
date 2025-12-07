import { GitHubRepo, GitHubUser } from '../types';

// Helper to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to parse error json from our API
    let errorMessage = `API Error: ${response.statusText}`;
    try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
    } catch (e) {
        // ignore json parse error
    }

    throw new Error(errorMessage);
  }
  return response.json();
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  // Use local API proxy to hide tokens and avoid rate limits
  const response = await fetch(`/api/github?username=${username}&endpoint=user`);
  return handleResponse<GitHubUser>(response);
};

export const fetchUserRepos = async (username: string): Promise<GitHubRepo[]> => {
  const response = await fetch(`/api/github?username=${username}&endpoint=repos`);
  return handleResponse<GitHubRepo[]>(response);
};