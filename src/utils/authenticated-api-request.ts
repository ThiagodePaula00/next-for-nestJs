import 'server-only';

import { ApiRequest, apiRequest } from './api-request';
import { getLoginSessionForApi } from '../lib/login/manage-login';

export async function authenticatedApiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiRequest<T>> {
  const jwtToken = await getLoginSessionForApi();

  if (!jwtToken) {
    return {
      success: false,
      errors: ['Usuário não autenticado'],
      status: 401,
    };
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${jwtToken}`,
  };

  return apiRequest<T>(path, {
    ...options,
    headers,
  });
}