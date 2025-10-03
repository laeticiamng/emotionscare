
// Basic implementations of the necessary functions

export const getCoachMessages = async () => {
  return [];
};

export const sendCoachMessage = async (message: string) => {
  console.log("Sending coach message:", message);
  return { id: "mock", content: "Response from coach" };
};

export interface CoachMessage {
  id: string;
  content: string;
  role: string;
  timestamp?: string;
}

export interface CoachEvent {
  type: string;
  data?: any;
}

export const createConversation = async (title: string) => {
  console.log("Creating conversation:", title);
  return { id: "mock-conv", title };
};

export const listConversations = async () => {
  return [];
};

export const updateConversationTitle = async (id: string, title: string) => {
  console.log(`Updating conversation ${id} title to ${title}`);
  return { id, title };
};
