import { DataType } from "../types/column.types";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".avif"];
const IMAGE_KEYWORDS = ["image", "avatar", "photo", "logo", "picture", "thumbnail", "banner", "img", "icon"];
const CURRENCY_KEYWORDS = ["price", "spend", "cost", "amount", "total", "fee", "rate", "salary", "balance", "deposit", "commission", "charge"];
const STATUS_KEYWORDS = ["status", "state", "phase", "condition"];

/**
 * Detects the semantic DataType of a property based on its key name and sample values.
 */
export function inferColumnType(key: string, sampleValues: any[]): DataType {
  const lowerKey = key.toLowerCase();

  // 1. Check Key Name Heuristics for Images
  if (IMAGE_KEYWORDS.some((kw) => lowerKey.includes(kw))) {
    return "image";
  }

  // 2. Check Key Name Heuristics for Currencies
  if (CURRENCY_KEYWORDS.some((kw) => lowerKey.includes(kw))) {
    return "currency";
  }

  // 3. Check Key Name Heuristics for Statuses
  if (STATUS_KEYWORDS.some((kw) => lowerKey.includes(kw))) {
    return "status";
  }

  // Filter out null/undefined for value inspection
  const nonNullValues = sampleValues.filter((v) => v !== null && v !== undefined && v !== "");

  if (nonNullValues.length === 0) {
    return "string";
  }

  const sample = nonNullValues[0];

  // 4. Booleans
  if (typeof sample === "boolean" || lowerKey.startsWith("is") || lowerKey.startsWith("has")) {
    return "boolean";
  }

  // 5. Arrays
  if (Array.isArray(sample)) {
    return "array";
  }

  // 6. Objects
  if (typeof sample === "object") {
    // Check if it's an image object { url: string }
    if (sample.url && typeof sample.url === "string" && isImageUrl(sample.url)) {
      return "image";
    }
    return "object";
  }

  // 7. Numbers
  if (typeof sample === "number") {
    return "number";
  }

  // 8. String Inspections
  if (typeof sample === "string") {
    const trimmed = sample.trim();

    // Check if image URL or base64
    if (isImageUrl(trimmed)) {
      return "image";
    }

    // Check if ISO Date string
    if (isIsoDate(trimmed) || lowerKey.includes("date") || lowerKey.includes("at") || lowerKey.includes("time")) {
      if (!isNaN(Date.parse(trimmed))) {
        return trimmed.includes("T") || trimmed.includes(":") ? "datetime" : "date";
      }
    }

    // Check email
    if (trimmed.includes("@") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "email";
    }

    // Check URL
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return "url";
    }

    // Check Phone
    if (lowerKey.includes("phone") || lowerKey.includes("mobile") || lowerKey.includes("tel")) {
      return "phone";
    }
  }

  return "string";
}

export function isImageUrl(val: string): boolean {
  if (!val || typeof val !== "string") return false;
  if (val.startsWith("data:image/")) return true;
  const lower = val.toLowerCase().split("?")[0];
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function isIsoDate(val: string): boolean {
  if (!val || typeof val !== "string" || val.length < 10) return false;
  return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/.test(val);
}
