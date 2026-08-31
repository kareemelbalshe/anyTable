import { ApiFetcherParams } from "../types/api.types";

/**
 * 🛍️ 1. Real Public API: DummyJSON Products API
 * Response shape: { products: [...], total: 194, skip: 0, limit: 10 }
 */
export async function fetchDummyJsonProducts(
  params: ApiFetcherParams,
  signal?: AbortSignal
): Promise<any> {
  const { page = 1, pageSize = 10, search = "" } = params;
  const skip = (page - 1) * pageSize;
  
  let url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`;
  if (search && search.trim()) {
    url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search.trim())}&limit=${pageSize}&skip=${skip}`;
  }

  if (params.sortBy) {
    url += `&sortBy=${params.sortBy}&order=${params.sortOrder || "asc"}`;
  }

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch products from DummyJSON`);
  }
  return response.json();
}

/**
 * 👥 2. Real Public API: DummyJSON Users API
 * Response shape: { users: [...], total: 208, skip: 0, limit: 10 }
 */
export async function fetchDummyJsonUsers(
  params: ApiFetcherParams,
  signal?: AbortSignal
): Promise<any> {
  const { page = 1, pageSize = 10, search = "" } = params;
  const skip = (page - 1) * pageSize;

  let url = `https://dummyjson.com/users?limit=${pageSize}&skip=${skip}`;
  if (search && search.trim()) {
    url = `https://dummyjson.com/users/search?q=${encodeURIComponent(search.trim())}&limit=${pageSize}&skip=${skip}`;
  }

  if (params.sortBy) {
    url += `&sortBy=${params.sortBy}&order=${params.sortOrder || "asc"}`;
  }

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch users from DummyJSON`);
  }
  return response.json();
}

/**
 * 🐙 3. Real Public API: GitHub Search Repositories API
 * Response shape: { total_count: 52000, items: [...] }
 */
export async function fetchGitHubRepositories(
  params: ApiFetcherParams,
  signal?: AbortSignal
): Promise<any> {
  const { page = 1, pageSize = 10, search = "react" } = params;
  const query = search && search.trim() ? search.trim() : "react stars:>1000";
  const sort = params.sortBy ? `&sort=${params.sortBy}&order=${params.sortOrder || "desc"}` : "&sort=stars&order=desc";

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${pageSize}${sort}`;

  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API Rate Limit reached. Please wait a minute or search another term.");
    }
    throw new Error(`GitHub API Error (${response.status})`);
  }

  return response.json();
}

/**
 * 🧪 4. Real Public API: Rick & Morty Characters API
 * Response shape: { info: { count: 826, pages: 42 }, results: [...] }
 */
export async function fetchRickAndMortyCharacters(
  params: ApiFetcherParams,
  signal?: AbortSignal
): Promise<any> {
  const { page = 1, search = "" } = params;
  let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
  if (search && search.trim()) {
    url += `&name=${encodeURIComponent(search.trim())}`;
  }

  const response = await fetch(url, { signal });
  if (!response.ok) {
    if (response.status === 404) {
      return { info: { count: 0, pages: 0 }, results: [] };
    }
    throw new Error(`Rick and Morty API Error (${response.status})`);
  }

  return response.json();
}
