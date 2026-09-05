import React, { useState, useMemo, useEffect } from "react";
import { TablePreset } from "../types/theme.types";
import { TABLE_PRESETS } from "../theme/defaultTheme";
import { EnterpriseOrder } from "./enterpriseOrdersData";
import { DemoHeader } from "./components/DemoHeader";
import { InvoiceModal } from "./components/InvoiceModal";
import { DeveloperGuide } from "./DeveloperGuide";

// Modular Tab Views
import { EnterpriseOrdersTab } from "./tabs/EnterpriseOrdersTab";
import { SaaSSubscriptionsTab } from "./tabs/SaaSSubscriptionsTab";
import { HREmployeesTab } from "./tabs/HREmployeesTab";
import { CloudDevOpsTab } from "./tabs/CloudDevOpsTab";
import { HealthcareCRMTab } from "./tabs/HealthcareCRMTab";
import { DummyProductsTab } from "./tabs/DummyProductsTab";
import { DummyUsersTab } from "./tabs/DummyUsersTab";
import { GitHubSearchTab } from "./tabs/GitHubSearchTab";
import { RickAndMortyTab } from "./tabs/RickAndMortyTab";
import { ControllerTab } from "./tabs/ControllerTab";
import { ErrorStatesTab } from "./tabs/ErrorStatesTab";

export type DemoTab =
  | "enterprise"
  | "saas_billing"
  | "hr_employees"
  | "devops_cloud"
  | "healthcare"
  | "dummy_products"
  | "dummy_users"
  | "github_repos"
  | "rick_morty"
  | "ref_controller"
  | "error_states"
  | "dev_guide";

interface TabItem {
  id: DemoTab;
  label: string;
  badge: string;
}

const DEMO_TABS: TabItem[] = [
  { id: "enterprise", label: "🏢 Enterprise Orders", badge: "Logistics" },
  { id: "saas_billing", label: "💳 SaaS Billing", badge: "Fintech" },
  { id: "hr_employees", label: "👥 HR & Team", badge: "Salaries" },
  { id: "devops_cloud", label: "🖥️ Cloud DevOps", badge: "Telemetry" },
  { id: "healthcare", label: "🏥 Healthcare CRM", badge: "Clinic" },
  { id: "dummy_products", label: "🛍️ DummyJSON Products", badge: "Live API" },
  { id: "dummy_users", label: "👥 DummyJSON Users", badge: "Live API" },
  { id: "github_repos", label: "🐙 GitHub Search", badge: "Live API" },
  { id: "rick_morty", label: "🧪 Rick & Morty", badge: "Live API" },
  { id: "ref_controller", label: "🕹️ Controller", badge: "tableRef" },
  { id: "error_states", label: "🛡️ Error Boundary", badge: "Resilience" },
  { id: "dev_guide", label: "📖 Developer Guide & Tips", badge: "Pro Tips" },
];

export function App() {
  const [activeTab, setActiveTab] = useState<DemoTab>("enterprise");
  const [selectedPreset, setSelectedPreset] = useState<TablePreset>("default");

  // Theme state synced with HTML document and localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("anytable_theme");
      if (saved) return saved === "dark";
      return true; // default dark
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("anytable_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("anytable_theme", "light");
    }
  }, [isDarkMode]);

  const [notification, setNotification] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<EnterpriseOrder | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const currentPresetTheme = TABLE_PRESETS[selectedPreset] || TABLE_PRESETS.default;
  const currentPrimary = currentPresetTheme.colors?.primary || "#2667EC";
  const currentPrimarySoft = currentPresetTheme.colors?.primaryLight || "#397FF6";

  return (
    <div
      style={
        {
          "--any-table-primary": currentPrimary,
          "--any-table-primary-soft": currentPrimarySoft,
        } as React.CSSProperties
      }
      className={`min-h-screen ${
        isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } transition-colors duration-300 flex flex-col`}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl shadow-primary/30 any-table-fade-in flex items-center gap-2.5 border border-white/20">
          <span className="text-base">✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      {/* Header Bar */}
      <DemoHeader
        selectedPreset={selectedPreset}
        onSelectPreset={(preset) => {
          setSelectedPreset(preset);
          showToast(`Theme preset switched to: ${preset.toUpperCase()}`);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 flex-1 w-full">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-gray-100/90 dark:bg-slate-900/90 border border-gray-200/80 dark:border-gray-800 backdrop-blur-md">
          {DEMO_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Enterprise Orders & Fulfillment */}
        {activeTab === "enterprise" && (
          <EnterpriseOrdersTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            onViewInvoice={(order) => setSelectedInvoiceOrder(order)}
            showToast={showToast}
          />
        )}

        {/* Tab 2: SaaS Subscriptions */}
        {activeTab === "saas_billing" && (
          <SaaSSubscriptionsTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 3: HR & Employee Directory */}
        {activeTab === "hr_employees" && (
          <HREmployeesTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 4: Cloud DevOps Telemetry */}
        {activeTab === "devops_cloud" && (
          <CloudDevOpsTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 5: Healthcare CRM */}
        {activeTab === "healthcare" && (
          <HealthcareCRMTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 6: DummyJSON Products API */}
        {activeTab === "dummy_products" && (
          <DummyProductsTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 7: DummyJSON Users API */}
        {activeTab === "dummy_users" && (
          <DummyUsersTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 8: GitHub Search API */}
        {activeTab === "github_repos" && (
          <GitHubSearchTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Tab 9: Rick and Morty API */}
        {activeTab === "rick_morty" && (
          <RickAndMortyTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 10: Imperative Controller */}
        {activeTab === "ref_controller" && (
          <ControllerTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
            showToast={showToast}
          />
        )}

        {/* Tab 11: Error States & Retry Boundary */}
        {activeTab === "error_states" && (
          <ErrorStatesTab
            selectedPreset={selectedPreset}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Tab 12: Developer Guide & Pro Tips */}
        {activeTab === "dev_guide" && (
          <DeveloperGuide onCopySnippet={(code, title) => copyToClipboard(code, title)} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white">AnyTable</span>
            <span>—</span>
            <span>Crafted with passion by</span>
            <a
              href="https://github.com/kareemelbalshe"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-primary hover:underline"
            >
              Kareem Elbalshe
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/kareemelbalshe/anyTable"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🐙 GitHub Repository</span>
            </a>
            <a
              href="https://kareemelbalshe.github.io/anyTable/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>🌐 Live Documentation</span>
            </a>
            <a
              href="https://www.npmjs.com/package/@kareemelbalshe/any-table"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span>📦 npm Package</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
