'use server';

import {
  IMAGE_UPLOAD_MAX_SIZE,
} from '@/src/lib/constants';
import { getLoginSessionForApi } from '@/src/lib/login/manage-login';
import { authenticatedApiRequest } from '@/src/utils/authenticated-api-request';
import sharp from 'sharp';

const MAX_IMAGE_PIXELS = 20_000_000;
const SUPPORTED_INPUT_FORMATS = new Set(['jpeg', 'png', 'webp']);

type UploadImageActionResult = {
  url: string;
  error: string;
};

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadImageActionResult> {
  const makeResult = (
    { url = '', error = '' }: Partial<UploadImageActionResult> = {},
  ): UploadImageActionResult => ({ url, error });

  const isAuthenticated = await getLoginSessionForApi();

  if (!isAuthenticated) {
    return makeResult({ error: 'Faça login novamente antes de enviar a imagem' });
  }

  if (!(formData instanceof FormData)) {
    return makeResult({ error: 'Dados inválidos' });
  }

  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return makeResult({ error: 'Arquivo inválido' });
  }

  if (file.size > IMAGE_UPLOAD_MAX_SIZE) {
    return makeResult({ error: 'Arquivo muito grande' });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  let inputFormat: string | undefined;

  try {
    const metadata = await sharp(inputBuffer, {
      failOn: 'error',
      limitInputPixels: MAX_IMAGE_PIXELS,
    }).metadata();

    inputFormat = metadata.format;
    if (
      !inputFormat ||
      !SUPPORTED_INPUT_FORMATS.has(inputFormat) ||
      (metadata.pages ?? 1) > 1
    ) {
      return makeResult({ error: 'Formato de imagem inválido' });
    }
  } catch {
    return makeResult({ error: 'Imagem inválida ou corrompida' });
  }

  const uploadFormData = new FormData();
  uploadFormData.append('file', file, file.name);

  const uploadResponse = await authenticatedApiRequest<{ url: string }>(
    '/upload',
    {
      method: 'POST',
      body: uploadFormData,
    },
  );

  if (!uploadResponse.success) {
    return makeResult({ error: uploadResponse.errors[0] });
  }

  if (
    typeof uploadResponse.data?.url !== 'string' ||
    uploadResponse.data.url.length === 0
  ) {
    return makeResult({ error: 'Resposta inválida do servidor de imagens' });
  }

  let url: string;
  try {
    const imageServerUrl =
      process.env.IMAGE_SERVER_URL ||
      process.env.API_URL ||
      'http://localhost:3001';
    url = new URL(uploadResponse.data.url, imageServerUrl).toString();
  } catch (error) {
    console.error('URL inválida retornada pelo servidor de imagens', error);
    return makeResult({ error: 'URL inválida retornada pelo servidor de imagens' });
  }

  return makeResult({ url });
}
