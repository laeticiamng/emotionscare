import { InvitationStats } from '@/types';

// Simulate fetching invitation stats
export const fetchInvitationStats = async (): Promise<InvitationStats> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    total: 10,
    sent: 8,
    pending: 3,
    accepted: 4,
    expired: 1,
    rejected: 0, // Add this missing property
    teams: {}
  };
};

export const sendInvitations = async (invitations: any[]): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Invitations sent successfully',
    invitations
  };
};

export const verifyInvitation = async (token: string): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    valid: true,
    message: 'Invitation is valid',
    invitation: {
      id: '123',
      email: 'test@example.com',
      role: 'employee'
    }
  };
};

export const acceptInvitation = async (token: string): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Invitation accepted successfully'
  };
};
