
// Types for invitation-related components
export * from './index';

export interface InvitationResponse {
  success: boolean;
  message: string;
  invitation?: Invitation;
}
