import { Context, JwtObject } from './deps.ts';

export type Secret = string | string[];

export interface SecretProvider {
  (header: string, payload: string): Secret;
}

export interface TokenResolver {
  (ctx: Context): string | null;
}

export interface JwtMiddlewareOptions {
  secret: Secret | SecretProvider;
  isRevoked?: (ctx: Context, decodedToken: JwtObject, token: string) => boolean;
  passthrough?: boolean;
  tokenKey?: string;
  key?: string;
  getToken?: TokenResolver;
  debug?: boolean;
  when?: (ctx: Context) => boolean;
}
