import { Archive, ArrowUpRight } from "@phosphor-icons/react";
import { getPrimaryProjectUrl, getProjectSources } from "../lib/catalog";
import type { Project } from "../types/project";
import { ProjectIcon, SourceIcon } from "./ProjectIcon";
import { ProjectStars } from "./ProjectStars";

interface ProjectItemProps {
  readonly project: Project;
  readonly contextLabel?: string;
}

export function ProjectItem({ project, contextLabel }: ProjectItemProps) {
  const sources = getProjectSources(project);
  const primaryUrl = getPrimaryProjectUrl(project);

  return (
    <article
      className={`project-item${project.archived ? " is-archived" : ""}`}
    >
      <div className="project-icon">
        <ProjectIcon category={project.category} />
      </div>

      <div className="project-content">
        <h3>
          <a href={primaryUrl} target="_blank" rel="noreferrer">
            {project.name}
            <ArrowUpRight aria-hidden="true" weight="bold" />
          </a>
        </h3>
        <p className="project-description">{project.description}</p>
        <div className="project-details">
          <span>
            {project.owner} · {project.language}
          </span>
          <ProjectStars project={project} />
          {contextLabel ? (
            <span className="context-label">{contextLabel}</span>
          ) : null}
          {project.archived ? (
            <span className="archive-label">
              <Archive aria-hidden="true" weight="bold" />
              Archived
            </span>
          ) : null}
        </div>
        <nav className="source-links" aria-label={`${project.name} 项目地址`}>
          {sources.map((source) => (
            <a
              href={source.url}
              key={`${source.label}-${source.url}`}
              target="_blank"
              rel="noreferrer"
            >
              <SourceIcon kind={source.kind} />
              {source.label}
            </a>
          ))}
        </nav>
      </div>
    </article>
  );
}
