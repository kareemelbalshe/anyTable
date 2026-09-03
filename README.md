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

### 1. Action Buttons with Icons & Labels

AnyTable supports rich action buttons and handles **ANY icon format** automatically:
- **React Components directly** (e.g. `icon: FiEye` from `react-icons` or Lucide, without needing `< >`)
- **JSX Elements** (e.g. `icon: <FiEye size={16} className="text-blue-500" />`)
- **Dynamic Functions** (e.g. `icon: (row) => row.isLocked ? FiUnlock : FiLock`)
- **Emoji / Text strings** (e.g. `icon: "⭐"` or `"✏️"`)
- **Image URLs & SVGs** (e.g. `icon: "/icons/edit.svg"` or `"https://..."`)

```tsx
import { FiEye, FiEdit2, FiTrash2, FiLock, FiUnlock } from "react-icons/fi";

<AnyTable<User>
  data={users}
  actionsTitle="Operations" // Custom column header (default: "Actions")
  actionsWidth={280}        // Custom column width in px
  actions={[
    // 1. Direct Component from react-icons (Cleanest syntax: no JSX tags needed!)
    {
      id: "view",
      label: "View",
      icon: FiEye, // Passes component reference directly
      variant: "primary",
      onClick: (row) => navigate(`/users/${row.id}`),
    },

    // 2. JSX Element with custom props
    {
      id: "edit",
      icon: <FiEdit2 size={15} className="text-blue-400" />,
      tooltip: "Edit User Information",
      variant: "neutral",
      onClick: (row) => openEditModal(row),
    },

    // 3. Dynamic Icon & Variant based on row data
    {
      id: "toggle-lock",
      icon: (row) => (row.isLocked ? FiUnlock : FiLock),
      label: (row) => (row.isLocked ? "Unlock" : "Lock"),
      variant: (row) => (row.isLocked ? "warning" : "neutral"),
      onClick: async (row, context) => {
        await api.toggleLock(row.id);
        context.refresh();
      },
    },

    // 4. Emoji or Text String
    {
      id: "star",
      icon: "⭐",
      tooltip: "Bookmark",
      onClick: (row) => toggleBookmark(row),
    },

    // 5. Image URL or custom SVG path
    {
      id: "badge",
      icon: "/icons/verified.svg",
      tooltip: "Verified Badge",
      onClick: (row) => openBadge(row),
    },

    // 4. Destructive Action with Icon & Confirmation
    {
      id: "delete",
      icon: <FiTrash2 />,
      label: "Delete",
      variant: "danger",
      confirmation: {
        title: "Delete Account",
        message: (row) => `Are you sure you want to delete ${row.name}?`,
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
      },
      onClick: async (row, context) => {
        await api.deleteUser(row.id);
        context.refresh();
      },
    },
  ]}
/>
```

#### Action Configuration Reference (`TableAction<TData>`)

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | **Required** | Unique identifier for this action. |
| `icon` | `ReactNode \| ((row: TData) => ReactNode)` | `undefined` | Custom icon element (SVG, `react-icons`, emoji) or dynamic generator function. |
| `label` | `string \| ((row: TData) => string)` | `undefined` | Action text label. Optional (can be omitted for icon-only buttons). |
| `variant` | `ActionVariant \| ((row) => ActionVariant)` | `'neutral'` | Theme color: `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral' \| 'ghost'`. |
| `tooltip` | `string \| ((row: TData) => string)` | `undefined` | Helpful hover tooltip (recommended for icon-only buttons). |
| `onClick` | `(row, context) => void \| Promise<void>` | `undefined` | Click callback receiving current row and table controller context. |
| `disabled` | `boolean \| ((row: TData) => boolean)` | `false` | Conditionally disable the button for specific rows. |
| `show` / `hide`| `boolean \| ((row: TData) => boolean)` | `undefined` | Conditionally show or hide the action per row. |
| `loading` | `boolean \| ((row: TData) => boolean)` | `false` | Displays an inline spinner while async operations execute. |
| `confirmation`| `ActionConfirmation<TData>` | `undefined` | Built-in confirmation modal config before triggering `onClick`. |
| `className` | `string \| ((row: TData) => string)` | `""` | Additional Tailwind / custom CSS classes. |
| `color` | `string` | `undefined` | Custom background color override (hex / rgb). |


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

