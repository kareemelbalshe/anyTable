import React from "react";
import { TablePreset } from "../../types/theme.types";

export interface DemoHeaderProps {
  selectedPreset: TablePreset;
  onSelectPreset: (preset: TablePreset) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  selectedPreset,
  onSelectPreset,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Project Title */}
        <div className="flex items-center gap-3">
          <a href="https://kareemelbalshe.github.io/anyTable/" className="group flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="AnyTable Logo"
              className="w-10 h-10 rounded-2xl shadow-md shadow-primary/20 object-contain border border-primary/20 transition-transform group-hover:scale-105"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                AnyTable
                <span className="text-[10px] sm:text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full border border-primary/20">
                  v1.0.2
                </span>
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Smart Autonomous Data Table for React
              </p>
            </div>
          </a>
        </div>

        {/* Author Badge & Quick Ecosystem Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto">
          {/* Author Profile Link */}
          <a
            href="https://github.com/kareemelbalshe"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all shadow-sm group"
            title="Creator: Kareem Elbalshe on GitHub"
          >
            <img
              src="https://github.com/kareemelbalshe.png"
              alt="Kareem Elbalshe"
              className="w-5 h-5 rounded-full object-cover border border-primary/40 group-hover:scale-110 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="hidden md:inline text-gray-500 dark:text-gray-400 font-normal">By</span>
            <span className="font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
              Kareem Elbalshe
            </span>
            <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.2 rounded font-mono">
              Creator
            </span>
          </a>

          {/* Official Repo Link */}
          <a
            href="https://github.com/kareemelbalshe/anyTable"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-black shadow-sm hover:opacity-90 transition-all"
          >
            <span>🐙</span>
            <span className="hidden sm:inline">GitHub Repo</span>
            <span className="text-amber-400 dark:text-amber-600 font-normal">★</span>
          </a>

          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 hidden lg:inline">🎨 Preset:</span>
            <select
              value={selectedPreset}
              onChange={(e) => onSelectPreset(e.target.value as TablePreset)}
              className="bg-transparent text-xs font-black text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="default" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Default (Wasel Blue)</option>
              <option value="midnight" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Midnight (Neon Indigo)</option>
              <option value="emerald" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Emerald (Fintech Green)</option>
              <option value="ocean" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Ocean (Deep Cyan)</option>
              <option value="luxury" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Luxury (Gold)</option>
              <option value="crimson" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Crimson (Rose)</option>
              <option value="minimal" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Minimal</option>
              <option value="corporate" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Corporate</option>
            </select>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
            title="Toggle Light / Dark Mode"
          >
            <span>{isDarkMode ? "☀️ Light" : "🌙 Dark"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
