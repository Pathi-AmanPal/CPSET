import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";
describe("rate limiter", () => {
  it("rejects the sixth login attempt inside a window", () => {
    const key = `test-${crypto.randomUUID()}`;
    for (let i = 0; i < 5; i++) expect(rateLimit(key, 5, 60_000).allowed).toBe(true);
    expect(rateLimit(key, 5, 60_000).allowed).toBe(false);
  });
});