## 🎨 Theming & Styling Architecture (Global & Per-Page)

AnyTable is designed from the ground up for maximum visual flexibility. You can define a **unified global theme once** for all tables in your application, or customize tables individually on specific pages.

---

### 🎭 Built-in Visual Presets (1-Line Designer Themes)

AnyTable comes pre-packaged with **8 handcrafted design presets**. You can switch the entire aesthetic of any table with a single prop:

```tsx
<AnyTable preset="midnight" data={cryptoTransactions} />
<AnyTable preset="emerald" data={financialInvoices} />
<AnyTable preset="ocean" data={shipmentLogistics} />
<AnyTable preset="luxury" data={vipCustomers} />
<AnyTable preset="crimson" data={criticalAlerts} />
<AnyTable preset="minimal" data={cleanArticles} />
<AnyTable preset="corporate" data={enterpriseData} />
```

| Preset | Visual Identity | Primary Accent | Vibe / Recommended For |
| :--- | :--- | :--- | :--- |
| **`default`** | Modern Electric Blue + Balanced Slate | `#2667EC` | General SaaS, Admin Dashboards, Standard Products |
| **`midnight`** | Deep Cyber Void + Luminous Neon Indigo | `#6366F1` | Developer Tools, Cyber Security, Web3, Crypto Dashboards |
| **`emerald`** | Crisp Forest + Vibrant Mint Green | `#10B981` | Fintech, Banking, Healthcare, Accounting, Analytics |
| **`ocean`** | Deep Marine Navy + Radiant Cyan / Teal | `#0EA5E9` | Logistics, Supply Chain, Travel, Cloud Monitoring |
| **`luxury`** | Champagne Gold + Obsidian & Bronze | `#D97706` | VIP Tiers, High-End Fashion, Real Estate, Concierge |
| **`crimson`** | Bold Scarlet Rose + High Contrast | `#F43F5E` | Security Incidents, Critical Errors, Alert Monitors |
| **`minimal`** | Monochromatic Borderless Airy High-Contrast | Monochromatic | Notion-style docs, Clean portfolios, Minimalist blogs |
| **`corporate`** | Structured Enterprise Navy + Classic Borders | `#1E40AF` | ERP Systems, Traditional Corporate Systems, Audits |

---

### 🛠️ Deep Granular Customization (Control Every Pixel Literally)

Don't want presets? AnyTable allows you to manually dictate the exact color, border, padding, and class for **literally every single element**:

```tsx
<AnyTable<Order>
  data={orders}
  bordered={false} // Toggle table wrapper borders
  compact={false}  // Density control ('compact' | 'normal' | 'spacious')

  // 1. Custom CSS on the <thead> element
  headerClassName="bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 uppercase tracking-widest text-[11px]"

  // 2. Dynamic Row Styling based on row data
  rowClassName={(row, index) =>
    row.status === "Cancelled"
      ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold"
      : row.tier === "VIP"
      ? "bg-amber-500/10 hover:bg-amber-500/20"
      : ""
  }

  // 3. Complete Deep Theme Token Overrides
  theme={{
    borderRadius: "0px", // Sharp brutalist square borders, or "1.5rem" for pill curves
    fontFamily: "'Fira Code', monospace", // Custom font
    density: "normal",
    colors: {
      primary: "#9333EA",              // Active pagination, search rings, default button
      primaryHover: "#7E22CE",
      border: "#3B0764",               // Border color everywhere
      theadBg: "#1E1B4B",              // Custom header background
      theadText: "#E0E7FF",            // Custom header text color
      rowHover: "rgba(147, 51, 234, 0.08)", // Row hover background
      rowSelected: "rgba(147, 51, 234, 0.16)",
      card: "#0F0B1E",                 // Card background
    },
    classes: {
      tableWrapper: "border-2 border-purple-800/50 shadow-2xl shadow-purple-900/30",
      searchInput: "bg-purple-950/40 border border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-purple-500",
      paginationButtonActive: "bg-purple-600 text-white font-black shadow-lg shadow-purple-600/50",
    },
  }}
/>
```

