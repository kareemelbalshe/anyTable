import { describe, it, expect } from "vitest";
import { filterRowsBySearch } from "../adapters/searchAdapter";
import { sortRows } from "../adapters/sortAdapter";

describe("Client-Side Search & Sorting Engine", () => {
  const dataset = [
    { id: 1, name: "Ahmed Ali", age: 28, spend: 1200, joined: "2026-01-15" },
    { id: 2, name: "Sara Hassan", age: 24, spend: 3500, joined: "2026-03-20" },
    { id: 3, name: "Mohamed Omar", age: 35, spend: 800, joined: "2025-11-10" },
  ];

  it("Filters rows case-insensitively across all fields", () => {
    const results = filterRowsBySearch(dataset, "sara");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Sara Hassan");
  });

  it("Matches multiple tokens in query", () => {
    const results = filterRowsBySearch(dataset, "ahmed ali");
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);
  });

  it("Returns all rows when search is empty", () => {
    const results = filterRowsBySearch(dataset, "");
    expect(results).toHaveLength(3);
  });

  it("Sorts numbers ascending and descending", () => {
    const asc = sortRows(dataset, "spend", "asc");
    expect(asc[0].spend).toBe(800);
    expect(asc[2].spend).toBe(3500);

    const desc = sortRows(dataset, "spend", "desc");
    expect(desc[0].spend).toBe(3500);
    expect(desc[2].spend).toBe(800);
  });

  it("Sorts strings with natural alphabetical order", () => {
    const sorted = sortRows(dataset, "name", "asc");
    expect(sorted[0].name).toBe("Ahmed Ali");
    expect(sorted[1].name).toBe("Mohamed Omar");
    expect(sorted[2].name).toBe("Sara Hassan");
  });

  it("Sorts date strings chronologically", () => {
    const sorted = sortRows(dataset, "joined", "asc");
    expect(sorted[0].id).toBe(3); // 2025-11-10
    expect(sorted[2].id).toBe(2); // 2026-03-20
  });

  it("Does not mutate the original data array", () => {
    const originalCopy = [...dataset];
    sortRows(dataset, "spend", "desc");
    expect(dataset).toEqual(originalCopy);
  });
});
