import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchBoxProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}

export function SearchBox({ query, onQueryChange }: SearchBoxProps) {
  return (
    <div className="search-box">
      <MagnifyingGlass aria-hidden="true" weight="bold" />
      <label className="sr-only" htmlFor="project-search">
        搜索项目
      </label>
      <input
        id="project-search"
        type="search"
        value={query}
        placeholder="搜索项目、分组或仓库地址"
        onChange={(event) => onQueryChange(event.target.value)}
      />
      {query ? (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          aria-label="清除搜索"
        >
          <X aria-hidden="true" weight="bold" />
        </button>
      ) : null}
    </div>
  );
}