---

### 🌐 Part 1: How to Set a Unified Global Style for ALL Tables

There are **3 recommended ways** to define a global style across your entire application:

#### Method A: Global Provider (`AnyTableThemeProvider`) — *Recommended*

Wrap your root layout or application entry point with `<AnyTableThemeProvider>`. Every `<AnyTable />` across all pages will automatically inherit these brand colors, Tailwind classes, and layout rules:

**In Next.js (`app/layout.tsx` or `pages/_app.tsx`):**
```tsx
import "@kareemelbalshe/any-table/style.css";
import { AnyTableThemeProvider } from "@kareemelbalshe/any-table";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnyTableThemeProvider
          theme={{
            colors: {
              primary: "#2667EC",        // Your brand primary color
              primaryHover: "#1E54C6",
              card: "#0f172a",           // Dark card background
              border: "#1e293b",         // Subtle borders
            },
            borderRadius: "1rem",        // Rounded table corners
            density: "normal",           // 'compact' | 'normal' | 'comfortable'
            classes: {
              // Custom Tailwind classes applied to all tables in the app
              tableWrapper: "rounded-2xl border border-slate-800 shadow-xl shadow-blue-500/5",
              thead: "bg-slate-900/90 backdrop-blur-md text-slate-300 font-bold uppercase text-xs",
              searchInput: "rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-primary",
              paginationButtonActive: "bg-primary text-white shadow-md shadow-primary/30",
            },
          }}
        >
          {children}
        </AnyTableThemeProvider>
      </body>
    </html>
  );
}
```

**In Vite / CRA (`src/main.tsx` or `src/App.tsx`):**
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { AnyTableThemeProvider } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnyTableThemeProvider
      theme={{
        colors: { primary: "#7c3aed" }, // Violet brand theme
        borderRadius: "0.75rem",
      }}
    >
      <App />
    </AnyTableThemeProvider>
  </React.StrictMode>
);
```

---

#### Method B: Global CSS Variables (`globals.css` / `index.css`)

AnyTable exposes native CSS variables that can be overridden directly in your global stylesheet:

```css
/* In your globals.css or index.css */
:root {
  --any-table-primary: #2667EC;         /* Main brand accent */
  --any-table-primary-hover: #1E54C6;
  --any-table-primary-soft: #397FF6;
  --any-table-secondary: #39E965;       /* Secondary accent */
  --any-table-success: #10B981;
  --any-table-warning: #F59E0B;
  --any-table-danger: #EF4444;
  --any-table-font: "Inter", system-ui, sans-serif; /* Global table font */
}
```

---

#### Method C: Corporate Preset Component (`components/AppTable.tsx`)

A proven enterprise pattern is to create a reusable wrapper component that pre-configures common settings (like standard actions title, bordered, striped, etc.):

```tsx
// components/AppTable.tsx
import { AnyTable, AnyTableProps } from "@kareemelbalshe/any-table";

export function AppTable<TData = any>(props: AnyTableProps<TData>) {
  return (
    <AnyTable<TData>
      bordered
      hoverable
      striped={false}
      actionsTitle="Operations"
      actionsWidth={220}
      className="shadow-sm transition-all"
      {...props} // Allows per-page overrides whenever needed
    />
  );
}

