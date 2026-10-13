import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAnyTable } from "../hooks/useAnyTable";

describe("useAnyTable Headless Hook", () => {
  const sampleData = [
    { id: 1, name: "Ali", role: "Developer" },
    { id: 2, name: "Kareem", role: "Architect" },
    { id: 3, name: "Sara", role: "Designer" },
  ];

  it("initializes with auto-detected columns and paginated rows", () => {
    const { result } = renderHook(() =>
      useAnyTable({
        data: sampleData,
      })
    );

    expect(result.current.rows.length).toBe(3);
    expect(result.current.totalRecords).toBe(3);
    expect(result.current.columns.length).toBeGreaterThanOrEqual(3);
  });

  it("supports client-side search, sorting, and pagination headless controls", async () => {
    const { result } = renderHook(() =>
      useAnyTable({
        data: sampleData,
        pagination: { defaultPageSize: 2 },
      })
    );

    expect(result.current.rows.length).toBe(2);
    expect(result.current.pagination.totalPages).toBe(2);

    // Navigate to page 2
    act(() => {
      result.current.pagination.setPage(2);
    });
    expect(result.current.pagination.page).toBe(2);
    expect(result.current.rows.length).toBe(1);

    // Search for "Kareem"
    act(() => {
      result.current.search.setSearch("Kareem");
    });
    expect(result.current.search.query).toBe("Kareem");
  });

  it("supports row selection headlessly", () => {
    const { result } = renderHook(() =>
      useAnyTable({
        data: sampleData,
      })
    );

    expect(result.current.selection.selectedRows.length).toBe(0);

    // Select row with ID 2
    act(() => {
      result.current.selection.toggleSelectRow(2, sampleData[1]);
    });

    expect(result.current.selection.selectedKeys.has(2)).toBe(true);
    expect(result.current.selection.selectedRows.length).toBe(1);
    expect(result.current.selection.selectedRows[0].name).toBe("Kareem");

    // Clear selection
    act(() => {
      result.current.selection.clearSelection();
    });
    expect(result.current.selection.selectedRows.length).toBe(0);
  });
});
