import { z } from "zod/v4";

/* ── Repo Input ── */
export const RepoInputSchema = z.object({
  owner: z.string().min(1).max(100),
  repo: z.string().min(1).max(100),
});
export type RepoInput = z.infer<typeof RepoInputSchema>;

/* ── Rate Limit Info ── */
export const RateLimitSchema = z.object({
  remaining: z.number(),
  limit: z.number(),
  resetAt: z.number(),
});
export type RateLimit = z.infer<typeof RateLimitSchema>;

/* ── Repo Metadata ── */
export const RepoMetadataSchema = z.object({
  fullName: z.string(),
  description: z.string().nullable(),
  stars: z.number(),
  forks: z.number(),
  watchers: z.number().optional(),
  openIssues: z.number(),
  license: z.string().nullable(),
  createdAt: z.string(),
  pushedAt: z.string(),
  defaultBranch: z.string(),
  htmlUrl: z.string(),
  ownerAvatarUrl: z.string(),
  latestRelease: z
    .object({
      tag: z.string(),
      name: z.string().nullable(),
      publishedAt: z.string(),
    })
    .nullable()
    .optional(),
});
export type RepoMetadata = z.infer<typeof RepoMetadataSchema>;

/* ── Languages ── */
export const LanguageEntrySchema = z.object({
  name: z.string(),
  bytes: z.number(),
  percentage: z.number(),
});
export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;

/* ── Commit Activity (weekly) ── */
export const WeeklyActivitySchema = z.object({
  week: z.number(),
  total: z.number(),
});
export type WeeklyActivity = z.infer<typeof WeeklyActivitySchema>;

/* ── Monthly Activity (bucketed) ── */
export const MonthlyActivitySchema = z.object({
  month: z.string(),
  total: z.number(),
});
export type MonthlyActivity = z.infer<typeof MonthlyActivitySchema>;

/* ── Contributor ── */
export const ContributorSchema = z.object({
  login: z.string(),
  avatarUrl: z.string(),
  totalCommits: z.number(),
  additions: z.number(),
  deletions: z.number(),
});
export type Contributor = z.infer<typeof ContributorSchema>;

/* ── Commit ── */
export const CommitSchema = z.object({
  sha: z.string(),
  message: z.string(),
  authorLogin: z.string().nullable(),
  authorAvatarUrl: z.string().nullable(),
  date: z.string(),
  htmlUrl: z.string(),
});
export type Commit = z.infer<typeof CommitSchema>;

/* ── Hot File ── */
export const HotFileSchema = z.object({
  filename: z.string(),
  changeCount: z.number(),
});
export type HotFile = z.infer<typeof HotFileSchema>;

/* ── API Response wrappers ── */
export const ComputingStatusSchema = z.object({
  status: z.literal("computing"),
});

export const RepoRouteResponseSchema = z.object({
  metadata: RepoMetadataSchema,
  languages: z.array(LanguageEntrySchema),
  rateLimit: RateLimitSchema.optional(),
});
export type RepoRouteResponse = z.infer<typeof RepoRouteResponseSchema>;

export const ActivityRouteResponseSchema = z.object({
  commitActivity: z.union([
    z.array(WeeklyActivitySchema),
    ComputingStatusSchema,
  ]),
  contributors: z.union([
    z.array(ContributorSchema),
    ComputingStatusSchema,
  ]),
  rateLimit: RateLimitSchema.optional(),
});
export type ActivityRouteResponse = z.infer<typeof ActivityRouteResponseSchema>;

export const CommitsRouteResponseSchema = z.object({
  commits: z.array(CommitSchema),
  hotFiles: z.union([
    z.array(HotFileSchema),
    z.object({ status: z.literal("skipped"), reason: z.string() }),
  ]),
  rateLimit: RateLimitSchema.optional(),
});
export type CommitsRouteResponse = z.infer<typeof CommitsRouteResponseSchema>;

export const SummaryRouteResponseSchema = z.object({
  summary: z.string(),
});
export type SummaryRouteResponse = z.infer<typeof SummaryRouteResponseSchema>;

/* ── API Error ── */
export const ApiErrorSchema = z.object({
  error: z.string(),
  resetAt: z.number().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