// Then in ANY page, just use:
// <AppTable data={orders} />
```

---

### 📄 Part 2: Per-Page & Per-Table Customization (All Real-World Cases)

When using AnyTable on specific pages, you can customize the appearance to match the exact context:

#### Case 1: Pure Zero-Config (Inherits Global Theme Automatically)
```tsx
// Consumes the root AnyTableThemeProvider automatically with zero extra code
<AnyTable data={users} />
```

#### Case 2: Local Color Override on a Specific Page
```tsx
// Overrides the primary color to Emerald for a Financials page without affecting other pages
<AnyTable
  data={invoices}
  theme={{
    colors: {
      primary: "#10B981", // Emerald accent for finance
    },
  }}
/>
```

#### Case 3: Dense Data Dashboard (`compact` mode)
```tsx
// Tight padding for high-density enterprise data tables
<AnyTable
  data={logs}
  compact={true}        // Reduces padding on cells and headers
  stickyHeader={true}   // Keeps the header visible while scrolling
/>
```

#### Case 4: Visual Presets (Zebra Striped, Borderless, or Shadowed)
```tsx
<AnyTable
  data={products}
  bordered={false}      // Clean borderless look
  striped={true}        // Alternating zebra row backgrounds
  hoverable={true}      // Subtle highlight on hovered row
  className="shadow-2xl rounded-3xl"
  tableClassName="text-xs"
/>
```

#### Case 5: Per-Column & Per-Cell Styling
```tsx
<AnyTable
  data={transactions}
  columns={[
    { key: "id", title: "Ref #", width: 100 },
    // Custom cell text color, alignment, and font
    {
      key: "amount",
      title: "Amount",
      align: "right",
      className: "font-mono font-black text-emerald-500",
      headerClassName: "text-right",
    },
    // Custom JSX rendering inside a cell
    {
      key: "riskScore",
      title: "Risk Level",
      render: (val) => (
        <span className={val > 70 ? "text-rose-500 font-bold" : "text-gray-400"}>
          {val}%
        </span>
      ),
    },
  ]}
/>
```

#### Case 6: Dark Mode & Light Mode
AnyTable automatically synchronizes with Tailwind's `dark` class on the `<html>` or `<body>` element (seamlessly compatible with `next-themes`). You can also force a specific mode on any table:
```tsx
<AnyTable
  data={users}
  theme={{ mode: "dark" }} // Forces dark theme regardless of system setting
/>
```

#### Case 7: Custom Action Buttons Styling
```tsx
<AnyTable
  data={users}
  actions={[
    {
      id: "vip-btn",
      label: "VIP Upgrade",
      icon: "⭐",
      color: "#8B5CF6", // Custom purple hex background
      className: "hover:scale-105 shadow-md shadow-purple-500/30",
      onClick: (row) => upgradeUser(row),
    },
    {
      id: "delete",
      icon: "🗑️",
      variant: "danger", // Built-in danger theme
      onClick: (row) => deleteUser(row),
    },
  ]}
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

### 💡 الحالة 5: أزرار العمليات المتقدمة، الأيقونات، ومفاتيح التبديل (Action Buttons, Icons & Switches)
تتعامل AnyTable مع **أي شكل من أشكال الأيقونات تلقائياً وبكل مرونة**:
- **مكوّن `react-icons` أو Lucide مباشرة بدون أوسمة** (مثل: `icon: FiEye` مباشرة دون الحاجة لكتابة `< >`).
- **عنصر JSX كامل** مع تمرير الحجم واللون (مثل: `<FiEdit3 size={16} className="text-blue-500" />`).
- **دالة ديناميكية** ترجع مكوّن أو JSX حسب بيانات السطر `(row) => row.isLocked ? FiUnlock : FiLock`.
- **نص أو إيموجي** (مثل: `icon: "⭐"` أو `"🗑️"`).
- **مسار صورة أو SVG** (مثل: `icon: "/icons/avatar.svg"` أو رابط خارجي).

