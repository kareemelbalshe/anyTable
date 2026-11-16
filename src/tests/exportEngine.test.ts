import { describe, it, expect, vi } from "vitest";
import {
  escapeCsvValue,
  generateCsvContent,
  exportToCsv,
  exportToJson,
} from "../export/exportEngine";

describe("Export Engine (Zero-Dependency)", () => {
  it("escapes CSV values with commas, quotes, and newlines properly", () => {
    expect(escapeCsvValue("Normal Text")).toBe("Normal Text");
    expect(escapeCsvValue("Hello, World")).toBe('"Hello, World"');
    expect(escapeCsvValue('Said "Hi"')).toBe('"Said ""Hi"""');
    expect(escapeCsvValue("Line 1\nLine 2")).toBe('"Line 1\nLine 2"');
    expect(escapeCsvValue(null)).toBe("");
    expect(escapeCsvValue(undefined)).toBe("");
    expect(escapeCsvValue(1234)).toBe("1234");
  });

  it("generates CSV content with UTF-8 BOM for Arabic and international characters", () => {
    const data = [
      { id: 1, name: "كريم البلشي", role: "Frontend Lead", salary: 50000 },
      { id: 2, name: 'John "The Boss" Doe', role: "CTO, Co-Founder", salary: 80000 },
    ];

    const columns = [
      { key: "id", title: "ID" },
      { key: "name", title: "الاسم" },
      { key: "role", title: "Role" },
      { key: "salary", title: "Salary" },
    ];

    const csv = generateCsvContent(data, columns);

    // Verify UTF-8 BOM is prepended (\uFEFF)
    expect(csv.startsWith("\uFEFF")).toBe(true);

    // Verify headers row
    expect(csv).toContain('ID,الاسم,Role,Salary');

    // Verify data rows & escaped values
    expect(csv).toContain("كريم البلشي");
    expect(csv).toContain('"John ""The Boss"" Doe"');
    expect(csv).toContain('"CTO, Co-Founder"');
  });

  it("triggers download without crashing in node/test environment", () => {
    const data = [{ id: 1, name: "Test User" }];
    const columns = [{ key: "id", title: "ID" }, { key: "name", title: "Name" }];

    // Should run smoothly without throwing
    expect(() => exportToCsv(data, columns, "test.csv")).not.toThrow();
    expect(() => exportToJson(data, "test.json")).not.toThrow();
  });

  it("respects exportFormatter and exportable: false in column definitions", () => {
    const data = [
      { id: 1, name: "Kareem", internalSecret: "xyz123", amount: 1500 },
      { id: 2, name: "Sara", internalSecret: "abc789", amount: 2800 },
    ];

    const columns = [
      { key: "id", title: "ID" },
      { key: "name", title: "Name" },
      { key: "internalSecret", title: "Secret", exportable: false },
      {
        key: "amount",
        title: "Amount",
        exportFormatter: (val: number) => `$${val.toLocaleString()}`,
      },
    ];

    const csv = generateCsvContent(data, columns);

    expect(csv).not.toContain("Secret");
    expect(csv).not.toContain("xyz123");
    expect(csv).toContain("$1,500");
    expect(csv).toContain("$2,800");
  });
});
