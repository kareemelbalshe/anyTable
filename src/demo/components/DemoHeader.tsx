import React from "react";
import { TablePreset } from "../../types/theme.types";

export interface DemoHeaderProps {
  selectedPreset: TablePreset;
  onSelectPreset: (preset: TablePreset) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isRtl?: boolean;
  onToggleRtl?: () => void;
  onCopyInstall?: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  selectedPreset,
  onSelectPreset,
  isDarkMode,
  onToggleDarkMode,
  isRtl = false,
  onToggleRtl,
  onCopyInstall,
}) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Project Title */}
        <div className="flex items-center gap-3">
          <a
            href="https://kareemelbalshe.github.io/anyTable/"
            className="group flex items-center gap-3"
          >
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="AnyTable Logo"
              className="w-10 h-10 rounded-2xl shadow-md shadow-primary/20 object-contain border border-primary/20 transition-transform group-hover:scale-105"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                AnyTable
                <span className="text-[10px] sm:text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  v1.2.0
                </span>
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Smart Autonomous React Data Table • 100k Rows • RTL • Export
              </p>
            </div>
          </a>
        </div>

        {/* Quick Install Copy Strip */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-mono text-gray-700 dark:text-gray-300">
          <span className="text-primary font-bold">$</span>
          <span>npm i @kareemelbalshe/any-table</span>
          {onCopyInstall && (
            <button
              onClick={onCopyInstall}
              className="ml-1.5 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 hover:text-primary transition cursor-pointer"
              title="Copy install command"
            >
              📋
            </button>
          )}
        </div>

        {/* Action Controls & Links */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 ml-auto">
          {/* Creator Profile Link */}
          <a
            href="https://github.com/kareemelbalshe"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 hover:from-primary/20 hover:to-purple-500/20 text-gray-900 dark:text-white border border-primary/25 text-xs font-bold shadow-sm transition-all group active:scale-95 cursor-pointer"
            title="Created by Kareem Elbalshe (@kareemelbalshe)"
          >
            <div className="relative">
              <img
                src="https://github.com/kareemelbalshe.png"
                alt="Kareem Elbalshe"
                className="w-5 h-5 rounded-full object-cover border border-primary/40 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233b82f6'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </div>
            <span className="hidden sm:inline font-bold">Kareem Elbalshe</span>
            <span className="text-[10px] bg-primary text-white font-black px-1.5 py-0.2 rounded-md shadow-xs">
              Creator
            </span>
          </a>

          {/* Live RTL / Language Switcher */}
          {onToggleRtl && (
            <button
              onClick={onToggleRtl}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border ${
                isRtl
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-500/40"
              }`}
              title="Toggle RTL Arabic layout"
            >
              <span>{isRtl ? "🇸🇦 العربية (RTL)" : "🇺🇸 English (LTR)"}</span>
            </button>
          )}

          {/* NPM Package Link */}
          <a
            href="https://www.npmjs.com/package/@kareemelbalshe/any-table"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-black shadow-sm transition-all"
            title="View on npm registry"
          >
            <span className="font-mono font-black text-sm leading-none">npm</span>
            <span className="hidden sm:inline">v1.2.0</span>
          </a>

          {/* Official Repo Link */}
          <a
            href="https://github.com/kareemelbalshe/anyTable"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-black shadow-sm hover:opacity-90 transition-all"
            title="View GitHub Repository"
          >
            <span>🐙</span>
            <span className="hidden sm:inline">GitHub</span>
            <span className="text-amber-400 dark:text-amber-600 font-normal">★</span>
          </a>

          {/* Preset Selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 px-2 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 hidden xl:inline">🎨 Preset:</span>
            <select
              value={selectedPreset}
              onChange={(e) => onSelectPreset(e.target.value as TablePreset)}
              className="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="default" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Default</option>
              <option value="midnight" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Midnight</option>
              <option value="emerald" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Emerald</option>
              <option value="ocean" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Ocean</option>
              <option value="luxury" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Luxury</option>
              <option value="crimson" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Crimson</option>
              <option value="minimal" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Minimal</option>
              <option value="corporate" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Corporate</option>
            </select>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            <span>{isDarkMode ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
