import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { sameOrigin } from "@/lib/api";

describe("same-origin mutation guard", () => {
  it("only accepts a matching browser origin", () => {
    const trusted = new NextRequest("https://cpset.example/api/team", { headers: { origin: "https://cpset.example" } });
    const attacker = new NextRequest("https://cpset.example/api/team", { headers: { origin: "https://attacker.example" } });
    expect(sameOrigin(trusted)).toBe(true);
    expect(sameOrigin(attacker)).toBe(false);
  });
});
