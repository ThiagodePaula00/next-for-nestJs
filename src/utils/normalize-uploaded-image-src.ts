const LEGACY_LOCAL_UPLOAD_PREFIX = 'http://localhost:3000/uploads/';

export function normalizeUploadedImageSrc(src: string): string {
  if (src.startsWith(LEGACY_LOCAL_UPLOAD_PREFIX)) {
    return src.slice('http://localhost:3000'.length);
  }

  return src;
}