import "server-only";
import sharp, { type Metadata } from "sharp";
import { put } from "@vercel/blob";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["jpeg", "png", "webp"]);

/** Verifies image structure with sharp and rewrites it as metadata-free WebP. */
export async function normalizeImage(file: File): Promise<Buffer> {
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) throw new Error("IMAGE_SIZE");
  const source = Buffer.from(await file.arrayBuffer());
  let metadata: Metadata;
  try { metadata = await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" }).metadata(); }
  catch { throw new Error("INVALID_IMAGE"); }
  if (!metadata.format || !ALLOWED.has(metadata.format)) throw new Error("INVALID_IMAGE");
  try { return await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" }).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toBuffer(); }
  catch { throw new Error("INVALID_IMAGE"); }
}

export async function storeImage(file: File) {
  const normalized = await normalizeImage(file);
  // addRandomSuffix makes the object name unguessable; no user filename is retained.
  return put("cpset-images/image.webp", new Blob([new Uint8Array(normalized)], { type: "image/webp" }), { access: "public", addRandomSuffix: true, contentType: "image/webp" });
}
