import React, { useRef } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TableInstance } from "../../types/table.types";
import { TablePreset } from "../../types/theme.types";
import { fetchGitHubRepositories } from "../externalApis";

export interface GitHubSearchTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
}

export const GitHubSearchTab: React.FC<GitHubSearchTabProps> = ({
  selectedPreset,
  isDarkMode,
}) => {
  const githubTableRef = useRef<TableInstance<any>>(null);

  return (
    <div className="flex flex-col gap-4 any-table-fade-in">
      <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
        <div>
          🐙 <strong>Live GitHub Search API:</strong> Connected directly to <code>https://api.github.com/search/repositories</code>. Try searching terms like &quot;react&quot;, &quot;tailwind&quot;, &quot;rust&quot;, &quot;nextjs&quot;!
        </div>
        <span className="bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
          PUBLIC GITHUB API
        </span>
      </div>

      <AnyTable
        key={`git-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
        preset={selectedPreset}
        tableRef={githubTableRef}
        title="GitHub Repositories Search"
        subtitle="Search open-source repositories dynamically on GitHub"
        rowKey="id"
        api={{
          fetcher: fetchGitHubRepositories,
          response: {
            dataPath: "items",
            totalPath: "total_count",
          },
        }}
        columns={[
          {
            key: "owner.avatar_url",
            title: "Owner",
            type: "image",
            width: 60,
            align: "center",
          },
          {
            key: "full_name",
            title: "Repository",
            render: (val, row) => (
              <div>
                <a
                  href={row.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-xs text-primary hover:underline"
                >
                  {val}
                </a>
                <div className="text-[11px] text-gray-400 line-clamp-1 max-w-sm">
                  {row.description || "No description provided."}
                </div>
              </div>
            ),
          },
          {
            key: "language",
            title: "Language",
            type: "badge",
          },
          {
            key: "stargazers_count",
            title: "Stars",
            sortable: true,
            render: (val) => <span className="font-bold text-amber-500 font-mono text-xs">⭐ {val.toLocaleString()}</span>,
          },
          {
            key: "forks_count",
            title: "Forks",
            render: (val) => <span className="font-mono text-xs text-gray-500">🍴 {val.toLocaleString()}</span>,
          },
        ]}
        actions={[
          {
            id: "github-link",
            label: "Open Repo",
            icon: "🐙",
            variant: "primary",
            onClick: (row) => {
              window.open(row.html_url, "_blank");
            },
          },
        ]}
      />
    </div>
  );
};
