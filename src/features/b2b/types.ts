/**
 * Types B2B centralisés
 */

export interface B2BTeam {
  id: string;
  name: string;
  description?: string;
  members: number;
  lead: string;
  leadEmail: string;
  avgWellness: number;
  status: 'active' | 'needs-attention' | 'inactive';
  lastActivity: string;
  createdAt: string;
}

export interface B2BTeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'lead' | 'member';
  email: string;
  displayName: string;
  joinedAt: string;
  lastActiveAt?: string;
}

export interface B2BEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  locationType: 'onsite' | 'remote' | 'hybrid';
  participants: number;
  maxParticipants: number;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: 'wellness' | 'training' | 'meditation' | 'team-building' | 'other';
  organizer: string;
  organizerId: string;
  createdAt: string;
}

export interface B2BEventRSVP {
  id: string;
  eventId: string;
  userId: string;
  status: 'confirmed' | 'maybe' | 'declined';
  respondedAt: string;
}

export interface B2BInvitation {
  id: string;
  email: string;
  teamId?: string;
  role: 'member' | 'admin';
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface B2BReport {
  id: string;
  period: string;
  title: string;
  narrative: string;
  metrics: {
    avgWellness: number;
    engagement: number;
    participation: number;
    alerts: number;
  };
  generatedAt: string;
  generatedBy: 'system' | 'admin';
}

export interface B2BAuditLog {
  id: string;
  action: string;
  entityType: 'team' | 'event' | 'member' | 'report' | 'settings';
  entityId: string;
  userId: string;
  userEmail: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface B2BOrganization {
  id: string;
  name: string;
  domain?: string;
  plan: 'starter' | 'business' | 'enterprise';
  maxMembers: number;
  currentMembers: number;
  createdAt: string;
}

// API Response types
export interface B2BApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface CreateTeamInput {
  name: string;
  description?: string;
  leadEmail?: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  locationType: 'onsite' | 'remote' | 'hybrid';
  maxParticipants: number;
  category: B2BEvent['category'];
}

export interface InviteMemberInput {
  email: string;
  teamId?: string;
  role: 'member' | 'admin';
  message?: string;
}
