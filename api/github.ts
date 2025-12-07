export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const endpoint = url.searchParams.get('endpoint'); // 'user' or 'repos'

  if (!username || !endpoint) {
    return new Response(JSON.stringify({ error: 'Missing username or endpoint' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitGraph-App'
  };

  // Only add authorization if the token exists
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  try {
    let fetchUrl = '';
    
    if (endpoint === 'user') {
      fetchUrl = `https://api.github.com/users/${username}`;
    } else if (endpoint === 'repos') {
      // Fetch up to 100 most recently updated repos
      fetchUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid endpoint' }), { status: 400 });
    }

    const response = await fetch(fetchUrl, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
      }
      if (response.status === 403) {
         return new Response(JSON.stringify({ error: 'GitHub Rate Limit Exceeded. Try adding GITHUB_TOKEN to env vars.' }), { status: 403 });
      }
      return new Response(JSON.stringify({ error: `GitHub API error: ${response.statusText}` }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600' // Cache for 5 mins
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}