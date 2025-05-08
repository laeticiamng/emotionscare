import { v4 as uuidv4 } from 'uuid';
import { InvitationFormData, InvitationStats } from '@/types/invitation';

// Mock invitation data
let mockInvitations = [
  {
    id: uuidv4(),
    email: 'johndoe@example.com',
    role: 'user',
    status: 'pending',
    token: uuidv4(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    email: 'janedoe@example.com',
    role: 'admin',
    status: 'accepted',
    token: uuidv4(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    accepted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    email: 'mark@example.com',
    role: 'user',
    status: 'expired',
    token: uuidv4(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const getInvitationsStats = async (): Promise<InvitationStats> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API delay
  
  return {
    total: mockInvitations.length,
    sent: mockInvitations.length,
    pending: mockInvitations.filter(inv => inv.status === 'pending').length,
    accepted: mockInvitations.filter(inv => inv.status === 'accepted').length,
    expired: mockInvitations.filter(inv => inv.status === 'expired').length
  };
};

export const createInvitation = async (invitationData: InvitationFormData): Promise<any> => {
  const now = new Date();
  const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  
  const newInvitation = {
    id: uuidv4(),
    email: invitationData.email,
    role: invitationData.role,
    status: 'pending',
    token: uuidv4(),
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + expiresIn).toISOString(),
  };
  
  mockInvitations.push(newInvitation);
  
  return { invitation: newInvitation };
};
