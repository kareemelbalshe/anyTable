# 📝 AnyTable Changelog

All notable changes to **AnyTable** (`@kareemelbalshe/any-table`) are documented in this file in adherence with [Semantic Versioning (SemVer)](https://semver.org/).

---

## [1.1.0] - 2026-10-13

### 🌟 New Features & Enhancements
- 📊 **Native Zero-Dependency Export Engine**:
  - Export data to **CSV** and **JSON** right from the table toolbar or programmatically.
  - **UTF-8 BOM (`\uFEFF`)** prepended to ensure Microsoft Excel correctly displays Arabic, international characters, and UTF-8 symbols without character corruption.
  - Added `exportable` prop supporting `{ csv: boolean, json: boolean, filename: string }`.
  - Exposed imperative `tableRef.current.exportData(format, filename)` controller method.
- 🌍 **First-Class Internationalization (i18n) & RTL Support**:
  - Full bidirectional support with `dir="ltr" | "rtl" | "auto"` and `locale="ar" | "en" | string`.
  - Built-in English and Arabic dictionary presets covering search placeholders, empty states, error messages, and pagination controls.
  - Automatic layout mirroring for headers, action buttons, pagination pills, and sort indicators when RTL is active.
  - Custom dictionary overrides via `messages` prop.
- 📌 **Column Pinning (Sticky Columns)**:
  - Added `pinned: "left" | "right"` support in `ColumnDef`.
  - Sticky offsets calculated dynamically for multi-column horizontal scrolling, with persistent shadows and background opacity.
- ↔️ **Interactive Column Resizing**:
  - Added `resizableColumns` table prop and `col.resizable` flag.
  - Smooth mouse-drag handles on table header cells with min-width constraints.
- 🧩 **Standalone Headless Hook (`useAnyTable`)**:
  - Introduced `useAnyTable()` headless hook enabling developers to consume table state, smart auto-columns, API pagination, and sorting with 100% custom UI components (e.g., Shadcn UI, Chakra, Tailwind).
- 🏷️ **npm Metadata & SEO Expansion**:
  - Expanded keywords and enriched package description for enhanced discoverability on npm registry and GitHub search.

---

## [1.0.4] - 2026-10-12

### ⚡ Architectural Breakthroughs
- 🚀 **Native Zero-Dependency DOM Virtualization**:
  - Handles **100,000+ rows** with continuous 60fps scrolling and zero frame drops.
  - Renders only visible viewport rows (~25 elements) without external dependencies (`0 KB` runtime overhead).
  - Smooth programmatic scrolling via `tableRef.current.scrollToIndex(index, align)`.
- 🌐 **Universal React Compatibility**:
  - Fully verified and tested against React 16.8+, React 17, React 18, and React 19.
  - Zero peer dependency warnings.
- 📦 **Zero Runtime Dependencies**:
  - Purged all external runtime libraries (`dependencies: 0`).
- 🕹️ **Imperative Controller API**:
  - Seamless support for both `ref={tableRef}` and `tableRef={tableRef}` with full TypeScript generics `<TData>`.
- ☑️ **Cross-Page Selection Persistence**:
  - Retains checked item states across pagination pages.

---

## [1.0.0] - 2026-10-10

### 🚀 Initial Public Release
- 🧠 **3-Tier Smart REST API Adapter**:
  - Level 1: Automatic zero-config array detection.
  - Level 2: Dot-notation response mapping (`data.records`, `pagination.total`).
  - Level 3: Custom response transformer.
- 🔍 **Dynamic Columns & Type Inference**:
  - Automatic key extraction and data type detection (currency, dates, badges, boolean switches, avatars, phone numbers).
- 🎨 **Theme Engine & 8 Presets**:
  - `default`, `midnight`, `emerald`, `ocean`, `luxury`, `crimson`, `minimal`, and `corporate`.
  - Complete Dark Mode support and CSS variables customization.
- 🔄 **Row Actions & Instant PATCH Switches**:
  - In-place toggle switches for quick server updates.
