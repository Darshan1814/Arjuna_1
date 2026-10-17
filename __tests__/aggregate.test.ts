import { describe, it, expect } from "vitest";
import {
  computeLanguagePercentages,
  bucketWeeklyToMonthly,
  getTopContributors,
  countFileFrequency,
  computeContributorShare,
} from "@/lib/aggregate";

describe("computeLanguagePercentages", () => {
  it("converts byte counts to rounded percentages descending", () => {
    const bytes = {
      TypeScript: 8000,
      JavaScript: 1500,
      CSS: 500,
    };
    const result = computeLanguagePercentages(bytes);
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe("TypeScript");
    expect(result[0].percentage).toBe(80);
    expect(result[1].name).toBe("JavaScript");
    expect(result[1].percentage).toBe(15);
    expect(result[2].name).toBe("CSS");
    expect(result[2].percentage).toBe(5);
  });

  it("handles empty record", () => {
    expect(computeLanguagePercentages({})).toEqual([]);
  });

  it("handles all zeros", () => {
    expect(computeLanguagePercentages({ TypeScript: 0 })).toEqual([]);
  });
});

describe("bucketWeeklyToMonthly", () => {
  it("buckets weekly timestamp totals into year-month totals", () => {
    // 2024-01-03 -> Jan 2024 (timestamp 1704240000)
    // 2024-01-10 -> Jan 2024 (timestamp 1704844800)
    // 2024-02-07 -> Feb 2024 (timestamp 1707264000)
    const weeks = [
      { week: 1704240000, total: 10 },
      { week: 1704844800, total: 20 },
      { week: 1707264000, total: 15 },
    ];
    const result = bucketWeeklyToMonthly(weeks);
    expect(result.length).toBeGreaterThanOrEqual(2);
    const jan = result.find((r) => r.month === "2024-01");
    expect(jan?.total).toBe(30);
    const feb = result.find((r) => r.month === "2024-02");
    expect(feb?.total).toBe(15);
  });
});

describe("getTopContributors", () => {
  it("sorts by totalCommits descending and slices to count", () => {
    const list = [
      { login: "alice", avatarUrl: "", totalCommits: 50, additions: 100, deletions: 10 },
      { login: "bob", avatarUrl: "", totalCommits: 200, additions: 500, deletions: 40 },
      { login: "charlie", avatarUrl: "", totalCommits: 100, additions: 200, deletions: 20 },
    ];
    const top = getTopContributors(list, 2);
    expect(top).toHaveLength(2);
    expect(top[0].login).toBe("bob");
    expect(top[1].login).toBe("charlie");
  });
});

describe("countFileFrequency", () => {
  it("counts occurrences and returns top files descending", () => {
    const files = [
      "src/index.ts",
      "package.json",
      "src/index.ts",
      "src/utils.ts",
      "src/index.ts",
      "package.json",
    ];
    const hot = countFileFrequency(files, 2);
    expect(hot).toHaveLength(2);
    expect(hot[0]).toEqual({ filename: "src/index.ts", changeCount: 3 });
    expect(hot[1]).toEqual({ filename: "package.json", changeCount: 2 });
  });
});

describe("computeContributorShare", () => {
  it("computes percentage share accurately", () => {
    const c = { login: "a", avatarUrl: "", totalCommits: 25, additions: 0, deletions: 0 };
    expect(computeContributorShare(c, 100)).toBe(25);
    expect(computeContributorShare(c, 0)).toBe(0);
  });
});
