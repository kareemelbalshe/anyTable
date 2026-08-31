import { describe, it, expect } from "vitest";
import { generateAutoColumns } from "../columns/autoColumns";
import { toTitleCase } from "../adapters/objectUtils";
import { inferColumnType } from "../columns/typeDetector";

describe("Auto Column Generator & Type Detection", () => {
  it("Generates columns automatically from sample data", () => {
    const sampleData = [
      {
        id: 1,
        fullName: "Ahmed Ali",
        email: "ahmed@example.com",
        isActive: true,
        totalSpend: 1500.5,
        createdAt: "2026-08-29T12:00:00Z",
      },
    ];

    const columns = generateAutoColumns(sampleData);
    expect(columns.length).toBeGreaterThanOrEqual(5);

    const emailCol = columns.find((c) => c.key === "email");
    expect(emailCol).toBeDefined();
    expect(emailCol?.type).toBe("email");

    const activeCol = columns.find((c) => c.key === "isActive");
    expect(activeCol).toBeDefined();
    expect(activeCol?.type).toBe("boolean");

    const spendCol = columns.find((c) => c.key === "totalSpend");
    expect(spendCol).toBeDefined();
    expect(spendCol?.type).toBe("currency");
  });

  it("Transforms camelCase, snake_case, and nested paths to Title Case", () => {
    expect(toTitleCase("createdAt")).toBe("Created At");
    expect(toTitleCase("first_name")).toBe("First Name");
    expect(toTitleCase("user.address.city")).toBe("User Address City");
    expect(toTitleCase("isBanned")).toBe("Is Banned");
    expect(toTitleCase("orderId")).toBe("Order Id");
  });

  it("Infers semantic data types accurately", () => {
    expect(inferColumnType("avatar", ["https://site.com/photo.jpg"])).toBe("image");
    expect(inferColumnType("price", [199.99])).toBe("currency");
    expect(inferColumnType("createdAt", ["2026-08-29T10:00:00Z"])).toBe("datetime");
    expect(inferColumnType("email", ["dev@kareem.com"])).toBe("email");
    expect(inferColumnType("status", ["active"])).toBe("status");
    expect(inferColumnType("isActive", [true])).toBe("boolean");
  });

  it("Filters out ignored keys like password and __v", () => {
    const sampleData = [
      {
        id: 1,
        username: "kareem",
        password: "secret_hash_123",
        __v: 0,
      },
    ];
    const columns = generateAutoColumns(sampleData);
    const keys = columns.map((c) => c.key);
    expect(keys).not.toContain("password");
    expect(keys).not.toContain("__v");
    expect(keys).toContain("username");
  });
});
