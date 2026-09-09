import React, { createRef } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { AnyTable } from "../components/AnyTable";
import { useAnyTableVirtualizer } from "../hooks/useAnyTableVirtualizer";
import { TableInstance } from "../types/table.types";

describe("DOM Virtualization Engine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates windowing and spacer heights correctly for 100,000 rows in hook", () => {
    const mockContainer = {
      current: {
        scrollTop: 0,
        clientHeight: 480,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        scrollTo: vi.fn(),
      } as unknown as HTMLDivElement,
    };

    const { result } = renderHook(() =>
      useAnyTableVirtualizer({
        config: {
          rowHeight: 48,
          maxHeight: 480,
          overscan: 5,
        },
        totalCount: 100000,
        scrollContainerRef: mockContainer,
      })
    );

    expect(result.current.isVirtualized).toBe(true);
    expect(result.current.totalHeight).toBe(100000 * 48); // 4,800,000px
    expect(result.current.startIndex).toBe(0);
    // 480 / 48 = 10 visible rows + 5 overscan = endIndex 15
    expect(result.current.endIndex).toBe(15);
    expect(result.current.paddingTop).toBe(0);
    expect(result.current.paddingBottom).toBe((100000 - 1 - 15) * 48);

    const testArray = Array.from({ length: 100000 }, (_, i) => ({ id: i, name: `Row ${i}` }));
    const sliced = result.current.sliceRows(testArray);
    expect(sliced.length).toBe(16);
    expect(sliced[0].id).toBe(0);
    expect(sliced[15].id).toBe(15);
  });

  it("renders only windowed rows in DOM instead of 10,000 rows", () => {
    const dataset = Array.from({ length: 10000 }, (_, i) => ({
      id: `item-${i}`,
      name: `User ${i}`,
      department: i % 2 === 0 ? "Engineering" : "Marketing",
    }));

    const { container } = render(
      <AnyTable
        data={dataset}
        columns={[
          { key: "id", title: "ID" },
          { key: "name", title: "Name" },
          { key: "department", title: "Department" },
        ]}
        virtualized={{
          rowHeight: 50,
          maxHeight: 500,
          overscan: 5,
        }}
      />
    );

    // Initial visible items in DOM:
    // With rowHeight 50 and maxHeight 500, visibleCount = 10, overscan = 5.
    // So around 16 rows rendered instead of 10,000!
    const renderedBodyRows = container.querySelectorAll("tbody tr:not([aria-hidden='true'])");
    expect(renderedBodyRows.length).toBeLessThan(30);
    expect(renderedBodyRows.length).toBeGreaterThan(5);

    // User 0 is visible in DOM
    expect(screen.getByText("User 0")).toBeInTheDocument();

    // Deep row like User 5000 is NOT in DOM
    expect(screen.queryByText("User 5000")).not.toBeInTheDocument();

    // Spacer row for virtualization is present in the DOM
    const spacerRows = container.querySelectorAll("tbody tr[aria-hidden='true']");
    expect(spacerRows.length).toBeGreaterThanOrEqual(1);
  });

  it("supports scrollToIndex on tableRef instance", () => {
    const dataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      title: `Task #${i}`,
    }));

    const tableRef = createRef<TableInstance<any>>();

    const { container } = render(
      <AnyTable
        tableRef={tableRef}
        data={dataset}
        columns={[{ key: "title", title: "Title" }]}
        virtualized={{
          rowHeight: 40,
          maxHeight: 400,
        }}
      />
    );

    expect(tableRef.current).toBeDefined();
    expect(typeof tableRef.current?.scrollToIndex).toBe("function");

    // Find the scrollable wrapper (parent of table)
    const tableEl = container.querySelector("table");
    expect(tableEl).toBeDefined();
    const scrollContainer = tableEl?.parentElement as HTMLElement;
    expect(scrollContainer).toBeDefined();

    // Mock scrollTo on scrollContainer
    const scrollToMock = vi.fn();
    scrollContainer.scrollTo = scrollToMock;

    act(() => {
      tableRef.current?.scrollToIndex?.(200, "start");
    });

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 200 * 40, // 8000
      behavior: "smooth",
    });
  });

  it("handles boolean virtualized={true} with default settings", () => {
    const dataset = Array.from({ length: 500 }, (_, i) => ({
      id: i,
      name: `Person ${i}`,
    }));

    const { container } = render(
      <AnyTable
        data={dataset}
        columns={[{ key: "name", title: "Name" }]}
        virtualized={true}
      />
    );

    const rows = container.querySelectorAll("tbody tr:not([aria-hidden='true'])");
    expect(rows.length).toBeLessThan(100);
    expect(screen.getByText("Person 0")).toBeInTheDocument();
  });

  it("handles 100,000 items smoothly without crashing or mounting thousands of DOM nodes", () => {
    const hugeDataset = Array.from({ length: 100000 }, (_, i) => ({
      id: i,
      name: `Employee #${i}`,
      role: i % 3 === 0 ? "Engineer" : "Designer",
    }));

    const start = performance.now();
    const { container } = render(
      <AnyTable
        data={hugeDataset}
        columns={[
          { key: "id", title: "ID" },
          { key: "name", title: "Employee Name" },
          { key: "role", title: "Role" },
        ]}
        virtualized={{
          rowHeight: 48,
          maxHeight: 480,
          overscan: 10,
        }}
      />
    );
    const duration = performance.now() - start;

    // Must render within reasonable time (e.g. < 500ms)
    expect(duration).toBeLessThan(500);

    // Verify DOM node count is strictly capped (e.g. visible rows around 30, not 100,000)
    const domRows = container.querySelectorAll("tbody tr:not([aria-hidden='true'])");
    expect(domRows.length).toBeLessThan(50);
    expect(screen.getByText("Employee #0")).toBeInTheDocument();
  });

  it("preserves sorting correctly when virtualized", async () => {
    const dataset = [
      { id: 1, name: "Zara", score: 90 },
      { id: 2, name: "Alice", score: 10 },
      { id: 3, name: "Bob", score: 50 },
    ];

    const { container } = render(
      <AnyTable
        data={dataset}
        columns={[
          { key: "name", title: "Name" },
          { key: "score", title: "Score" },
        ]}
        virtualized={{ rowHeight: 40, maxHeight: 200 }}
      />
    );

    // Initial order: Zara is first
    const rowsInitial = container.querySelectorAll("tbody tr:not([aria-hidden='true'])");
    expect(rowsInitial[0]).toHaveTextContent("Zara");

    // Click "Name" header to sort ASC
    const nameHeader = screen.getByText("Name");
    await act(async () => {
      nameHeader.click();
    });

    // Now Alice must be first
    const rowsSorted = container.querySelectorAll("tbody tr:not([aria-hidden='true'])");
    expect(rowsSorted[0]).toHaveTextContent("Alice");
  });
});