```tsx
import { FiEye, FiEdit3, FiTrash2, FiLock, FiUnlock } from "react-icons/fi";

<AnyTable
  data={users}
  actionsTitle="الإجراءات" // عنوان عمود العمليات (افتراضياً: "Actions")
  actionsWidth={280}        // عرض عمود العمليات بالبكسل للتحكم في المساحة
  actions={[
    // 1. مكوّن من react-icons مباشرة (أنظف طريقة: بدون أقواس JSX)
    {
      id: "view",
      label: "عرض",
      icon: FiEye, // تمرير المكوّن مباشرة
      variant: "primary",
      onClick: (row) => router.push(`/users/${row.id}`),
    },

    // 2. عنصر JSX مع خصائص الحجم واللون وتلميح Tooltip
    {
      id: "edit",
      icon: <FiEdit3 size={15} className="text-blue-400" />,
      tooltip: "تعديل بيانات المستخدم",
      variant: "neutral",
      onClick: (row) => openEditModal(row),
    },

    // 3. أيقونة ونص ديناميكي يتغير حسب بيانات السطر (Dynamic Component)
    {
      id: "toggle-lock",
      icon: (row) => (row.isLocked ? FiUnlock : FiLock),
      label: (row) => (row.isLocked ? "إلغاء القفل" : "قفل الحساب"),
      variant: (row) => (row.isLocked ? "warning" : "neutral"),
      onClick: async (row, context) => {
        await axios.patch(`/api/users/${row.id}/toggle-lock`);
        context.refresh(); // إعادة جلب البيانات فوراً
      },
    },

    // 4. إيموجي لطيف كأيقونة
    {
      id: "star-btn",
      icon: "⭐",
      tooltip: "تمييز بنجمة",
      onClick: (row) => toggleStar(row),
    },

    // 5. مسار صورة أو SVG مخصص
    {
      id: "verified-badge",
      icon: "/icons/verified.svg",
      tooltip: "حساب موثق",
      onClick: (row) => showBadgeModal(row),
    },

    // 4. مفتاح تبديل PATCH فوري (Instant Switch)
    {
      id: "active-switch",
      type: "switch",
      label: "تفعيل",
      checked: (row) => row.isActive,
      onChange: async (row, nextState, context) => {
        await axios.patch(`/api/users/${row.id}`, { isActive: nextState });
        context.refresh();
      },
    },

    // 5. زر حذف بأيقونة ونافذة تأكيد مدمجة (Confirmation Modal)
    {
      id: "delete-btn",
      label: "حذف",
      icon: <FiTrash2 />,
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
/>
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

### 💡 الحالة 10: الستايلات الجاهزة المعينة (Presets) والتخصيص اليدوي الكامل لكل تفصيلة في الجدول حرفياً (Theming & Granular Customization)

توفر لك مكتبة **AnyTable** نظام تصميم مزدوج:
1. **شوية استايلات جاهزة معينة (Built-in Presets)** يختار منها المطور بكلمة واحدة (`preset="midnight"`).
2. **تخصيص يدوي كامل لكل حاجة حرفياً** من أول البوردرات وتدوير الحواف وألوان الأزرار وترويسة الجدول وألوان الصفوف الديناميكية.

---

#### 🎭 1. الستايلات الجاهزة المعينة (Built-in Presets):
يمكنك تغيير شكل وهوية الجدول بالكامل بتمرير خاصية `preset`:

```tsx
<AnyTable preset="midnight" data={cryptoData} />
<AnyTable preset="emerald" data={finances} />
<AnyTable preset="ocean" data={shipments} />
<AnyTable preset="luxury" data={vipUsers} />
<AnyTable preset="crimson" data={incidents} />
<AnyTable preset="minimal" data={documents} />
<AnyTable preset="corporate" data={auditLogs} />
```

| البريسيت | الطابع الجمالي | اللون الأساسي | الاستخدام المثالي |
| :--- | :--- | :--- | :--- |
| **`default`** | الأزرق الكهربائي العصري + رمادي متزن | `#2667EC` | لوحات التحكم العامة، وتطبيقات SaaS المعتادة |
| **`midnight`** | الوضع الليلي العميق + توهج نيون إنديجو | `#6366F1` | أدوات المطورين، الأمن السيبراني، ومنصات الكريبتو |
| **`emerald`** | الأخضر الزمردي والنعناعي المنعش | `#10B981` | التكنولوجيا المالية، الفواتير، الصحة، والتحليلات |
| **`ocean`** | الأزرق البحري العميق + سماوي متألق | `#0EA5E9` | الخدمات اللوجستية، الشحن، السفر، ومراقبة السيرفرات |
| **`luxury`** | الذهبي والكهرمان الفاخر + أسود زجاجي | `#D97706` | فئات الـ VIP، السلع الفاخرة، والعقارات |
| **`crimson`** | القرمزي والوردي الصارخ | `#F43F5E` | جداول الحوادث الطارئة، السجلات الخطيرة، والتنبيهات |
| **`minimal`** | بسيط بدون حواف وبتباين عالٍ وأنيق | أحادي اللون | المقالات، واجهات Notion، والمواقع الشخصية |
| **`corporate`** | كحلي شركات رصين بحواف كلاسيكية منظمة | `#1E40AF` | أنظمة الـ ERP، البنوك التقليدية، والمؤسسات الرسمية |

