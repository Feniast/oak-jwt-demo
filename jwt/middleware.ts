import { JwtMiddlewareOptions, TokenResolver, Secret } from "../types.ts";
import { Middleware, validateJwt, JwtObject } from "../deps.ts";
import { resolveAuthorizationHeader } from "./resolver.ts";
import { getSecret } from "./getSecret.ts";

export const jwt = (opts: JwtMiddlewareOptions) : Middleware => {
  const { getToken, secret: optSecret, passthrough = false, key = 'user', tokenKey, isRevoked, debug = false, when } = opts;

  const resolvers: TokenResolver[] = [resolveAuthorizationHeader];
  if (getToken) {
    resolvers.unshift(getToken);
  }

  return async (context, next) => {
    if (when && !when(context)) {
      return next();
    }
    let token : string | null = null;
    resolvers.find(resolver => {
      token = resolver(context);
      return token;
    });

    if (!token) {
      if (!passthrough) {
        context.throw(401, debug ? 'token not found' : 'Authentication Error');
      } else {
        return next();
      }
    }

    token = token!;
    let secret : Secret = context.state.secret || optSecret;
    try {
      if (typeof secret === 'function') {
        secret = getSecret(secret, token);
      }
      if (!secret) {
        throw new Error('Secret not provided');
      }
      let secrets = Array.isArray(secret) ? secret : [secret];
      let decodedToken: JwtObject | null = null;
      for (let s of secrets) {
        decodedToken = await validateJwt(token, s, { isThrowing: false });
        if (decodedToken) break;
      }
      if (!decodedToken) {
        throw new Error('invalid token');
      }
      const revoked = isRevoked ? isRevoked(context, decodedToken, token) : false;
      if (revoked) {
        throw new Error('token revoked');
      }
      context.state[key] = decodedToken;
      if (tokenKey) {
        context.state[tokenKey] = token;
      }
    } catch (e) {
      if (!passthrough) {
        const msg = debug ? e.message : 'Authentication Error';
        context.throw(401, msg, {
          originalError: e
        });
      } else {
        context.state.jwtOriginalError = e;
      }
    }

    return next();
  }
}