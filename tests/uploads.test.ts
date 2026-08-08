import { describe, expect, it } from "vitest";
import { MAX_IMAGE_BYTES, normalizeImage } from "@/lib/uploads";

describe("image upload validation", () => {
  it("rejects oversized files before decoding", async () => {
    const file = new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "photo.jpg", { type: "image/jpeg" });
    await expect(normalizeImage(file)).rejects.toThrow("IMAGE_SIZE");
  });
  it("rejects non-image bytes regardless of filename and MIME type", async () => {
    const file = new File(["not an image"], "payload.jpg", { type: "image/jpeg" });
    await expect(normalizeImage(file)).rejects.toThrow("INVALID_IMAGE");
  });
});