---

#### 🛠️ 2. التخصيص اليدوي الشامل لكل تفصيلة حرفياً (Granular Customization):
إذا أردت وضع قيمة كل شيء بنفسك، من أول البوردر إلى ألوان الأزرار والصفوف:

```tsx
<AnyTable<Order>
  data={orders}
  bordered={true}  // إظهار أو إخفاء حواف الجدول بالكامل
  compact={false}  // كثافة التباعد ('compact' | 'normal' | 'spacious')

  // 1. تخصيص ترويسة الجدول <thead> بكلاسات تيلويند خاصة
  headerClassName="bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 font-black text-xs uppercase"

  // 2. تلوين كل سطر ديناميكياً بحسب حالته
  rowClassName={(row, index) =>
    row.status === "Cancelled"
      ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold"
      : row.isVip
      ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600"
      : ""
  }

  // 3. التحكم الكامل في قيم الستايل والألوان والحواف
  theme={{
    borderRadius: "0px", // زوايا حادة تماماً (Brutalist)، أو "1.5rem" لزوايا فائقة الاستدارة
    fontFamily: "'Cairo', sans-serif", // خط مخصص للجداول
    colors: {
      primary: "#8B5CF6",              // لون أزرار الترقيم، وعناصر البحث النشطة
      primaryHover: "#7C3AED",         // لون الـ Hover للأزرار
      border: "#4C1D95",               // لون حواف الجدول والخلايا
      theadBg: "#1E1B4B",              // خلفية الترويسة
      theadText: "#E0E7FF",            // لون خط الترويسة
      rowHover: "rgba(139, 92, 246, 0.08)", // لون مرور الماوس على السطر
      rowSelected: "rgba(139, 92, 246, 0.16)", // لون السطر المحدد بـ Checkbox
      card: "#0F0A1E",                 // خلفية كارت الجدول
    },
    classes: {
      tableWrapper: "border-2 border-purple-800 shadow-2xl shadow-purple-900/30",
      searchInput: "bg-purple-950/40 border border-purple-700 text-white placeholder:text-purple-400",
      paginationButtonActive: "bg-purple-600 text-white font-black shadow-lg shadow-purple-600/50",
    },
  }}
/>
```

---

#### 🌟 3. أين وكيف تضع الاستايل الموحد لكافة الجداول في المشروع؟

لديك **3 طرق قياسية واحترافية** لتطبيق استايل موحد للمشروع كاملاً:

