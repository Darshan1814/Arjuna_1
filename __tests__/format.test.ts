// [stage-50] test(unit): create format test suite validating compact numbers, bytes, and time
import { describe, it, expect } from "vitest";
import {
  formatRelativeTime,
  formatCompactNumber,
  shortSha,
  truncateMessage,
  formatBytes,
} from "@/lib/format";

describe("formatRelativeTime", () => {
  it("formats recent timestamp as just now", () => {
    expect(formatRelativeTime(Date.now() - 1000)).toBe("just now");
  });

  it("formats minutes ago", () => {
    expect(formatRelativeTime(Date.now() - 5 * 60 * 1000)).toBe("5m ago");
  });

  it("formats hours ago", () => {
    expect(formatRelativeTime(Date.now() - 3 * 3600 * 1000)).toBe("3h ago");
  });

  it("formats days ago", () => {
    expect(formatRelativeTime(Date.now() - 4 * 24 * 3600 * 1000)).toBe("4d ago");
  });
});

describe("formatCompactNumber", () => {
  it("formats numbers < 1000 verbatim", () => {
    expect(formatCompactNumber(0)).toBe("0");
    expect(formatCompactNumber(999)).toBe("999");
  });

  it("formats thousands with k", () => {
    expect(formatCompactNumber(1000)).toBe("1.0k");
    expect(formatCompactNumber(45600)).toBe("45.6k");
  });

  it("formats millions with M", () => {
    expect(formatCompactNumber(1200000)).toBe("1.2M");
  });
});

describe("shortSha", () => {
  it("truncates SHA to 7 chars", () => {
    expect(shortSha("a1b2c3d4e5f67890")).toBe("a1b2c3d");
  });
});

describe("truncateMessage", () => {
  it("preserves short message", () => {
    expect(truncateMessage("feat: add button")).toBe("feat: add button");
  });

  it("takes first line only", () => {
    expect(truncateMessage("feat: line one\n\nMore details")).toBe("feat: line one");
  });

  it("truncates long message with ellipsis", () => {
    const long = "a".repeat(100);
    const result = truncateMessage(long, 20);
    expect(result).toHaveLength(20);
    expect(result.endsWith("…")).toBe(true);
  });
});

describe("formatBytes", () => {
  it("formats 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes, KB, MB", () => {
    expect(formatBytes(500)).toBe("500.0 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(1048576 * 5)).toBe("5.0 MB");
  });
});
