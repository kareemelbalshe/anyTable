export interface ApiFetcherParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface NormalizedApiResponse<TData = any> {
  data: TData[];
  meta: PaginationMeta;
  raw?: any;
}

export interface ApiResponsePaths {
  /**
   * Dot-notation path to extract data array from response (e.g. 'data', 'result.items', 'payload.users', 'records').
   */
  dataPath?: string;

  /**
   * Dot-notation path to extract total records count (e.g. 'total', 'meta.totalCount', 'pagination.total').
   */
  totalPath?: string;

  /**
   * Dot-notation path to extract current page number.
   */
  pagePath?: string;

  /**
   * Dot-notation path to extract page size / limit.
   */
  pageSizePath?: string;

  /**
   * Dot-notation path to extract total pages count.
   */
  totalPagesPath?: string;
}

export interface ApiParamNames {
  pageParam?: string; // default: 'page'
  pageSizeParam?: string; // default: 'limit' or 'pageSize'
  searchParam?: string; // default: 'search' or 'q'
  sortByParam?: string; // default: 'sortBy'
  sortOrderParam?: string; // default: 'sortOrder'
}

export interface ApiConfig<TData = any> {
  /**
   * Async function or Promise-returning fetcher.
   * Can be an Axios call, fetch wrapper, or Redux thunk dispatcher.
   */
  fetcher: (
    params: ApiFetcherParams,
    signal?: AbortSignal
  ) => Promise<any> | any;

  /**
   * Mode for API operations:
   * - 'server': Performs search, sorting, and pagination on the server via query parameters.
   * - 'client': Fetches data once, then performs search, sorting, and pagination client-side in memory.
   * - 'auto': Determines automatically based on response metadata.
   */
  mode?: "server" | "client" | "auto";

  /**
   * Level 2 Configuration: Explicit response path mapping.
   */
  response?: ApiResponsePaths;

  /**
   * Custom request parameter key names sent to the fetcher.
   */
  paramNames?: ApiParamNames;

  /**
   * Static or dynamic additional parameters merged into every API request.
   */
  params?: Record<string, any>;

  /**
   * Level 3 Configuration: Total control response transformer.
   */
  transformResponse?: (
    rawResponse: any
  ) =>
    | NormalizedApiResponse<TData>
    | { data: TData[]; meta?: Partial<PaginationMeta> }
    | TData[];

  /**
   * Callback invoked upon successful fetch.
   */
  onSuccess?: (response: NormalizedApiResponse<TData>) => void;

  /**
   * Callback invoked if fetcher fails.
   */
  onError?: (error: any) => void;

  /**
   * Debounce duration in milliseconds before firing search API requests. Defaults to 350ms.
   */
  debounce?: number;

  /**
   * Whether to fetch immediately upon table mount. Defaults to true.
   */
  immediate?: boolean;
}
