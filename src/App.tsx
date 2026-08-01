import { Code, GithubLogo } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { ProjectFamily } from "./components/ProjectFamily";
import { ProjectItem } from "./components/ProjectItem";
import { SearchBox } from "./components/SearchBox";
import { familyById, projectFamilies, projects } from "./data/projects";
import {
  filterProjects,
  formatProjectCount,
  groupProjectsByFamily,
} from "./lib/catalog";

export function App() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

  const visibleProjects = useMemo(
    () => filterProjects(projects, familyById, query),
    [query],
  );
  const groupedProjects = useMemo(
    () => groupProjectsByFamily(visibleProjects, projectFamilies),
    [visibleProjects],
  );

  return (
    <div className="site-shell" id="top">
      <main>
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <h1 id="page-title">
              Zxilly
              <br />
              Cangjie Index
            </h1>
            <SearchBox query={query} onQueryChange={setQuery} />
          </div>
        </section>

        <div className="projects-wrap" id="projects">
          {visibleProjects.length > 0 ? (
            normalizedQuery ? (
              <section className="project-family search-results">
                <div className="family-heading">
                  <span className="family-index">—</span>
                  <h2>搜索结果</h2>
                  <div className="family-summary">
                    <p>匹配名称、描述、组织、语言、项目族与仓库地址。</p>
                    <span>{formatProjectCount(visibleProjects.length)}</span>
                  </div>
                </div>
                <div className="project-grid">
                  {visibleProjects.map((project) => (
                    <ProjectItem
                      key={`${project.owner}/${project.name}`}
                      project={project}
                      contextLabel={`${familyById.get(project.family)?.name} / ${project.subgroupName}`}
                    />
                  ))}
                </div>
              </section>
            ) : (
              groupedProjects.map(
                ({ family, projects: familyProjects }, index) => (
                  <ProjectFamily
                    key={family.id}
                    family={family}
                    projects={familyProjects}
                    order={index + 1}
                  />
                ),
              )
            )
          ) : (
            <div className="empty-state">
              <p>No projects found.</p>
              <button type="button" onClick={() => setQuery("")}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="site-footer" id="about">
        <div className="footer-main">
          <p>
            <strong>Zxilly Cangjie Index</strong> · Projects around the Cangjie
            programming language.
          </p>
          <nav className="footer-links" aria-label="个人代码主页">
            <a
              href="https://github.com/Zxilly"
              target="_blank"
              rel="noreferrer"
            >
              <GithubLogo aria-hidden="true" weight="bold" />
              GitHub
            </a>
            <a
              href="https://gitcode.com/Zxilly"
              target="_blank"
              rel="noreferrer"
            >
              <Code aria-hidden="true" weight="bold" />
              GitCode
            </a>
          </nav>
        </div>
        <span>GitHub + GitCode · Updated 2026</span>
      </footer>
    </div>
  );
}
