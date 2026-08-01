import {
  BookOpenText,
  BracketsCurly,
  Code,
  Flask,
  GitBranch,
  GithubLogo,
  GlobeSimple,
  Package,
  Robot,
  TerminalWindow,
  Toolbox,
  UsersThree,
} from "@phosphor-icons/react";
import type { ProjectCategory, ProjectSourceKind } from "../types/project";

interface ProjectIconProps {
  readonly category: ProjectCategory;
}

interface SourceIconProps {
  readonly kind: ProjectSourceKind;
}

const projectIconProps = { "aria-hidden": true, weight: "duotone" as const };
const sourceIconProps = { "aria-hidden": true, weight: "bold" as const };

export function SourceIcon({ kind }: SourceIconProps) {
  if (kind === "github") return <GithubLogo {...sourceIconProps} />;
  if (kind === "website") return <GlobeSimple {...sourceIconProps} />;
  return <Code {...sourceIconProps} />;
}

export function ProjectIcon({ category }: ProjectIconProps) {
  if (category === "编译器") return <BracketsCurly {...projectIconProps} />;
  if (category === "工具") return <Toolbox {...projectIconProps} />;
  if (category === "库") return <Package {...projectIconProps} />;
  if (category === "绑定") return <GitBranch {...projectIconProps} />;
  if (category === "AI") return <Robot {...projectIconProps} />;
  if (category === "文档") return <BookOpenText {...projectIconProps} />;
  if (category === "社区") return <UsersThree {...projectIconProps} />;
  if (category === "实验") return <Flask {...projectIconProps} />;
  return <TerminalWindow {...projectIconProps} />;
}
