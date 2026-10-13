import { describe, it, expect } from "vitest";
import { resolveMessages, arMessages, enMessages } from "../i18n";
import { computePinnedStyles, parsePixelWidth } from "../columns/pinningUtils";

describe("i18n & Localization Engine", () => {
  it("resolves English messages by default", () => {
    const messages = resolveMessages("en");
    expect(messages.searchPlaceholder).toBe("Search records...");
    expect(messages.actions).toBe("Actions");
    expect(messages.retry).toBe("Retry Request");
  });

  it("resolves Arabic messages when locale is ar or ar-EG", () => {
    const messages = resolveMessages("ar-EG");
    expect(messages.searchPlaceholder).toBe("بحث في السجلات...");
    expect(messages.actions).toBe("الإجراءات");
    expect(messages.retry).toBe("إعادة المحاولة");
  });

  it("allows custom overrides on top of resolved messages", () => {
    const messages = resolveMessages("ar", {
      searchPlaceholder: "ابحث هنا يا صديقي...",
    });
    expect(messages.searchPlaceholder).toBe("ابحث هنا يا صديقي...");
    expect(messages.actions).toBe("الإجراءات");
  });
});

describe("Column Pinning Offsets Engine", () => {
  it("correctly parses pixel widths from numbers and strings", () => {
    expect(parsePixelWidth(200)).toBe(200);
    expect(parsePixelWidth("180px")).toBe(180);
    expect(parsePixelWidth("120")).toBe(120);
    expect(parsePixelWidth(undefined)).toBe(150);
  });

  it("calculates left and right pinned offsets with selection and actions", () => {
    const columns = [
      { key: "id", title: "ID", width: 80, pinned: "left" as const },
      { key: "name", title: "Name", width: 150 },
      { key: "status", title: "Status", width: 120, pinned: "right" as const },
    ];

    const styles = computePinnedStyles(columns, {
      selectable: true, // +44px for checkbox
      hasActions: true,
      actionsWidth: 100, // +100px for actions
    });

    // ID should be pinned left after the checkbox (44px)
    expect(styles["id"]).toEqual({
      position: "sticky",
      left: "44px",
      zIndex: 5,
    });

    // Status should be pinned right before the actions column (100px)
    expect(styles["status"]).toEqual({
      position: "sticky",
      right: "100px",
      zIndex: 5,
    });
  });

  it("flips left/right positioning when isRtl is true", () => {
    const columns = [
      { key: "id", title: "ID", width: 80, pinned: "left" as const },
    ];

    const styles = computePinnedStyles(columns, {
      selectable: false,
      isRtl: true,
    });

    expect(styles["id"]).toEqual({
      position: "sticky",
      right: "0px",
      zIndex: 5,
    });
  });
});
