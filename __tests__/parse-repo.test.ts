// [stage-49] test(unit): create parse-repo test suite verifying URL patterns and edge cases
import { describe, it, expect } from "vitest";
import { parseRepoInput } from "@/lib/parse-repo";

describe("parseRepoInput", () => {
  it("parses owner/repo shorthand", () => {
    const result = parseRepoInput("vercel/next.js");
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("parses full HTTPS GitHub URL", () => {
    const result = parseRepoInput("https://github.com/facebook/react");
    expect(result).toEqual({ owner: "facebook", repo: "react" });
  });

  it("parses URL with trailing slash", () => {
    const result = parseRepoInput("https://github.com/facebook/react/");
    expect(result).toEqual({ owner: "facebook", repo: "react" });
  });

  it("parses URL with .git suffix", () => {
    const result = parseRepoInput("https://github.com/facebook/react.git");
    expect(result).toEqual({ owner: "facebook", repo: "react" });
  });

  it("returns null for non-github URLs", () => {
    expect(parseRepoInput("https://gitlab.com/owner/repo")).toBeNull();
    expect(parseRepoInput("https://example.com")).toBeNull();
  });

  it("returns null for empty strings or invalid inputs", () => {
    expect(parseRepoInput("")).toBeNull();
    expect(parseRepoInput("   ")).toBeNull();
    expect(parseRepoInput("just-a-name")).toBeNull();
    expect(parseRepoInput("too/many/segments/here")).toBeNull();
  });

  it("rejects invalid characters (ReDoS safe)", () => {
    expect(parseRepoInput("bad<script>/repo")).toBeNull();
    expect(parseRepoInput("owner/bad;rm -rf")).toBeNull();
  });
});
