import { formatProjectCount } from "../lib/catalog";
import type {
  Project,
  ProjectFamily as ProjectFamilyData,
  ProjectSubgroup,
} from "../types/project";
import { ProjectItem } from "./ProjectItem";

interface ProjectSubgroupProps {
  readonly subgroup: ProjectSubgroup;
  readonly projects: readonly Project[];
  readonly familyOrder: number;
  readonly subgroupOrder: number;
}

interface ProjectFamilyProps {
  readonly family: ProjectFamilyData;
  readonly projects: readonly Project[];
  readonly order: number;
}

function ProjectSubgroupSection({
  subgroup,
  projects,
  familyOrder,
  subgroupOrder,
}: ProjectSubgroupProps) {
  return (
    <section className="project-subgroup">
      <header className="subgroup-heading">
        <span className="subgroup-index">
          {String(familyOrder).padStart(2, "0")}.{subgroupOrder}
        </span>
        <h3>{subgroup.name}</h3>
        <p>{subgroup.description}</p>
        <span className="subgroup-count">
          {formatProjectCount(projects.length)}
        </span>
      </header>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectItem
            key={`${project.owner}/${project.name}`}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}

export function ProjectFamily({ family, projects, order }: ProjectFamilyProps) {
  return (
    <section className="project-family" id={`family-${family.id}`}>
      <div className="family-heading">
        <span className="family-index">{String(order).padStart(2, "0")}</span>
        <h2>{family.name}</h2>
        <div className="family-summary">
          <p>{family.description}</p>
          <span>{formatProjectCount(projects.length)}</span>
        </div>
      </div>
      <div className="project-subgroups">
        {family.subgroups.map((subgroup, index) => {
          const subgroupProjects = projects.filter(
            (project) => project.subgroup === subgroup.id,
          );

          return subgroupProjects.length > 0 ? (
            <ProjectSubgroupSection
              key={subgroup.id}
              subgroup={subgroup}
              projects={subgroupProjects}
              familyOrder={order}
              subgroupOrder={index + 1}
            />
          ) : null;
        })}
      </div>
    </section>
  );
}
