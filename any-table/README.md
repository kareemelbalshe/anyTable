# 🚀 AnyTable — Smart Data Table Library for React

> **A developer-facing, smart data table library for React (18 & 19) & TypeScript with 3-Tier API auto-detection, dynamic column extraction, autonomous server/client search, sorting & pagination, interactive row actions with instant PATCH switches, and zero business logic coupling.**

[![npm version](https://img.shields.io/npm/v/@kareem/any-table.svg)](https://npmjs.org/package/@kareem/any-table)
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
- [🌐 Real-World External Public API Recipes](#-real-world-external-public-api-recipes)
- [🏢 Ultimate Enterprise Logistics & Orders Management (Real-World Pattern)](#-ultimate-enterprise-logistics--orders-management-real-world-pattern)
- [🎯 Row Actions & Instant PATCH Switches](#-row-actions--instant-patch-switches)
- [🛠️ Column Types & Smart Renderers](#️-column-types--smart-renderers)
- [🕹️ Imperative Controller API (`tableRef`)](#️-imperative-controller-api-tableref)
- [☑️ Selection & Batch Operations](#️-selection--batch-operations)
- [🛡️ Graceful Error Handling & Skeleton States](#️-graceful-error-handling--skeleton-states)
- [🎨 Theming & Dark Mode](#-theming--dark-mode)
- [🌐 Integration Guides (Next.js & Vite)](#-integration-guides-nextjs--vite)
- [📋 Props & Types Reference](#-props--types-reference)
- [🇪🇬 دليل المبرمج الشامل باللغة العربية (All Use Cases Guide)](#-دليل-المبرمج-الشامل-باللغة-العربية-all-use-cases-guide)
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

```bash
# Using NPM
npm install @kareem/any-table react-icons

# Using Yarn
yarn add @kareem/any-table react-icons

# Using PNPM
pnpm add @kareem/any-table react-icons
```

Import the stylesheet once in your main entry point:
```tsx
import "@kareem/any-table/style.css";
```

---

## 🇪🇬 دليل المبرمج الشامل باللغة العربية (All Use Cases Guide)

مكتبة **AnyTable** مصممة لتجعل بناء الجداول في تطبيقات **React 18/19** و **Next.js** و **TypeScript** سريعة وخالية من أي كود متكرر (Boilerplate)، مع فصل كامل لمنطق العمل (Business Logic) عن واجهة العرض.

---

### 📦 الخطوة 1: التثبيت والاستيراد الأساسي
```bash
npm install @kareem/any-table react-icons
```
في ملف المدخل الأساسي لتطبيقك (`main.tsx` أو `App.tsx` أو `app/layout.tsx`):
```tsx
import "@kareem/any-table/style.css";
```

---

### 💡 الحالة 1: جدول فوري بدون أي إعداد للأعمدة (Zero Configuration)
مرر مصفوفة بيانات خام مباشرة، وسيقوم الجدول باستخراج الحقول وتحويل العناوين وضبط البحث والترقيم تلقائياً:
```tsx
import { AnyTable } from "@kareem/any-table";

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
import { AnyTable, TableInstance } from "@kareem/any-table";

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

import { AnyTable } from "@kareem/any-table";
import "@kareem/any-table/style.css";

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
