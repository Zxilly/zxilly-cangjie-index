import { describe, expect, it, vi } from "vitest";
import {
  fetchGitHubStarCount,
  getGitCodeStarsBadgeUrl,
  getGitHubStarsApiUrl,
  parseGitHubRepository,
} from "./stars";

describe("project Stars", () => {
  it("parses GitHub repository URLs", () => {
    expect(parseGitHubRepository("https://github.com/Zxilly/cjv.git")).toEqual({
      owner: "Zxilly",
      name: "cjv",
    });
    expect(parseGitHubRepository("https://gitcode.com/Zxilly/cjv")).toBeNull();
  });

  it("builds provider URLs", () => {
    expect(getGitHubStarsApiUrl("https://github.com/Zxilly/cjv")).toBe(
      "https://api.github.com/repos/Zxilly/cjv",
    );
    expect(
      getGitCodeStarsBadgeUrl(
        "https://gitcode.com/Zxilly/test_cj_ffi/",
        3_600_000,
      ),
    ).toBe("https://gitcode.com/Zxilly/test_cj_ffi/star/badge.svg?v=1");
  });

  it("fetches the current GitHub Star count", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ stargazers_count: 13 }), {
        status: 200,
      }),
    );

    await expect(
      fetchGitHubStarCount("https://github.com/Zxilly/cjv", request),
    ).resolves.toBe(13);
    expect(request).toHaveBeenCalledWith(
      "https://api.github.com/repos/Zxilly/cjv",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("rejects malformed provider responses", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response(JSON.stringify({ stargazers_count: -1 }), { status: 200 }),
      );

    await expect(
      fetchGitHubStarCount("https://github.com/Zxilly/cjv", request),
    ).rejects.toThrow("invalid Star count");
  });
});