##### الطريقة 1: استخدام المزوّد العام `AnyTableThemeProvider` في جذر المشروع (الأفضل والأنظف)
قم بإحاطة تطبيقك بمكوّن `<AnyTableThemeProvider>` مرة واحدة في ملف الـ Layout الرئيسي:

**في Next.js (داخل ملف `app/layout.tsx` أو `pages/_app.tsx`):**
```tsx
import "@kareemelbalshe/any-table/style.css";
import { AnyTableThemeProvider } from "@kareemelbalshe/any-table";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AnyTableThemeProvider
          theme={{
            colors: {
              primary: "#2667EC",        // اللون الأساسي لأزرار البحث والترقيم والعمليات
              primaryHover: "#1E54C6",
              card: "#0f172a",           // لون خلفية كارت الجدول
              border: "#1e293b",         // لون الحواف الخفيفة
            },
            borderRadius: "1rem",        // تدوير حواف الجداول
            density: "normal",           // كثافة التباعد: 'compact' | 'normal' | 'comfortable'
            classes: {
              // كلاسات Tailwind تطبق تلقائياً على كل الجداول في كل صفحات الموقع
              tableWrapper: "rounded-2xl border border-slate-800 shadow-xl",
              thead: "bg-slate-900/90 backdrop-blur-md text-slate-300 font-bold uppercase text-xs",
              searchInput: "rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-primary",
              paginationButtonActive: "bg-primary text-white shadow-md shadow-primary/30",
            },
          }}
        >
          {children}
        </AnyTableThemeProvider>
      </body>
    </html>
  );
}
```

**في تطبيقات Vite / React (داخل `src/main.tsx` أو `src/App.tsx`):**
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { AnyTableThemeProvider } from "@kareemelbalshe/any-table";
import "@kareemelbalshe/any-table/style.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnyTableThemeProvider
      theme={{
        colors: { primary: "#7c3aed" }, // لون الهوية البنفسجي للمشروع
        borderRadius: "0.75rem",
      }}
    >
      <App />
    </AnyTableThemeProvider>
  </React.StrictMode>
);
```
> **النتيجة السحرية:** الآن في أي صفحة تستدعي فيها `<AnyTable data={...} />`، ستجد الجدول يظهر فوراً بألوان مشروعك وهوية موقعك بدون كتابة أي إعدادات تصميم في الصفحة!

---

##### الطريقة 2: عبر متغيرات الـ CSS العامة (داخل `globals.css` أو `index.css`)
إذا كنت تفضل التحكم في الألوان عبر CSS مباشرة:
```css
/* في ملف globals.css أو index.css الرئيسي */
:root {
  --any-table-primary: #2667EC;         /* لون الأزرار والعناصر الفعالة */
  --any-table-primary-hover: #1E54C6;
  --any-table-primary-soft: #397FF6;
  --any-table-secondary: #39E965;       /* لون ثانوي */
  --any-table-success: #10B981;
  --any-table-warning: #F59E0B;
  --any-table-danger: #EF4444;
  --any-table-font: "Alexandria", system-ui, sans-serif; /* خط الجداول الموحد */
}
```

---

##### الطريقة 3: إنشاء مكوّن وسيط موحد للمشروع (`components/AppTable.tsx`)
وهو أسلوب الشركات الكبرى (Enterprise Best Practice) لإنشاء مكوّن مسبق الإعدادات:
```tsx
// components/AppTable.tsx
import { AnyTable, AnyTableProps } from "@kareemelbalshe/any-table";

export function AppTable<TData = any>(props: AnyTableProps<TData>) {
  return (
    <AnyTable<TData>
      bordered={true}
      hoverable={true}
      striped={false}
      actionsTitle="الإجراءات" // عنوان عمود العمليات الموحد
      actionsWidth={220}
      className="shadow-sm transition-all"
      {...props} // يسمح لأي صفحة بتجاوز أي خاصية عند الحاجة
    />
  );
}

