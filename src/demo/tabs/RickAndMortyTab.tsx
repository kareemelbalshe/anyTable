import React from "react";
import { AnyTable } from "../../components/AnyTable";
import { TablePreset } from "../../types/theme.types";
import { fetchRickAndMortyCharacters } from "../externalApis";

export interface RickAndMortyTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export const RickAndMortyTab: React.FC<RickAndMortyTabProps> = ({
  selectedPreset,
  isDarkMode,
  showToast,
}) => {
  return (
    <div className="flex flex-col gap-4 any-table-fade-in">
      <div className="bg-lime-500/10 border border-lime-500/20 p-4 rounded-2xl text-xs text-lime-700 dark:text-lime-400 flex items-center justify-between">
        <div>
          🧪 <strong>Rick & Morty REST API:</strong> Live character universe directory from <code>https://rickandmortyapi.com/api/character</code>.
        </div>
        <span className="bg-lime-500/20 text-lime-600 dark:text-lime-400 font-bold px-2 py-0.5 rounded-full text-[10px]">
          LIVE API
        </span>
      </div>

      <AnyTable<any>
        key={`rick-${selectedPreset}-${isDarkMode ? "dark" : "light"}`}
        preset={selectedPreset}
        title="Rick and Morty Character Database"
        subtitle="Consuming public REST API with level 2 response pagination mapping"
        rowKey="id"
        api={{
          fetcher: fetchRickAndMortyCharacters,
          response: {
            dataPath: "results",
            totalPath: "info.count",
          },
        }}
        columns={[
          {
            key: "image",
            title: "Photo",
            type: "image",
            width: 70,
            align: "center",
          },
          {
            key: "name",
            title: "Character",
            render: (val, row) => (
              <div>
                <div className="font-bold text-xs text-gray-900 dark:text-white">{val}</div>
                <div className="text-[11px] text-gray-400">
                  {row.species} ({row.gender})
                </div>
              </div>
            ),
          },
          {
            key: "status",
            title: "Status",
            type: "status",
            statusMap: {
              Alive: { label: "Alive", variant: "success" },
              Dead: { label: "Dead", variant: "danger" },
              unknown: { label: "Unknown", variant: "neutral" },
            },
          },
          {
            key: "origin.name",
            title: "Origin Location",
          },
        ]}
        actions={[
          {
            id: "character-details",
            label: "Details",
            icon: "🔍",
            variant: "neutral",
            onClick: (row) => showToast(`Character: ${row.name} - Status: ${row.status} (${row.species})`),
          },
        ]}
      />
    </div>
  );
};
