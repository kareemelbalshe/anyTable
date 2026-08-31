/**
 * Safely extracts a value from a nested object using a dot-notation or bracket-notation path.
 * Examples: 'user.name.en', 'orders[0].price', 'address.city'
 */
export function getNestedValue(obj: any, path?: string | null, defaultValue: any = undefined): any {
  if (obj === null || obj === undefined) return defaultValue;
  if (!path || typeof path !== "string") return obj;

  // Handle direct property match first for performance
  if (path in obj && obj[path] !== undefined) {
    return obj[path];
  }

  // Normalize bracket notation to dots: user.addresses[0].city -> user.addresses.0.city
  const normalizedPath = path.replace(/\[(\w+)\]/g, ".$1");
  const keys = normalizedPath.split(".");

  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Checks if a value is a non-null object (and not an array).
 */
export function isPlainObject(value: any): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Converts a string in camelCase, snake_case, or kebab-case into a human-readable Title Case.
 * Examples:
 * - 'createdAt' -> 'Created At'
 * - 'first_name' -> 'First Name'
 * - 'user.name.en' -> 'User Name En'
 * - 'isBanned' -> 'Is Banned'
 */
export function toTitleCase(key: string): string {
  if (!key || typeof key !== "string") return "";

  // Replace dots, underscores, dashes with spaces
  let text = key.replace(/[._\-]+/g, " ");

  // Insert space before uppercase letters in camelCase (e.g. 'createdAt' -> 'created At')
  text = text.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Title case each word
  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      // Keep acronyms uppercase if they were already uppercase (like ID, URL, IP)
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}
