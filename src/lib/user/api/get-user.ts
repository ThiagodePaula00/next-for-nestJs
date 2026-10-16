import { PublicUserSchema, type PublicUserDto } from '@/src/lib/user/schemas';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';

export async function getPublicUserFromApi(): Promise<PublicUserDto | undefined> {
  const userResponse = await authenticatedApiRequest<PublicUserDto>('/user/me', {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!userResponse.success) {
    return undefined;
  }

  const parsedUser = PublicUserSchema.safeParse(userResponse.data);
  return parsedUser.success ? parsedUser.data : undefined;
}
