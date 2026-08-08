import { z } from "zod";
const text = (max: number) => z.string().trim().min(1).max(max).refine(v => !/[\u0000-\u001F\u007F]/.test(v), "Contains control characters");
const imageUrl = z.string().url().max(2048).refine(v => /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(v), "Image must be a CPSET Blob URL").optional().nullable();
export const teamSchema = z.object({ name: text(120), role: text(120), bio: text(2000), imageUrl }).strict();
export const eventSchema = z.object({ title: text(160), description: text(4000), eventDate: z.string().datetime({ offset: true }), location: text(200), imageUrl }).strict();
export const achievementSchema = z.object({ title: text(160), description: text(4000), achievedAt: z.string().datetime({ offset: true }), imageUrl }).strict();
export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256), totp: z.string().regex(/^\d{6}$/).optional().or(z.literal("")) }).strict();
