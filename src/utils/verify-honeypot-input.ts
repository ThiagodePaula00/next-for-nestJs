import { asyncDelay } from './async-delay';

export async function verifyHoneypotInput(
  formData: FormData,
  delay = 3000,
): Promise<boolean> {
  await asyncDelay(delay);

  const value = formData.get('dateUpdatedAt');

  return value === null || (typeof value === 'string' && value.trim() !== '');
}
