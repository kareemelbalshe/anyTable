import { ApiConfig, ApiFetcherParams, NormalizedApiResponse } from "../types/api.types";
import { getNestedValue } from "./objectUtils";
import { extractPaginationMeta } from "./paginationAdapter";

/**
 * Known common data array keys in REST API payloads
 */
const DATA_CANDIDATE_KEYS = [
  "data",
  "items",
  "results",
  "rows",
  "records",
  "list",
  "payload",
  "content",
  "users",
  "orders",
  "products",
  "drivers",
  "merchants",
  "reports",
  "transactions",
  "withdrawals",
  "coupons",
  "subscriptions",
  "deadLetters.items",
];

export function normalizeApiResponse<TData = any>(
  rawResponse: any,
  config?: ApiConfig<TData>,
  fallbackParams?: ApiFetcherParams
): NormalizedApiResponse<TData> {
  const page = fallbackParams?.page || 1;
  const pageSize = fallbackParams?.pageSize || 10;

  // Level 3: Developer provided explicit transformer function
  if (config?.transformResponse && typeof config.transformResponse === "function") {
    const transformed = config.transformResponse(rawResponse);
    if (Array.isArray(transformed)) {
      return {
        data: transformed,
        meta: extractPaginationMeta(rawResponse, config.response, page, pageSize, transformed.length),
        raw: rawResponse,
      };
    }
    if (transformed && typeof transformed === "object") {
      const data = Array.isArray(transformed.data) ? transformed.data : [];
      const meta = transformed.meta
        ? {
            total: transformed.meta.total !== undefined ? transformed.meta.total : data.length,
            page: transformed.meta.page !== undefined ? transformed.meta.page : page,
            pageSize: transformed.meta.pageSize !== undefined ? transformed.meta.pageSize : pageSize,
            totalPages:
              transformed.meta.totalPages !== undefined
                ? transformed.meta.totalPages
                : Math.max(1, Math.ceil((transformed.meta.total || data.length) / (transformed.meta.pageSize || pageSize))),
          }
        : extractPaginationMeta(rawResponse, config.response, page, pageSize, data.length);

      return { data, meta, raw: rawResponse };
    }
  }

  // If the raw response is directly an array
  if (Array.isArray(rawResponse)) {
    return {
      data: rawResponse as TData[],
      meta: {
        total: rawResponse.length,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(rawResponse.length / pageSize)),
        hasNextPage: page * pageSize < rawResponse.length,
        hasPrevPage: page > 1,
      },
      raw: rawResponse,
    };
  }

  // Level 2: Developer provided explicit response paths
  if (config?.response?.dataPath) {
    const extractedData = getNestedValue(rawResponse, config.response.dataPath);
    const data = Array.isArray(extractedData) ? (extractedData as TData[]) : [];
    const meta = extractPaginationMeta(rawResponse, config.response, page, pageSize, data.length);
    return { data, meta, raw: rawResponse };
  }

  // Level 1: Automatic smart detection
  if (rawResponse && typeof rawResponse === "object") {
    // 1. Check direct keys
    for (const key of DATA_CANDIDATE_KEYS) {
      const candidate = getNestedValue(rawResponse, key);
      if (Array.isArray(candidate)) {
        const meta = extractPaginationMeta(rawResponse, config?.response, page, pageSize, candidate.length);
        return {
          data: candidate as TData[],
          meta,
          raw: rawResponse,
        };
      }
    }

    // 2. Check if there's any property on rawResponse that is an array
    for (const prop in rawResponse) {
      if (Array.isArray(rawResponse[prop])) {
        const meta = extractPaginationMeta(rawResponse, config?.response, page, pageSize, rawResponse[prop].length);
        return {
          data: rawResponse[prop] as TData[],
          meta,
          raw: rawResponse,
        };
      }
    }

    // 3. If rawResponse is a single object (e.g. GET /user/:id)
    if (Object.keys(rawResponse).length > 0 && !Array.isArray(rawResponse)) {
      // Check if it's a wrapper with a single item
      const singleItem = rawResponse.user || rawResponse.order || rawResponse.item || rawResponse.data || rawResponse;
      if (singleItem && typeof singleItem === "object" && !Array.isArray(singleItem)) {
        return {
          data: [singleItem as TData],
          meta: {
            total: 1,
            page: 1,
            pageSize,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
          raw: rawResponse,
        };
      }
    }
  }

  // Fallback safe return for null/undefined/empty
  return {
    data: [],
    meta: {
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    raw: rawResponse,
  };
}
