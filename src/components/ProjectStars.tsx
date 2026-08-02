import { Star } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
  fetchGitHubStarCount,
  getGitCodeStarsBadgeUrl,
  getGitHubStarsBadgeUrl,
  parseGitHubRepository,
} from "../lib/stars";
import type { Project } from "../types/project";

interface ProjectStarsProps {
  readonly project: Project;
}

type StarState =
  | { readonly status: "idle" | "loading" }
  | { readonly status: "ready"; readonly count: number }
  | { readonly status: "error" };

const githubRequests = new Map<string, Promise<number>>();

function requestGitHubStars(repositoryUrl: string): Promise<number> {
  const cachedRequest = githubRequests.get(repositoryUrl);

  if (cachedRequest) return cachedRequest;

  const request = fetchGitHubStarCount(repositoryUrl).catch(
    (error: unknown) => {
      githubRequests.delete(repositoryUrl);
      throw error;
    },
  );

  githubRequests.set(repositoryUrl, request);
  return request;
}

export function ProjectStars({ project }: ProjectStarsProps) {
  const isGitHubProject = project.url
    ? parseGitHubRepository(project.url) !== null
    : false;
  const [state, setState] = useState<StarState>({ status: "idle" });

  useEffect(() => {
    if (!project.url || !isGitHubProject) return;

    let active = true;
    setState({ status: "loading" });

    void requestGitHubStars(project.url)
      .then((count) => {
        if (active) setState({ status: "ready", count });
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });

    return () => {
      active = false;
    };
  }, [isGitHubProject, project.url]);

  if (project.url && isGitHubProject) {
    if (state.status === "error") {
      return (
        <span className="project-star-badge" title="GitHub Stars">
          <img
            alt={`${project.name} GitHub Stars`}
            loading="lazy"
            src={getGitHubStarsBadgeUrl(project.url)}
          />
        </span>
      );
    }

    const label =
      state.status === "ready"
        ? `${state.count.toLocaleString("en-US")} GitHub Stars`
        : "正在获取 GitHub Stars";

    return (
      <span
        aria-label={label}
        aria-live="polite"
        className={`project-stars is-${state.status}`}
        title={label}
      >
        <Star aria-hidden="true" weight="fill" />
        <span>
          {state.status === "ready" ? state.count.toLocaleString("en-US") : "—"}
        </span>
      </span>
    );
  }

  if (project.gitcode) {
    return (
      <span className="project-star-badge" title="GitCode Stars">
        <img
          alt={`${project.name} GitCode Stars`}
          loading="lazy"
          src={getGitCodeStarsBadgeUrl(project.gitcode)}
        />
      </span>
    );
  }

  return null;
}
