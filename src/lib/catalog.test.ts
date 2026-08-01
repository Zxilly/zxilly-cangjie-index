import { describe, expect, it } from "vitest";
import { familyById, projectFamilies, projects } from "../data/projects";
import type { ProjectFamily, ProjectSeed } from "../types/project";
import { createProjectCatalog, filterProjects } from "./catalog";

const seed: ProjectSeed = {
  name: "example",
  owner: "example",
  description: "Example project",
  category: "工具",
  language: "Cangjie",
  stars: 0,
  updated: "2026-01-01",
  url: "https://github.com/example/example",
};

const family: ProjectFamily = {
  id: "tools",
  name: "Tools",
  description: "Tools",
  subgroups: [
    {
      id: "tooling",
      name: "Tooling",
      description: "Tooling",
      repositories: ["example"],
    },
  ],
};

describe("project catalog", () => {
  it("assigns every included project exactly once", () => {
    const assignedRepositories = projectFamilies.flatMap((projectFamily) =>
      projectFamily.subgroups.flatMap((subgroup) => subgroup.repositories),
    );

    expect(projects).toHaveLength(33);
    expect(new Set(assignedRepositories).size).toBe(projects.length);
    expect(assignedRepositories).toHaveLength(projects.length);
  });

  it("excludes empty and artifact-only repositories", () => {
    const projectNames = projects.map((project) => project.name);

    expect(projectNames).not.toContain("static");
    expect(projectNames).not.toContain("cangjie-card-bin");
    expect(projectNames).not.toContain("cjbind-release");
  });

  it("searches by subgroup name", () => {
    const results = filterProjects(projects, familyById, "cjbind 工具链");

    expect(results).toHaveLength(5);
    expect(
      results.every((project) => project.subgroup === "cjbind-toolchain"),
    ).toBe(true);
  });

  it("rejects projects missing from the taxonomy", () => {
    expect(() => createProjectCatalog([seed], [])).toThrow(
      "Repository is missing from taxonomy: example",
    );
  });

  it("rejects stale taxonomy entries", () => {
    expect(() => createProjectCatalog([], [family])).toThrow(
      "Unknown repositories in taxonomy: example",
    );
  });

  it("rejects duplicate taxonomy assignments", () => {
    const duplicateFamily: ProjectFamily = {
      ...family,
      subgroups: [
        ...family.subgroups,
        { ...family.subgroups[0]!, id: "duplicate" },
      ],
    };

    expect(() => createProjectCatalog([seed], [duplicateFamily])).toThrow(
      "Repository is assigned more than once: example",
    );
  });
});
