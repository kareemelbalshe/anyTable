import { ApiResponsePaths, PaginationMeta } from "../types/api.types";
import { getNestedValue } from "./objectUtils";

/**
 * Common keys used in REST APIs for total count
 */
const TOTAL_COUNT_CANDIDATE_PATHS = [
  "total",
  "totalCount",
  "count",
  "recordsTotal",
  "totalRecords",
  "totalItems",
  "meta.total",
  "meta.totalCount",
  "meta.count",
  "pagination.total",
  "pagination.totalCount",
  "pagination.count",
  "pageInfo.total",
  "pageInfo.totalCount",
  "paging.total",
];

/**
 * Common keys for current page number
 */
const PAGE_CANDIDATE_PATHS = [
  "page",
  "currentPage",
  "pageNumber",
  "current_page",
  "meta.page",
  "meta.currentPage",
  "pagination.page",
  "pagination.currentPage",
  "pageInfo.page",
];

/**
 * Common keys for page size / limit
 */
const PAGE_SIZE_CANDIDATE_PATHS = [
  "pageSize",
  "limit",
  "perPage",
  "per_page",
  "meta.pageSize",
  "meta.limit",
  "meta.perPage",
  "pagination.pageSize",
  "pagination.limit",
  "pagination.perPage",
];

/**
 * Common keys for total pages
 */
const TOTAL_PAGES_CANDIDATE_PATHS = [
  "totalPages",
  "pageCount",
  "lastPage",
  "last_page",
  "total_pages",
  "meta.totalPages",
  "meta.lastPage",
  "pagination.totalPages",
  "pagination.lastPage",
];

export function extractPaginationMeta(
  rawResponse: any,
  paths?: ApiResponsePaths,
  fallbackPage = 1,
  fallbackPageSize = 10,
  arrayLengthFallback?: number
): PaginationMeta {
  if (!rawResponse || typeof rawResponse !== "object") {
    const total = arrayLengthFallback !== undefined ? arrayLengthFallback : 0;
    return {
      page: fallbackPage,
      pageSize: fallbackPageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / Math.max(1, fallbackPageSize))),
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  // 1. Resolve Total
  let total: number | undefined;
  if (paths?.totalPath) {
    const val = getNestedValue(rawResponse, paths.totalPath);
    if (typeof val === "number") total = val;
    else if (typeof val === "string" && !isNaN(Number(val))) total = Number(val);
  }

  if (total === undefined) {
    for (const key of TOTAL_COUNT_CANDIDATE_PATHS) {
      const val = getNestedValue(rawResponse, key);
      if (typeof val === "number" && !isNaN(val)) {
        total = val;
        break;
      }
      if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) {
        total = Number(val);
        break;
      }
    }
  }

  if (total === undefined) {
    total = arrayLengthFallback !== undefined ? arrayLengthFallback : 0;
  }

  // 2. Resolve Page
  let page: number | undefined;
  if (paths?.pagePath) {
    const val = getNestedValue(rawResponse, paths.pagePath);
    if (typeof val === "number") page = val;
    else if (typeof val === "string" && !isNaN(Number(val))) page = Number(val);
  }

  if (page === undefined) {
    for (const key of PAGE_CANDIDATE_PATHS) {
      const val = getNestedValue(rawResponse, key);
      if (typeof val === "number" && !isNaN(val)) {
        page = val;
        break;
      }
      if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) {
        page = Number(val);
        break;
      }
    }
  }

  if (page === undefined) {
    page = fallbackPage;
  }

  // 3. Resolve Page Size
  let pageSize: number | undefined;
  if (paths?.pageSizePath) {
    const val = getNestedValue(rawResponse, paths.pageSizePath);
    if (typeof val === "number") pageSize = val;
    else if (typeof val === "string" && !isNaN(Number(val))) pageSize = Number(val);
  }

  if (pageSize === undefined) {
    for (const key of PAGE_SIZE_CANDIDATE_PATHS) {
      const val = getNestedValue(rawResponse, key);
      if (typeof val === "number" && !isNaN(val)) {
        pageSize = val;
        break;
      }
      if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) {
        pageSize = Number(val);
        break;
      }
    }
  }

  if (pageSize === undefined) {
    pageSize = fallbackPageSize;
  }

  // 4. Resolve Total Pages
  let totalPages: number | undefined;
  if (paths?.totalPagesPath) {
    const val = getNestedValue(rawResponse, paths.totalPagesPath);
    if (typeof val === "number") totalPages = val;
    else if (typeof val === "string" && !isNaN(Number(val))) totalPages = Number(val);
  }

  if (totalPages === undefined) {
    for (const key of TOTAL_PAGES_CANDIDATE_PATHS) {
      const val = getNestedValue(rawResponse, key);
      if (typeof val === "number" && !isNaN(val)) {
        totalPages = val;
        break;
      }
    }
  }

  if (totalPages === undefined || totalPages <= 0) {
    totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  }

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
