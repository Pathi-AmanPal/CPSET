import { NextRequest, NextResponse } from "next/server";
import { authorizedMutation } from "@/lib/api";
import { apiError, serverError } from "@/lib/http";
import { storeImage } from "@/lib/uploads";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizedMutation(request);
    if ("error" in auth) return auth.error;
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return apiError("An image file is required", 400);
    const blob = await storeImage(file);
    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === "IMAGE_SIZE" || error.message === "INVALID_IMAGE")) return apiError("Invalid image", 400);
    return serverError(error);
  }
}
