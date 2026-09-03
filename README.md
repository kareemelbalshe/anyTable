# 🚀 AnyTable — Smart Data Table Library for React

> **A developer-facing, smart data table library for React (18 & 19) & TypeScript with 3-Tier API auto-detection, dynamic column extraction, autonomous server/client search, sorting & pagination, interactive row actions with instant PATCH switches, and zero business logic coupling.**

[![npm version](https://img.shields.io/npm/v/@kareemelbalshe/any-table.svg)](https://npmjs.org/package/@kareemelbalshe/any-table)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen?logo=react)](https://kareemelbalshe.github.io/anyTable/)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.0%2B-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-46%20Passed-success)](https://vitest.dev/)

---

## 📑 Table of Contents (فهرس المحتويات)

- [🌟 Core Philosophy & Architecture](#-core-philosophy--architecture)
- [📦 Installation & Setup](#-installation--setup)
- [⚡ Quick Start Guide (دليل البدء السريع)](#-quick-start-guide)
  - [1. Minimal Local Data (Zero Config)](#1-minimal-local-data-zero-config)
  - [2. Smart Remote API with Server Pagination, Search & Sorting](#2-smart-remote-api-with-server-pagination-search--sorting)
- [🧠 3-Tier Smart API Adapter](#-3-tier-smart-api-adapter)
  - [Level 1: Auto (Zero-Config Array Detection)](#level-1-auto-zero-config-array-detection)
  - [Level 2: Dot-Notation Path Mapping](#level-2-dot-notation-path-mapping)
  - [Level 3: Custom Response Transformer](#level-3-custom-response-transformer)
- [🎯 Row Actions & Instant PATCH Switches](#-row-actions--instant-patch-switches)
  - [Action Buttons & Modal Triggers](#1-action-buttons)
  - [Instant PATCH / PUT Toggle Switch](#2-instant-patch--put-toggle-switch)
  - [Destructive Actions with Confirmation Modal](#3-destructive-actions-with-confirmation-modal)
- [🛠️ Column Types & Smart Renderers](#️-column-types--smart-renderers)
- [🕹️ Imperative Controller API (`tableRef`)](#️-imperative-controller-api-tableref)
- [☑️ Selection & Batch Operations](#️-selection--batch-operations)
- [🎨 Theming & Dark Mode](#-theming--dark-mode)
- [🌐 Integration Guides (Next.js & Vite)](#-integration-guides-nextjs--vite)
- [📋 Props & Types Reference](#-props--types-reference)
- [🇪🇬 دليل المبرمج باللغة العربية (Arabic Developer Guide)](#-دليل-المبرمج-باللغة-العربية-arabic-developer-guide)
- [📄 License](#-license)

---

## 🌟 Core Philosophy & Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│  AnyTable = Presentation + State Management + API Normalizer + Callbacks │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┴────────────────────────────┐
      ▼                                                         ▼
[ WHAT ANYTABLE DOES ]                                [ WHAT DEVELOPER DOES ]
• Renders responsive, accessible tables               • Implements REST / GraphQL APIs
• Auto-detects columns & data types                   • Manages Auth, JWT & Headers
• Normalizes 99% of REST API response shapes          • Handles PATCH / DELETE in callbacks
• Manages debounced search, sort & pagination UI      • Controls business logic & permissions
• Handles loading, empty, and error retry states      • Navigates routes and opens modals
```

AnyTable is intentionally designed to **never lock you into specific backend conventions or proprietary UI frameworks**. It acts as an autonomous smart presentation layer that consumes data, coordinates user interactions, and exposes clean callback hooks for your business logic.

---

## 📦 Installation & Setup

### 1. Install via Package Manager

```bash
# Using NPM
npm install @kareemelbalshe/any-table react-icons

# Using Yarn
yarn add @kareemelbalshe/any-table react-icons

# Using PNPM
pnpm add @kareemelbalshe/any-table react-icons
```

### 2. Import CSS Styles

Import the library stylesheet once in your main application entry point:

```tsx
// In main.tsx / App.tsx (Vite / CRA) or app/layout.tsx (Next.js)
import "@kareemelbalshe/any-table/style.css";
```

---

## ⚡ Quick Start Guide

### 1. Minimal Local Data (Zero Config)

Pass any plain JavaScript array without defining columns. AnyTable automatically extracts keys, converts camelCase/snake_case to readable headers, detects data types (e.g. currency, boolean, date), and provides search, sorting, and pagination:

```tsx
import React from "react";
import { AnyTable } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

const orders = [
  { id: "ORD-101", customerName: "Ahmed Ali", total: 4500, isPaid: true, createdAt: "2026-08-15T10:30:00Z" },
  { id: "ORD-102", customerName: "Sara Mansour", total: 1250, isPaid: false, createdAt: "2026-08-16T14:15:00Z" },
  { id: "ORD-103", customerName: "Omar Khaled", total: 8900, isPaid: true, createdAt: "2026-08-18T09:00:00Z" },
];

export default function OrdersPage() {
  return (
    <div className="p-6">
      <AnyTable 
        title="Recent Orders" 
        subtitle="Overview of all transactions"
        data={orders} 
      />
    </div>
  );
}
```

---

### 2. Smart Remote API with Server Pagination, Search & Sorting

Pass your `fetcher` function. AnyTable will automatically pass `{ page, pageSize, search, sortBy, sortOrder }` parameters, debounce search input (350ms default), and handle loading/error states:

```tsx
import React from "react";
import { AnyTable } from "@kareemelbalshe/any-table";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "user";
  spend: number;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  return (
    <AnyTable<User>
      title="Platform Users"
      subtitle="Connected directly to remote backend API"
      rowKey="id"
      api={{
        fetcher: async ({ page, pageSize, search, sortBy, sortOrder }) => {
          const response = await axios.get("/api/v1/users", {
            params: { page, limit: pageSize, q: search, sortBy, sortOrder },
          });
          return response.data; // e.g. { data: [...], total: 150, page: 1 }
        },
      }}
      columns={[
        { key: "name", title: "Full Name", sortable: true },
        { key: "email", title: "Email Address", type: "email" },
        { key: "role", title: "Role", type: "status" },
        { key: "spend", title: "Total Spend", type: "currency", currency: "EGP", sortable: true },
        { key: "createdAt", title: "Registered At", type: "date", sortable: true },
      ]}
    />
  );
}
```

---

## 🧠 3-Tier Smart API Adapter

Backend response formats vary widely across organizations. AnyTable provides a **3-Tier Adapter** that handles 99% of APIs effortlessly:

```
                                ┌─────────────────────────┐
                                │    Smart API Adapter    │
                                └────────────┬────────────┘
                ┌────────────────────────────┼────────────────────────────┐
                ▼                            ▼                            ▼
       [ Level 1: Auto ]           [ Level 2: Config ]          [ Level 3: Control ]
     Automatic detection of        Explicit dot-notation         Custom transformResponse
      data array & pagination          path mapping                      function
```

### Level 1: Auto (Zero-Config Array Detection)
Automatically extracts arrays from root `[...]` or keys named `data`, `items`, `results`, `rows`, `records`, `payload`, `users`, `orders`, `products`. Total count is detected from `total`, `totalRecords`, `meta.total`, `count`, etc.

```tsx
<AnyTable 
  api={{ 
    fetcher: (params) => axios.get("/api/users", { params }).then(res => res.data) 
  }} 
/>
```

### Level 2: Dot-Notation Path Mapping
For structured responses with custom nested keys (e.g. `{ responsePayload: { userList: [...], pagination: { totalCount: 200 } } }`):

```tsx
<AnyTable
  api={{
    fetcher: getUsersApi,
    response: {
      dataPath: "responsePayload.userList",
      totalPath: "responsePayload.pagination.totalCount",
      pagePath: "responsePayload.pagination.currentPage",
      pageSizePath: "responsePayload.pagination.perPage",
    },
  }}
/>
```

### Level 3: Custom Response Transformer
For legacy endpoints or GraphQL formats that require custom parsing:

```tsx
<AnyTable
  api={{
    fetcher: getCustomDataApi,
    transformResponse: (raw) => ({
      data: raw.graphql.users.nodes,
      meta: {
        total: raw.graphql.users.aggregate.totalCount,
        page: raw.graphql.users.pageInfo.currentPage,
        pageSize: 20,
      },
    }),
  }}
/>
```

---

## 🌐 Real-World External Public API Recipes

AnyTable connects seamlessly to any external public REST API with zero boilerplate:

### 🛍️ 1. DummyJSON Products Inventory (E-Commerce)
```tsx
import { AnyTable } from "@kareemelbalshe/any-table";

export default function ProductsTable() {
  return (
    <AnyTable
      title="E-Commerce Products Inventory"
      rowKey="id"
      api={{
        fetcher: async ({ page, pageSize, search, sortBy, sortOrder }) => {
          const skip = (page - 1) * pageSize;
          const url = search
            ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${pageSize}&skip=${skip}`
            : `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`;
          return fetch(url).then((res) => res.json());
        },
        response: {
          dataPath: "products",
          totalPath: "total",
        },
      }}
      columns={[
        { key: "thumbnail", title: "Image", type: "image", width: 70, align: "center" },
        { key: "title", title: "Product Title", sortable: true },
        { key: "category", title: "Category", type: "status" },
        { key: "price", title: "Price", type: "currency", currency: "$", sortable: true },
        { key: "rating", title: "Rating", render: (val) => <span>⭐ {val} / 5</span> },
      ]}
    />
  );
}
```

### 🐙 2. GitHub Search Repositories API
```tsx
import { AnyTable } from "@kareemelbalshe/any-table";

export default function GitHubSearchTable() {
  return (
    <AnyTable
      title="GitHub Open-Source Repositories"
      rowKey="id"
      api={{
        fetcher: async ({ page, pageSize, search }) => {
          const q = search?.trim() ? search : "react stars:>1000";
          const res = await fetch(
            `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&page=${page}&per_page=${pageSize}&sort=stars`
          );
          return res.json();
        },
        response: {
          dataPath: "items",
          totalPath: "total_count",
        },
      }}
      columns={[
        { key: "owner.avatar_url", title: "Owner", type: "image", width: 60, align: "center" },
        { key: "full_name", title: "Repository", sortable: true },
        { key: "language", title: "Language", type: "status" },
        { key: "stargazers_count", title: "Stars", render: (v) => <span>⭐ {v.toLocaleString()}</span> },
        { key: "forks_count", title: "Forks", render: (v) => <span>🍴 {v.toLocaleString()}</span> },
      ]}
      actions={[
        {
          id: "open-repo",
          label: "View on GitHub",
          variant: "primary",
          onClick: (row) => window.open(row.html_url, "_blank"),
        },
      ]}
    />
  );
}
```

---

## 🏢 Ultimate Enterprise Logistics & Orders Management (Real-World Pattern)

This production-grade pattern demonstrates nested customer records, VAT computations, multi-tier status badges, instant PATCH switches, and invoice popups:

```tsx
import React, { useState } from "react";
import { AnyTable } from "@kareemelbalshe/any-table";

export default function EnterpriseOrdersDashboard() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  return (
    <div>
      <AnyTable
        title="Enterprise Fulfillment & Orders"
        subtitle="Live multi-carrier logistics tracking with instant PATCH switches and invoice modals"
        rowKey="id"
        api={{ fetcher: fetchOrdersApi }}
        columns={[
          { key: "orderNumber", title: "Order #", width: 110, sortable: true },
          {
            key: "customer.name",
            title: "Customer Profile",
            sortable: true,
            render: (_, row) => (
              <div className="flex items-center gap-3">
                <img src={row.customer.avatar} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-xs">{row.customer.name}</div>
                  <div className="text-[11px] text-gray-400">{row.customer.phone}</div>
                </div>
              </div>
            ),
          },
          { key: "totalAmount", title: "Total Amount", type: "currency", currency: "EGP", sortable: true },
          {
            key: "paymentStatus",
            title: "Payment",
            type: "status",
            statusMap: {
              Paid: { label: "Paid", variant: "success" },
              Pending: { label: "Pending", variant: "warning" },
              Refunded: { label: "Refunded", variant: "neutral" },
              Failed: { label: "Failed", variant: "danger" },
            },
          },
          {
            key: "fulfillmentStatus",
            title: "Fulfillment",
            type: "status",
            statusMap: {
              Delivered: { label: "Delivered", variant: "success" },
              "In Transit": { label: "In Transit", variant: "info" },
              Processing: { label: "Processing", variant: "warning" },
              Cancelled: { label: "Cancelled", variant: "danger" },
            },
          },
        ]}
        actions={[
          // Instant PATCH Switch for Express Dispatch
          {
            id: "express-toggle",
            type: "switch",
            label: "Express",
            checked: (row) => row.isExpressShipping,
            onChange: async (row, nextChecked, context) => {
              await axios.patch(`/api/orders/${row.id}`, { isExpressShipping: nextChecked });
              context.refresh();
            },
          },
          // View Invoice Action
          {
            id: "view-invoice",
            label: "Invoice",
            variant: "primary",
            onClick: (row) => setSelectedInvoice(row),
          },
          // Destructive Cancel with Confirmation
          {
            id: "cancel",
            label: "Cancel",
            variant: "danger",
            confirmation: {
              title: "Cancel Order",
              message: (row) => `Are you sure you want to cancel order ${row.orderNumber}?`,
            },
            onClick: async (row, context) => {
              await axios.post(`/api/orders/${row.id}/cancel`);
              context.refresh();
            },
          },
        ]}
        selectable
      />
    </div>
  );
}
```

---

## 🎯 Row Actions & Instant PATCH Switches

Define clean actions per row without mixing UI code with data rendering:

### 1. Action Buttons

```tsx
<AnyTable<User>
  data={users}
  actions={[
    {
      id: "view",
      label: "View Profile",
      variant: "primary",
      onClick: (row) => navigate(`/users/${row.id}`),
    },
    {
      id: "edit",
      label: "Edit",
      variant: "neutral",
      onClick: (row) => openEditModal(row),
    },
  ]}
/>
```

### 2. Instant PATCH / PUT Toggle Switch

Perfect for toggling active status, ban status, or feature flags directly with auto-refresh:

```tsx
<AnyTable<User>
  api={{ fetcher: fetchUsers }}
  actions={[
    {
      id: "status-toggle",
      type: "switch",
      label: "Active",
      checked: (row) => row.isActive,
      onChange: async (row, nextChecked, context) => {
        // 1. Send update to your backend
        await axios.patch(`/api/users/${row.id}`, { isActive: nextChecked });
        
        // 2. Refresh the table data seamlessly
        context.refresh();
      },
    },
  ]}
/>
```

### 3. Destructive Actions with Confirmation Modal

Built-in modal confirmation with custom title and messages:

```tsx
<AnyTable<User>
  api={{ fetcher: fetchUsers }}
  actions={[
    {
      id: "delete",
      label: "Delete",
      variant: "danger",
      confirmation: {
        title: "Delete Account",
        message: (row) => `Are you sure you want to permanently delete "${row.name}"?`,
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
      },
      onClick: async (row, context) => {
        await axios.delete(`/api/users/${row.id}`);
        context.refresh();
      },
    },
  ]}
/>
```

---

## 🛠️ Column Types & Smart Renderers

AnyTable supports built-in type renderers:

| Type | Description | Example Configuration |
| :--- | :--- | :--- |
| `string` | Regular text string | `{ key: "name", title: "Name" }` |
| `number` | Formatted number with locale separators | `{ key: "quantity", type: "number" }` |
| `currency` | Formatted currency with symbol | `{ key: "price", type: "currency", currency: "EGP" }` |
| `date` | Formatted date (DD/MM/YYYY) | `{ key: "birthDate", type: "date" }` |
| `datetime` | Date with time formatting | `{ key: "createdAt", type: "datetime" }` |
| `status` | Colored badge for statuses | `{ key: "status", type: "status" }` |
| `image` | Rounded avatar image with fallback | `{ key: "avatarUrl", type: "image", width: 70 }` |
| `email` | Clickable `mailto:` link | `{ key: "email", type: "email" }` |
| `phone` | Clickable `tel:` link | `{ key: "phone", type: "phone" }` |
| `url` | External web link | `{ key: "website", type: "url" }` |
| `custom` / `render` | Total control JSX renderer | `{ key: "tags", render: (val, row) => <div>...</div> }` |

### Custom Status Badges & Custom Renderers:

```tsx
columns={[
  // Custom status badge mapping
  {
    key: "status",
    title: "Order Status",
    type: "status",
    statusMap: {
      completed: { label: "Completed", variant: "success" },
      pending: { label: "Pending Payment", variant: "warning" },
      cancelled: { label: "Cancelled", variant: "danger" },
    },
  },
  
  // Custom JSX renderer
  {
    key: "customer",
    title: "Customer",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <img src={row.avatar} className="w-8 h-8 rounded-full" />
        <div>
          <div className="font-bold text-sm">{row.name}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      </div>
    ),
  },
]}
```

---

## 🕹️ Imperative Controller API (`tableRef`)

Control search, pagination, and data refreshing programmatically from any external button:

```tsx
import React, { useRef } from "react";
import { AnyTable, TableInstance } from "@kareemelbalshe/any-table";

export default function Dashboard() {
  const tableRef = useRef<TableInstance<User>>(null);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => tableRef.current?.refresh()}>🔄 Refresh</button>
        <button onClick={() => tableRef.current?.setPage(1)}>⏮️ First Page</button>
        <button onClick={() => tableRef.current?.setSearch("VIP")}>🔍 Search VIP</button>
        <button onClick={() => tableRef.current?.reset()}>⚡ Reset Table</button>
      </div>

      <AnyTable<User>
        tableRef={tableRef}
        api={{ fetcher: fetchUsers }}
      />
    </div>
  );
}
```

---

## ☑️ Selection & Batch Operations

Enable multi-row checkboxes to perform batch deletes or status updates:

```tsx
export default function BatchTable() {
  const [selected, setSelected] = useState<User[]>([]);

  return (
    <div>
      {selected.length > 0 && (
        <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-lg flex items-center justify-between mb-4">
          <span>{selected.length} items selected</span>
          <button 
            onClick={() => handleBatchDelete(selected.map(u => u.id))}
            className="bg-red-600 text-white px-3 py-1.5 rounded"
          >
            Delete Selected
          </button>
        </div>
      )}

      <AnyTable<User>
        data={users}
        selectable
        onSelectionChange={(selectedRows, selectedKeys) => {
          setSelected(selectedRows);
        }}
      />
    </div>
  );
}
```

---

## 🛡️ Graceful Error Handling & Skeleton States

AnyTable includes built-in resilience for real-world network conditions:

- **Automated Error State**: If an API endpoint returns a 500 error or network disconnect, AnyTable presents a clean error card with the error message and an automated **"Retry Request"** button.
- **Race Condition Prevention**: Rapid keystrokes in the search bar or fast pagination clicks automatically abort stale requests using `AbortController`.
- **Skeleton Shimmer Loaders**: Smooth pulsing skeletons during fetching rather than abrupt layout shifts.
- **Custom Error UI**: You can override the default error state with your own component using `errorComponent`:

```tsx
<AnyTable<User>
  api={{ fetcher: fetchUsers }}
  // Optional: Custom error UI with retry callback
  errorComponent={(error, retry) => (
    <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20">
      <p className="text-rose-500 font-bold mb-3">⚠️ Failed to connect: {error.message}</p>
      <button 
        onClick={retry}
        className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-700"
      >
        🔄 Try Again
      </button>
    </div>
  )}
/>
```

---

## 🎨 Theming & Dark Mode

AnyTable is built with CSS variables and seamlessly adapts to light & dark modes. You can customize colors via the `theme` prop:

```tsx
<AnyTable
  theme={{
    colors: {
      primary: "#2667EC",       // Wasel Electric Blue
      background: "#0f172a",    // Custom Dark Background
      text: "#f8fafc",          // Custom Light Text
      borderRadius: "0.75rem",  // Border Radius
    },
  }}
/>
```

---

## 🌐 Integration Guides (Next.js & Vite)

### In Next.js (App Router `app/page.tsx`)

Because AnyTable utilizes client-side state and interactive events, mark your component with `'use client'`:

```tsx
"use client";

import { AnyTable } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

export default function AdminPage() {
  return (
    <main className="container mx-auto py-8">
      <AnyTable
        title="Next.js App Router Table"
        api={{
          fetcher: (params) => fetch(`/api/users?${new URLSearchParams(params as any)}`).then(r => r.json()),
        }}
      />
    </main>
  );
}
```

---

## 📋 Props & Types Reference

### `AnyTableProps<TData>`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `TData[]` | `undefined` | Direct local array of items. |
| `api` | `ApiConfig<TData>` | `undefined` | Remote REST API configuration. |
| `columns` | `ColumnDef<TData>[]` | `auto` | Explicit column configurations. |
| `autoColumns` | `boolean` | `true` | Automatically extract columns if not provided. |
| `rowKey` | `keyof TData \| ((row, idx) => string \| number)` | `'id' \| '_id'` | Unique identifier for row keys. |
| `title` | `ReactNode` | `undefined` | Section title in table header. |
| `subtitle` | `ReactNode` | `undefined` | Section subtitle / description. |
| `actions` | `TableAction<TData>[]` | `[]` | Action buttons, switches, and modals. |
| `search` | `boolean \| SearchConfig<TData>` | `true` | Debounced search bar. |
| `sorting` | `boolean \| SortingConfig<TData>` | `true` | Column sorting configuration. |
| `pagination` | `boolean \| PaginationConfig` | `true` | Pagination and page size controls. |
| `selectable` | `boolean` | `false` | Enables row selection checkboxes. |
| `onSelectionChange` | `(rows, keys) => void` | `undefined` | Selection listener callback. |
| `onRowClick` | `(row, idx, event) => void` | `undefined` | Row click handler. |
| `tableRef` | `Ref<TableInstance<TData>>` | `undefined` | Imperative controller ref. |
| `theme` | `Partial<AnyTableTheme>` | `default` | Custom color and style overrides. |
| `headerActions` | `ReactNode` | `undefined` | Custom JSX buttons placed in top header. |
| `bordered` | `boolean` | `true` | Show borders around table and cells. |
| `striped` | `boolean` | `false` | Alternating zebra stripe row backgrounds. |
| `hoverable` | `boolean` | `true` | Highlight rows on hover. |
| `compact` | `boolean` | `false` | Compact row padding density. |

---

## 🇪🇬 دليل المبرمج الشامل باللغة العربية (All Use Cases Guide)

مكتبة **AnyTable** مصممة لتجعل بناء الجداول في تطبيقات **React 18/19** و **Next.js** و **TypeScript** سريعة وخالية من أي كود متكرر (Boilerplate)، مع فصل كامل لمنطق العمل (Business Logic) عن واجهة العرض.

---

### 📦 الخطوة 1: التثبيت والاستيراد الأساسي
```bash
npm install @kareemelbalshe/any-table react-icons
```
في ملف المدخل الأساسي لتطبيقك (`main.tsx` أو `App.tsx` أو `app/layout.tsx`):
```tsx
import "@kareemelbalshe/any-table/style.css";
```

---

### 💡 الحالة 1: جدول فوري بدون أي إعداد للأعمدة (Zero Configuration)
مرر مصفوفة بيانات خام مباشرة، وسيقوم الجدول باستخراج الحقول وتحويل العناوين وضبط البحث والترقيم تلقائياً:
```tsx
import { AnyTable } from "@kareemelbalshe/any-table";

const users = [
  { id: 1, fullName: "كريم البلسي", email: "kareem@example.com", balance: 5000, isActive: true },
  { id: 2, fullName: "أحمد علي", email: "ahmed@example.com", balance: 3200, isActive: false },
];

export default function SimplePage() {
  return <AnyTable title="قائمة المستخدمين" data={users} />;
}
```

---

### 💡 الحالة 2: جدول مخصص بأنواع بيانات ذكية (Smart Column Types)
يدعم الجدول تلقائياً عرض العملات، الصور، شارات الحالات، والروابط:
```tsx
<AnyTable
  title="العملاء المميزين"
  data={clients}
  rowKey="id"
  columns={[
    // صورة الأفاتار
    { key: "avatar", title: "الصورة", type: "image", width: 70, align: "center" },
    // نص مع خاصية الترتيب
    { key: "name", title: "اسم العميل", sortable: true },
    // بريد إلكتروني قابل للنقر
    { key: "email", title: "البريد", type: "email" },
    // عملة مع رمز الجنيه المصري
    { key: "walletBalance", title: "الرصيد", type: "currency", currency: "EGP", sortable: true },
    // شارة حالة ملونة مخصصة
    {
      key: "status",
      title: "الحالة",
      type: "status",
      statusMap: {
        active: { label: "نشط", variant: "success" },
        pending: { label: "قيد المراجعة", variant: "warning" },
        banned: { label: "محظور", variant: "danger" },
      },
    },
    // مخرج JSX مخصص بالكامل
    {
      key: "rating",
      title: "التقييم",
      render: (val) => <span>⭐ {val} / 5</span>,
    },
  ]}
/>
```

---

### 💡 الحالة 3: الربط مع REST API خارجي بالسيرفر (Server-Side Pagination & Search)
عند تمرير `api.fetcher`، يتولى الجدول إرسال المتغيرات `{ page, pageSize, search, sortBy, sortOrder }` تلقائياً مع فلترة البحث (Debounce) لمنع تكرار الطلبات:
```tsx
import axios from "axios";

<AnyTable
  title="المستخدمين من السيرفر"
  rowKey="id"
  api={{
    fetcher: async ({ page, pageSize, search, sortBy, sortOrder }) => {
      const response = await axios.get("/api/v1/users", {
        params: {
          page,
          limit: pageSize,
          search,
          sortBy,
          sortOrder,
        },
      });
      return response.data; // e.g. { data: [...], meta: { total: 100 } }
    },
  }}
/>
```

---

### 💡 الحالة 4: التعامل مع ردود الـ API غير القياسية (3-Tier Normalizer)
إذا كان الباك إند يرجع بيانات بهيكل مخصص (مثل `{ payload: { records: [...], recordCount: 150 } }`):
```tsx
<AnyTable
  api={{
    fetcher: getCustomBackendData,
    response: {
      dataPath: "payload.records",        // مسار مصفوفة البيانات
      totalPath: "payload.recordCount",    // مسار إجمالي السجلات للترقيم
      pagePath: "payload.currentPage",     // مسار رقم الصفحة الحالية
    },
  }}
/>
```

---

### 💡 الحالة 5: مفاتيح الـ PATCH الفورية وأزرار العمليات (Actions & Switches)
تعديل حالة السجل مباشرة بمفتاح Toggle دون مغادرة الجدول مع التحديث الفوري:
```tsx
actions={[
  // 1. مفتاح تبديل يرسل طلب PATCH للباك إند ويحدث الجدول فوراً
  {
    id: "active-switch",
    type: "switch",
    label: "تفعيل",
    checked: (row) => row.isActive,
    onChange: async (row, nextState, context) => {
      await axios.patch(`/api/users/${row.id}`, { isActive: nextState });
      context.refresh(); // يعيد جلب البيانات بسلاسة
    },
  },
  // 2. زر عرض التفاصيل
  {
    id: "view",
    label: "عرض",
    variant: "primary",
    onClick: (row) => router.push(`/users/${row.id}`),
  },
]}
```

---

### 💡 الحالة 6: نوافذ التأكيد الذكية لعمليات الحذف (Confirmation Dialogs)
نافذة تأكيد مدمجة تنبثق قبل تنفيذ الإجراء:
```tsx
actions={[
  {
    id: "delete-btn",
    label: "حذف",
    variant: "danger",
    confirmation: {
      title: "تأكيد حذف الحساب",
      message: (row) => `هل أنت متأكد من رغبتك في حذف "${row.name}" نهائياً؟`,
      confirmText: "نعم، احذف",
      cancelText: "إلغاء",
    },
    onClick: async (row, context) => {
      await axios.delete(`/api/users/${row.id}`);
      context.refresh();
    },
  },
]}
```

---

### 💡 الحالة 7: التحكم البرمجي عبر الـ Ref (`tableRef`)
للتحكم في الجدول من أزرار خارجية في صفحتك:
```tsx
import { useRef } from "react";
import { AnyTable, TableInstance } from "@kareemelbalshe/any-table";

export default function AdminPage() {
  const tableRef = useRef<TableInstance>(null);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => tableRef.current?.refresh()}>🔄 تحديث البيانات</button>
        <button onClick={() => tableRef.current?.setPage(1)}>⏮️ الصفحة الأولى</button>
        <button onClick={() => tableRef.current?.setSearch("القاهرة")}>🔍 بحث عن القاهرة</button>
        <button onClick={() => tableRef.current?.reset()}>⚡ إعادة ضبط الجدول</button>
      </div>

      <AnyTable tableRef={tableRef} api={{ fetcher: fetchUsers }} />
    </div>
  );
}
```

---

### 💡 الحالة 8: التحديد المتعدد والعمليات الجماعية (Batch Operations)
```tsx
export default function SelectionPage() {
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <div>
      {selectedUsers.length > 0 && (
        <button onClick={() => handleBulkDelete(selectedUsers.map(u => u.id))}>
          🗑️ حذف {selectedUsers.length} مستخدمين محددين
        </button>
      )}

      <AnyTable
        data={users}
        selectable
        onSelectionChange={(selectedRows, selectedKeys) => {
          setSelectedUsers(selectedRows);
        }}
      />
    </div>
  );
}
```

---

### 💡 الحالة 9: التعامل مع أخطاء الشبكة وزر إعادة المحاولة التلقائي (Error Handling)
عند انقطاع الاتصال أو إرجاع خطأ 500، يظهر الجدول شاشة خطأ منسقة مع زر **"🔄 Retry Request"** التلقائي:
```tsx
<AnyTable
  api={{ fetcher: fetchUsersApi }}
  // اختياري: تخصيص واجهة الخطأ وزر الإعادة بالكامل
  errorComponent={(error, retry) => (
    <div className="p-6 text-center text-red-500">
      <p>حدث خطأ: {error.message}</p>
      <button onClick={retry}>إعادة المحاولة</button>
    </div>
  )}
/>
```

---

### 💡 الحالة 10: تخصيص الألوان والثيم والوضع الليلي (Theming & Dark Mode)
```tsx
<AnyTable
  theme={{
    colors: {
      primary: "#2667EC",      // اللون الأساسي
      borderRadius: "0.75rem", // انحناء الحواف
    },
  }}
/>
```

---

### 💡 الحالة 11: التوافق الكامل مع Next.js (App Router)
في مسار `app/users/page.tsx` داخل Next.js 13/14/15، أضف `'use client'` في أعلى الملف:
```tsx
"use client";

import { AnyTable } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";

export default function UsersPage() {
  return (
    <main className="p-8">
      <AnyTable
        title="مستخدمي تطبيق Next.js"
        api={{
          fetcher: (params) => fetch(`/api/users?${new URLSearchParams(params as any)}`).then(r => r.json()),
        }}
      />
    </main>
  );
}
```

---

## 📄 License

Distributed under the **MIT License**. Created with ❤️ by [Kareem Elbalshe](https://github.com/kareemelbalshe).

