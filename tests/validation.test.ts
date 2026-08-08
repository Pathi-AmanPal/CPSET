import { describe, expect, it } from "vitest";
import { achievementSchema, eventSchema, teamSchema } from "@/lib/validation";
describe("content validation", () => {
  it("rejects malformed, overlong, and control-character content", () => {
    expect(teamSchema.safeParse({ name: "A\u0000B", role: "Lead", bio: "x" }).success).toBe(false);
    expect(teamSchema.safeParse({ name: "a".repeat(121), role: "Lead", bio: "x" }).success).toBe(false);
    expect(eventSchema.safeParse({ title: "Event", description: "x", eventDate: "not-a-date", location: "Lab" }).success).toBe(false);
    expect(achievementSchema.safeParse({ title: "Win", description: "x", achievedAt: new Date().toISOString() }).success).toBe(true);
  });
});
