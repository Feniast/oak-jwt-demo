import { parseAndDecode } from '../deps.ts';
import { SecretProvider } from '../types.ts';

export const getSecret = (provider: SecretProvider, token: string) : string | string[] => {
  const { header, payload } = parseAndDecode(token);
  if (!header || !payload) {
    throw new Error('Invalid token');
  }
  return provider(header as string, payload as string);
}