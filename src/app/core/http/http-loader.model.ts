export const HttpLoaderScope = {
  App: 'app',
  Section: 'section',
  Session: 'session',
} as const;

export type HttpLoaderScope = (typeof HttpLoaderScope)[keyof typeof HttpLoaderScope];

export type HttpSectionLoaderScope = `${typeof HttpLoaderScope.Section}:${string}`;

export function sectionLoaderScope(key: string): HttpSectionLoaderScope {
  return `${HttpLoaderScope.Section}:${key}`;
}

export interface HttpRequestOptions {
  readonly loader?: boolean | HttpLoaderScope | HttpSectionLoaderScope;
}
