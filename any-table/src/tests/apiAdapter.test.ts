import { describe, it, expect } from "vitest";
import { normalizeApiResponse } from "../adapters/apiAdapter";

describe("Smart API Adapter (3 Levels)", () => {
  it("Level 1: Auto-detects raw data arrays", () => {
    const raw = [
      { id: 1, name: "Ahmed" },
      { id: 2, name: "Mohamed" },
    ];
    const normalized = normalizeApiResponse(raw);

    expect(normalized.data).toHaveLength(2);
    expect(normalized.data[0].name).toBe("Ahmed");
    expect(normalized.meta.total).toBe(2);
  });

  it("Level 1: Auto-detects standard wrapped { data: [...], meta: { total: 50 } }", () => {
    const raw = {
      data: [{ id: 10, title: "Item 1" }],
      meta: {
        total: 50,
        page: 2,
        pageSize: 10,
      },
    };
    const normalized = normalizeApiResponse(raw);

    expect(normalized.data).toHaveLength(1);
    expect(normalized.meta.total).toBe(50);
    expect(normalized.meta.page).toBe(2);
  });

  it("Level 1: Auto-detects domain keys like { users: [...], totalCount: 100 }", () => {
    const raw = {
      users: [{ id: "u1", email: "user@test.com" }],
      totalCount: 100,
    };
    const normalized = normalizeApiResponse(raw);

    expect(normalized.data).toHaveLength(1);
    expect(normalized.meta.total).toBe(100);
  });

  it("Level 2: Respects explicit response path configuration", () => {
    const raw = {
      status: "ok",
      payload: {
        recordsList: [{ id: 99, value: "Custom" }],
        recordCounter: 42,
      },
    };
    const config = {
      fetcher: () => Promise.resolve(raw),
      response: {
        dataPath: "payload.recordsList",
        totalPath: "payload.recordCounter",
      },
    };

    const normalized = normalizeApiResponse(raw, config);
    expect(normalized.data).toHaveLength(1);
    expect(normalized.data[0].id).toBe(99);
    expect(normalized.meta.total).toBe(42);
  });

  it("Level 3: Executes custom transformResponse function", () => {
    const raw = {
      result: {
        customItems: [{ id: 500, label: "Transformed" }],
        customTotal: 777,
      },
    };
    const config = {
      fetcher: () => Promise.resolve(raw),
      transformResponse: (r: any) => ({
        data: r.result.customItems,
        meta: {
          total: r.result.customTotal,
          page: 1,
          pageSize: 10,
        },
      }),
    };

    const normalized = normalizeApiResponse(raw, config);
    expect(normalized.data).toHaveLength(1);
    expect(normalized.data[0].label).toBe("Transformed");
    expect(normalized.meta.total).toBe(777);
  });

  it("Safely handles null or undefined responses without throwing", () => {
    const normalizedNull = normalizeApiResponse(null);
    expect(normalizedNull.data).toEqual([]);
    expect(normalizedNull.meta.total).toBe(0);

    const normalizedUndefined = normalizeApiResponse(undefined);
    expect(normalizedUndefined.data).toEqual([]);
    expect(normalizedUndefined.meta.total).toBe(0);
  });
});
