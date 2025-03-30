type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type FetchAcceptedData = Record<string, string | number | boolean>;

type FetchOptions = {
  params?: FetchAcceptedData;
  body?: FetchAcceptedData;
} & Omit<RequestInit, 'body'>;

export type FetchResponse<T> = {
  data: T;
  headers: Headers;
};

class FetchWrapper {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string, headers: HeadersInit = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  public get<T>(
    url: string,
    options?: FetchOptions
  ): Promise<FetchResponse<T>> {
    return this.request<T>(url, 'GET', options);
  }

  public post<T>(
    url: string,
    options?: FetchOptions
  ): Promise<FetchResponse<T>> {
    return this.request<T>(url, 'POST', options);
  }

  public put<T>(
    url: string,
    options?: FetchOptions
  ): Promise<FetchResponse<T>> {
    return this.request<T>(url, 'PUT', options);
  }

  public delete<T>(
    url: string,
    options?: FetchOptions
  ): Promise<FetchResponse<T>> {
    return this.request<T>(url, 'DELETE', options);
  }

  public patch<T>(
    url: string,
    options?: FetchOptions
  ): Promise<FetchResponse<T>> {
    return this.request<T>(url, 'PATCH', options);
  }

  private async request<T>(
    url: string,
    method: RequestMethod,
    options?: FetchOptions
  ): Promise<FetchResponse<T>> {
    const { params, headers, body, ...restOptions } = options || {};

    const fullUrl = new URL(url, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        fullUrl.searchParams.append(key, String(value));
      });
    }

    const fetchOptions: RequestInit = {
      method,
      headers: { ...this.headers, ...headers },
      body: body ? JSON.stringify(body) : undefined,
      ...restOptions,
    };

    if (body) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      };
    }

    try {
      const response = await fetch(fullUrl.toString(), fetchOptions);

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, ${response.statusText}`
        );
      }

      const data = (await response.json()) as T;
      return { data, headers: response.headers };
    } catch (error) {
      throw new Error(`Fetch error: ${(error as Error).message}`);
    }
  }
}

export const fetchInstance = new FetchWrapper(
  import.meta.env.VITE_BACKEND_URL as string
);
