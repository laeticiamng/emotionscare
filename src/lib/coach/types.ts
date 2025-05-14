
export interface CoachMessage {
  id: string;
  conversation_id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export type CoachEvent = {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
};
