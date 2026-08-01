export type ProjectCategory =
  | "编译器"
  | "工具"
  | "库"
  | "绑定"
  | "AI"
  | "文档"
  | "基础设施"
  | "社区"
  | "实验";

export interface ProjectSeed {
  readonly name: string;
  readonly owner: string;
  readonly description: string;
  readonly category: ProjectCategory;
  readonly language: string;
  readonly stars: number;
  readonly updated: string;
  readonly url?: string;
  readonly gitcode?: string;
  readonly gitcodeLabel?: string;
  readonly homepage?: string;
  readonly archived?: boolean;
}

export interface Project extends ProjectSeed {
  readonly family: string;
  readonly subgroup: string;
  readonly subgroupName: string;
}

export interface ProjectSubgroup {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly repositories: readonly string[];
}

export interface ProjectFamily {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly subgroups: readonly ProjectSubgroup[];
}

export type ProjectSourceKind = "website" | "github" | "gitcode";

export interface ProjectSource {
  readonly label: string;
  readonly url: string;
  readonly kind: ProjectSourceKind;
}

export interface ProjectGroup {
  readonly family: ProjectFamily;
  readonly projects: readonly Project[];
}
