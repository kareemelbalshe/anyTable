import React, { useState, useMemo, useRef, useCallback } from "react";
import { AnyTable } from "../../components/AnyTable";
import { TablePreset } from "../../types/theme.types";
import { TableInstance } from "../../types/table.types";

interface VirtualEmployee {
  id: number;
  name: string;
  email: string;
  department: "Engineering" | "Design" | "Marketing" | "Finance" | "Operations";
  salary: number;
  status: "Active" | "Remote" | "On Leave" | "Contract";
  score: number;
}

const DEPARTMENTS: VirtualEmployee["department"][] = [
  "Engineering",
  "Design",
  "Marketing",
  "Finance",
  "Operations",
];

const STATUSES: VirtualEmployee["status"][] = ["Active", "Remote", "On Leave", "Contract"];

const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Robin",
  "Casey", "Logan", "Kareem", "Elena", "Liam", "Sophia", "Noah", "Olivia",
  "Marcus", "Yuki", "Chloe", "Mateo", "Fatima", "Tariq", "Aisha", "Chen"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis",
  "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez"
];

function generateVirtualEmployees(count: number): VirtualEmployee[] {
  const list: VirtualEmployee[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const fName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const status = STATUSES[i % STATUSES.length];
    const salary = 55000 + ((i * 383) % 115000);
    const score = 60 + ((i * 13) % 41);

    list[i] = {
      id: i + 1,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i > 500 ? i : ""}@company.io`,
      department: dept,
      salary,
      status,
      score,
    };
  }
  return list;
}

export interface VirtualizationTabProps {
  selectedPreset: TablePreset;
  isDarkMode: boolean;
  showToast: (msg: string) => void;
}

export function VirtualizationTab({ selectedPreset, isDarkMode, showToast }: VirtualizationTabProps) {
  const [rowCount, setRowCount] = useState<number>(100000);
  const [jumpIndex, setJumpIndex] = useState<string>("50000");
  const [renderDuration, setRenderDuration] = useState<number>(0);
  const tableRef = useRef<TableInstance<VirtualEmployee>>(null);

  // Generate data memoized by row count
  const employees = useMemo(() => {
    const t0 = performance.now();
    const data = generateVirtualEmployees(rowCount);
    const t1 = performance.now();
    setRenderDuration(Math.round(t1 - t0));
    return data;
  }, [rowCount]);

  const handleJumpToRow = useCallback(() => {
    const num = parseInt(jumpIndex, 10);
    if (isNaN(num) || num < 1 || num > rowCount) {
      showToast(`⚠️ Please enter a row index between 1 and ${rowCount.toLocaleString()}`);
      return;
    }
    tableRef.current?.scrollToIndex?.(num - 1, "center");
    showToast(`🚀 Jumped to row #${num.toLocaleString()}`);
  }, [jumpIndex, rowCount, showToast]);

  const handleQuickJump = (index: number) => {
    setJumpIndex(String(index + 1));
    tableRef.current?.scrollToIndex?.(index, "start");
    showToast(`📍 Jumped to row #${(index + 1).toLocaleString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats & Engine Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 p-6 border border-blue-500/20 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Native Zero-Dependency DOM Virtualization
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              60 FPS Virtual Windowing Engine
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Renders <strong className="text-white">100,000+ rows</strong> with 
              valid HTML <code className="text-blue-300">&lt;table&gt;</code> semantics, 
              zero external runtime dependencies, passive scroll batching via 
              <code className="text-blue-300">requestAnimationFrame</code>, and full TypeScript type safety.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-xs text-gray-400 uppercase font-medium">Dataset Rows</div>
              <div className="text-xl font-bold text-blue-400">{rowCount.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-xs text-gray-400 uppercase font-medium">DOM Nodes</div>
              <div className="text-xl font-bold text-emerald-400">~22 Active</div>
            </div>
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-xs text-gray-400 uppercase font-medium">Scroll Height</div>
              <div className="text-xl font-bold text-purple-400">{((rowCount * 48) / 1000).toLocaleString()}k px</div>
            </div>
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-xs text-gray-400 uppercase font-medium">Gen Time</div>
              <div className="text-xl font-bold text-amber-400">{renderDuration}ms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        {/* Dataset Size Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Dataset Size:
          </span>
          <div className="inline-flex rounded-lg bg-slate-800/80 p-1 border border-slate-700">
            {[1000, 10000, 50000, 100000].map((size) => (
              <button
                key={size}
                onClick={() => setRowCount(size)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  rowCount === size
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {size >= 1000 ? `${size / 1000}k` : size}
              </button>
            ))}
          </div>
        </div>

        {/* Jump To Row Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Jump to Row:
          </span>
          <input
            type="number"
            min={1}
            max={rowCount}
            value={jumpIndex}
            onChange={(e) => setJumpIndex(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJumpToRow()}
            className="w-24 px-2.5 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            placeholder="Row #"
          />
          <button
            onClick={handleJumpToRow}
            className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            Jump
          </button>

          {/* Quick Shortcuts */}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <button
              onClick={() => handleQuickJump(0)}
              className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
              title="Jump to Top"
            >
              Top #1
            </button>
            <button
              onClick={() => handleQuickJump(Math.floor(rowCount / 2))}
              className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
              title="Jump to Middle"
            >
              Mid #{Math.floor(rowCount / 2).toLocaleString()}
            </button>
            <button
              onClick={() => handleQuickJump(rowCount - 1)}
              className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors"
              title="Jump to End"
            >
              End #{rowCount.toLocaleString()}
            </button>
          </div>
        </div>
      </div>

      {/* The Virtualized AnyTable */}
      <AnyTable<VirtualEmployee>
        tableRef={tableRef}
        preset={selectedPreset}
        title={`Virtual Workforce Directory (${rowCount.toLocaleString()} Employees)`}
        subtitle="Fast passive 60fps scrolling with dynamic windowing and zero DOM lag."
        data={employees}
        rowKey="id"
        selectable={true}
        search={true}
        sorting={true}
        virtualized={{
          rowHeight: 48,
          maxHeight: 520,
          overscan: 10,
        }}
        columns={[
          {
            key: "id",
            title: "# ID",
            width: 90,
            sortable: true,
            render: (id) => <span className="font-mono text-xs font-semibold text-gray-400">#{id}</span>,
          },
          {
            key: "name",
            title: "Employee Name",
            sortable: true,
            render: (name, row) => (
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{row.email}</span>
              </div>
            ),
          },
          {
            key: "department",
            title: "Department",
            sortable: true,
            render: (dept) => {
              const colorMap: Record<string, string> = {
                Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                Design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                Marketing: "bg-pink-500/10 text-pink-400 border-pink-500/20",
                Finance: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                Operations: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              };
              return (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                    colorMap[dept] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  }`}
                >
                  {dept}
                </span>
              );
            },
          },
          {
            key: "salary",
            title: "Annual Salary",
            sortable: true,
            render: (salary) => (
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                ${salary.toLocaleString()}
              </span>
            ),
          },
          {
            key: "status",
            title: "Status",
            sortable: true,
            render: (status) => {
              const badgeColors: Record<string, string> = {
                Active: "bg-emerald-500/10 text-emerald-400",
                Remote: "bg-cyan-500/10 text-cyan-400",
                "On Leave": "bg-yellow-500/10 text-yellow-400",
                Contract: "bg-slate-500/10 text-slate-400",
              };
              return (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColors[status] || ""}`}>
                  {status}
                </span>
              );
            },
          },
          {
            key: "score",
            title: "Performance",
            sortable: true,
            render: (score) => (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-blue-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-gray-400">{score}%</span>
              </div>
            ),
          },
        ]}
        actions={[
          {
            id: "inspect",
            label: "Inspect",
            onClick: (emp) => {
              showToast(`🔍 Selected Employee #${emp.id}: ${emp.name} (${emp.department})`);
            },
          },
        ]}
      />

      {/* Developer Integration Code Card */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            How to use Virtualization in your project
          </span>
          <span className="text-xs text-gray-400">0 KB external dependencies</span>
        </div>
        <pre className="p-4 rounded-lg bg-slate-950 text-xs text-gray-300 font-mono overflow-x-auto border border-slate-800/80">
{`import { AnyTable } from "@kareemelbalshe/any-table";

// Just pass virtualized={true} or customize rowHeight, maxHeight, and overscan:
<AnyTable
  data={hundredThousandRows}
  rowKey="id"
  virtualized={{
    rowHeight: 48,   // Row height in pixels (default 48)
    maxHeight: 520,   // Scroll container height (default 520)
    overscan: 10,     // Buffer rows rendered outside viewport (default 10)
  }}
  tableRef={tableRef} // Access tableRef.current.scrollToIndex(index, "center")
/>`}
        </pre>
      </div>
    </div>
  );
}