// ثم في أي صفحة داخل مشروعك:
// <AppTable data={orders} />
```

---

#### 📄 ثانياً: جميع حالات الاستخدام الممكنة عند استخدام الجدول في الصفحات (All Page Use Cases)

إليك كل الحالات العملية التي قد تحتاجها أثناء بناء صفحاتك:

##### الحالة 1: الاستخدام التلقائي المباشر (Zero-Config)
يرث الستايل الموحد من الـ Provider بدون أي كود إضافي:
```tsx
<AnyTable data={users} />
```

##### الحالة 2: تغيير لون جدول مالي أو تحذيري في صفحة محددة (Local Theme Override)
إذا أردت جعل جدول في صفحة الحسابات والماليات باللون الأخضر (Emerald) دون التأثير على باقي جداول الموقع:
```tsx
<AnyTable
  data={invoices}
  theme={{
    colors: {
      primary: "#10B981", // تغيير اللون لهذا الجدول فقط
    },
  }}
/>
```

##### الحالة 3: شاشات العمليات والبيانات الكثيفة (High-Density Dashboard)
لجعل المسافات الداخلية أصغر وتثبيت الهيدر أثناء التمرير العمودي:
```tsx
<AnyTable
  data={auditLogs}
  compact={true}       // يقلل الـ padding للأسطر والخلايا لعرض كمية بيانات أكبر
  stickyHeader={true}  // يثبت ترويسة الجدول أثناء النزول بالماوس
/>
```

##### الحالة 4: التبديل بين الأنماط المظهرية الجاهزة (Visual Presets)
```tsx
<AnyTable
  data={products}
  bordered={false}     // إخفاء الحواف الخارجية لمظهر ناعم وبسيط
  striped={true}       // تفعيل الصفوف المقلمة المتبادلة (Zebra Stripes)
  hoverable={true}     // إضاءة وتمييز السطر عند الوقوف عليه بالماوس
  className="shadow-2xl rounded-3xl" // كلاسات إضافية للكارت الخارجي
  tableClassName="text-xs"           // تصغير حجم خط الجدول
/>
```

##### الحالة 5: تنسيق عمود أو خلية معينة بمظهر مخصص (Per-Column & Per-Cell)
```tsx
<AnyTable
  data={orders}
  columns={[
    { key: "id", title: "رقم الطلب", width: 100 },
    // تخصيص الخط والمحاذاة ولون النص لعمود المبلغ
    {
      key: "totalAmount",
      title: "الإجمالي",
      align: "right",
      className: "font-mono font-bold text-emerald-500",
      headerClassName: "text-right",
    },
    // تخصيص خلية بالكامل عبر JSX
    {
      key: "status",
      title: "حالة الدفع",
      render: (val) => (
        <span className={val === "Paid" ? "bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-full text-xs font-bold" : "bg-rose-500/20 text-rose-500 px-2 py-1 rounded-full text-xs font-bold"}>
          {val}
        </span>
      ),
    },
  ]}
/>
```

##### الحالة 6: التحكم في الوضع الليلي والنهاري (Dark / Light Mode)
الجدول يتوافق تلقائياً مع كلاس `dark` في Tailwind أو مكتبات مثل `next-themes`. كما يمكنك إجبار جدول معين على وضع محدد:
```tsx
// إجبار هذا الجدول على وضع الـ Dark Mode دائماً
<AnyTable data={users} theme={{ mode: "dark" }} />
```

##### الحالة 7: تخصيص أزرار العمليات (Action Buttons Styling)
```tsx
<AnyTable
  data={users}
  actions={[
    {
      id: "vip-btn",
      label: "ترقية VIP",
      icon: "⭐",
      color: "#8B5CF6", // لون مخصص عبر Hex
      className: "hover:scale-105 shadow-md shadow-purple-500/30",
      onClick: (row) => upgradeUser(row),
    },
    {
      id: "delete",
      icon: "🗑️",
      variant: "danger", // ستايل الخطر الجاهز
      onClick: (row) => deleteUser(row),
    },
  ]}
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

