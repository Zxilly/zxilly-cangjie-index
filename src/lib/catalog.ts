import type {
  Project,
  ProjectFamily,
  ProjectGroup,
  ProjectSeed,
  ProjectSource,
} from "../types/project";

interface ProjectPlacement {
  readonly family: string;
  readonly subgroup: string;
  readonly subgroupName: string;
}

export function createProjectCatalog(
  seeds: readonly ProjectSeed[],
  families: readonly ProjectFamily[],
): readonly Project[] {
  const placementByRepository = new Map<string, ProjectPlacement>();

  for (const family of families) {
    for (const subgroup of family.subgroups) {
      for (const repository of subgroup.repositories) {
        if (placementByRepository.has(repository)) {
          throw new Error(
            `Repository is assigned more than once: ${repository}`,
          );
        }

        placementByRepository.set(repository, {
          family: family.id,
          subgroup: subgroup.id,
          subgroupName: subgroup.name,
        });
      }
    }
  }

  const seedNames = new Set(seeds.map((project) => project.name));
  const staleAssignments = [...placementByRepository.keys()].filter(
    (repository) => !seedNames.has(repository),
  );

  if (staleAssignments.length > 0) {
    throw new Error(
      `Unknown repositories in taxonomy: ${staleAssignments.join(", ")}`,
    );
  }

  return seeds.map((project) => {
    const placement = placementByRepository.get(project.name);

    if (!placement) {
      throw new Error(`Repository is missing from taxonomy: ${project.name}`);
    }

    return { ...project, ...placement };
  });
}

export function getProjectSources(project: Project): readonly ProjectSource[] {
  const sources: Array<ProjectSource | null> = [
    project.homepage
      ? { label: "Website", url: project.homepage, kind: "website" }
      : null,
    project.url ? { label: "GitHub", url: project.url, kind: "github" } : null,
    project.gitcode
      ? {
          label: project.gitcodeLabel ?? "GitCode",
          url: project.gitcode,
          kind: "gitcode",
        }
      : null,
  ];

  return sources.filter((source): source is ProjectSource => source !== null);
}

export function getPrimaryProjectUrl(project: Project): string {
  const primaryUrl = project.homepage ?? project.url ?? project.gitcode;

  if (!primaryUrl) {
    throw new Error(`Project has no public source URL: ${project.name}`);
  }

  return primaryUrl;
}

export function filterProjects(
  projects: readonly Project[],
  familiesById: ReadonlyMap<string, ProjectFamily>,
  query: string,
): readonly Project[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

  if (!normalizedQuery) return projects;

  return projects.filter((project) => {
    const family = familiesById.get(project.family);
    const haystack = [
      project.name,
      project.owner,
      project.description,
      project.category,
      project.language,
      family?.name,
      project.subgroupName,
      project.url,
      project.gitcode,
      project.homepage,
    ]
      .filter((value): value is string => Boolean(value))
      .join(" ")
      .toLocaleLowerCase("zh-CN");

    return haystack.includes(normalizedQuery);
  });
}

export function groupProjectsByFamily(
  projects: readonly Project[],
  families: readonly ProjectFamily[],
): readonly ProjectGroup[] {
  return families.flatMap((family) => {
    const familyProjects = projects
      .filter((project) => project.family === family.id)
      .toSorted((a, b) => b.updated.localeCompare(a.updated));

    return familyProjects.length > 0
      ? [{ family, projects: familyProjects }]
      : [];
  });
}

export function formatProjectCount(count: number): string {
  return `${count} ${count === 1 ? "project" : "projects"}`;
}
