import { GitHubRepo, GitHubUser } from '../types';

const BASE_URL = 'https://api.github.com';

// Helper to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }
  return response.json();
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  return handleResponse<GitHubUser>(response);
};

export const fetchUserRepos = async (username: string): Promise<GitHubRepo[]> => {
  // We fetch up to 100 most recently updated repos to get a good snapshot of current skills
  const response = await fetch(
    `${BASE_URL}/users/${username}/repos?sort=updated&per_page=100&type=owner`
  );
  return handleResponse<GitHubRepo[]>(response);
};
