'use server';

import {
  IMAGE_UPLOAD_MAX_SIZE,
} from '@/src/lib/constants';
import { verifyLoginSession } from '@/src/lib/login/manage-login';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import sharp from 'sharp';

const MAX_IMAGE_PIXELS = 20_000_000;
const MAX_PROCESSED_IMAGE_SIZE = 4 * 1024 * 1024;
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

  const isAuthenticated = await verifyLoginSession();

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

  const fileName = `${randomUUID()}.webp`;
  const uploadDirectoryName = process.env.IMAGE_UPLOAD_DIRECTORY || 'uploads';
  if (!/^[a-zA-Z0-9_-]+$/.test(uploadDirectoryName)) {
    return makeResult({ error: 'Diretório de upload inválido' });
  }

  const uploadDirectory = resolve(
    process.cwd(),
    'public',
    uploadDirectoryName,
  );

  try {
    const processedImage = await sharp(inputBuffer, {
      failOn: 'error',
      limitInputPixels: MAX_IMAGE_PIXELS,
    })
      .rotate()
      .webp({ quality: 82 })
      .toBuffer();

    if (processedImage.length > MAX_PROCESSED_IMAGE_SIZE) {
      return makeResult({ error: 'Imagem processada muito grande' });
    }

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(resolve(uploadDirectory, fileName), processedImage, {
      flag: 'wx',
    });
  } catch (error) {
    console.error('Falha ao processar ou salvar imagem enviada', error);
    return makeResult({ error: 'Falha ao processar a imagem' });
  }

  return makeResult({ url: `/${uploadDirectoryName}/${fileName}` });
}
