
export interface ExtensionMeta {
  id: string;
  name: string;
  description: string;
  version?: string;
  author?: string;
  category?: string;
  tags?: string[];
  isNew?: boolean;
  isBeta?: boolean;
  isEarlyAccess?: boolean;
  releaseDate?: string;
  updateDate?: string;
  rating?: number;
  usageCount?: number;
  thumbnail?: string;
}

export interface ExtensionInstallEvent {
  extensionId: string;
  timestamp: string;
  success: boolean;
  error?: string;
  userId?: string;
}

export interface ExtensionFeedback {
  extensionId: string;
  userId: string;
  rating: number;
  comment?: string;
  timestamp: string;
}
