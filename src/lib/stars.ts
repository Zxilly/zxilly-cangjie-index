interface GitHubRepository {
  readonly owner: string;
  readonly name: string;
}

interface GitHubRepositoryResponse {
  readonly stargazers_count: number;
}

export function parseGitHubRepository(
  repositoryUrl: string,
): GitHubRepository | null {
  let url: URL;

  try {
    url = new URL(repositoryUrl);
  } catch {
    return null;
  }

  if (url.hostname.toLocaleLowerCase("en-US") !== "github.com") return null;

  const [owner, rawName] = url.pathname.split("/").filter(Boolean);
  const name = rawName?.replace(/\.git$/u, "");

  return owner && name ? { owner, name } : null;
}

export function getGitHubStarsApiUrl(repositoryUrl: string): string {
  const repository = parseGitHubRepository(repositoryUrl);

  if (!repository) {
    throw new Error(`Not a GitHub repository URL: ${repositoryUrl}`);
  }

  return `https://api.github.com/repos/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`;
}

export function getGitHubStarsBadgeUrl(repositoryUrl: string): string {
  const repository = parseGitHubRepository(repositoryUrl);

  if (!repository) {
    throw new Error(`Not a GitHub repository URL: ${repositoryUrl}`);
  }

  const path = `${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}`;
  return `https://img.shields.io/github/stars/${path}?style=flat&label=stars`;
}

export async function fetchGitHubStarCount(
  repositoryUrl: string,
  request: typeof fetch = fetch,
): Promise<number> {
  const response = await request(getGitHubStarsApiUrl(repositoryUrl), {
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub Stars request failed with ${response.status}`);
  }

  const payload: unknown = await response.json();
  const stars = (payload as Partial<GitHubRepositoryResponse>).stargazers_count;

  if (typeof stars !== "number" || !Number.isSafeInteger(stars) || stars < 0) {
    throw new Error("GitHub returned an invalid Star count");
  }

  return stars;
}
