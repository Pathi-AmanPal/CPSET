// Types mirroring the Prisma schema's public-facing selects

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  achievedAt: string;
  imageUrl: string | null;
}

// Form input types (for create / update)

export interface TeamInput {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string | null;
}

export interface EventInput {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl?: string | null;
}

export interface AchievementInput {
  title: string;
  description: string;
  achievedAt: string;
  imageUrl?: string | null;
}

// Auth
export interface LoginInput {
  email: string;
  password: string;
  totp?: string;
}

export interface ApiError {
  error: string;
}

// Dashboard stats
export interface DashboardStats {
  teamCount: number;
  eventsCount: number;
  achievementsCount: number;
}
