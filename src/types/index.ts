import type {
  User,
  Resource,
  Tag,
  Comment,
  Vote,
  Bookmark,
  Flag,
} from "@prisma/client";

// Extended types with relations
export type ResourceWithRelations = Resource & {
  author: Pick<User, "id" | "name" | "image">;
  tags: { tag: Tag }[];
  _count: {
    votes: number;
    comments: number;
    bookmarks: number;
  };
  votes?: Vote[];
  bookmarks?: Bookmark[];
};

export type CommentWithRelations = Comment & {
  user: Pick<User, "id" | "name" | "image">;
  replies?: CommentWithRelations[];
};

export type UserProfile = Pick<
  User,
  "id" | "name" | "email" | "image" | "bio" | "role" | "tier" | "interests" | "createdAt"
>;

export type LeaderboardEntry = {
  id: string;
  name: string;
  image: string | null;
  approvedCount: number;
  avgQualityScore: number;
  totalUpvotes: number;
  score: number;
};

// API response types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;

// Form types
export type ResourceFormData = {
  title: string;
  description: string;
  url?: string;
  type: "LINK" | "PDF" | "ARTICLE" | "VIDEO";
  tags: string[];
};

// AI types
export type AISummary = {
  summary: string;
  tags: string[];
  qualityScore: number;
};

// Stats types
export type PlatformStats = {
  totalUsers: number;
  totalResources: number;
  pendingResources: number;
  flaggedContent: number;
  totalVotes: number;
  totalComments: number;
};

export type UserStats = {
  submittedResources: number;
  approvedResources: number;
  totalVotesReceived: number;
  totalBookmarks: number;
  totalComments: number;
};
