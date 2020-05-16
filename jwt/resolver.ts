import { Context } from '../deps.ts';
import { TokenResolver } from '../types.ts';

export const resolveAuthorizationHeader : TokenResolver = (ctx: Context) : string | null => {
  if (!ctx.request.headers) {
    return null;
  }
  const header = ctx.request.headers.get('Authorization');
  if (!header) return null;
  const matches = header.match(/^Bearer (.*)$/);
  if (!matches) return null;
  const [, value] = matches;
  return value;
}