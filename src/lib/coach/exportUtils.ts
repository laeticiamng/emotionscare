/**
 * Utilitaires pour exporter les conversations du coach
 */

import { logger } from '@/lib/logger';

interface ExportConversation {
  id: string;
  title: string;
  messages: ExportMessage[];
  exportedAt: string;
  duration: string;
}

interface ExportMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ExportOptions {
  includeTimestamps: boolean;
  includeMetadata: boolean;
  format: 'json' | 'pdf' | 'txt' | 'markdown';
  anonymize: boolean;
}

/**
 * Exporte une conversation en JSON
 */
export const exportAsJSON = (
  conversation: ExportConversation,
  options: Partial<ExportOptions> = {}
): string => {
  const finalOptions: ExportOptions = {
    includeTimestamps: true,
    includeMetadata: true,
    format: 'json',
    anonymize: false,
    ...options,
  };

  const messages = finalOptions.includeTimestamps
    ? conversation.messages
    : conversation.messages.map(({ timestamp, ...rest }) => rest);

  const data: any = {
    conversation: {
      id: conversation.id,
      title: conversation.title,
      exportedAt: conversation.exportedAt,
      ...(!finalOptions.includeMetadata && { duration: conversation.duration }),
    },
    messages,
  };

  if (finalOptions.anonymize) {
    data.conversation.id = '***';
    data.messages = data.messages.map((msg: any) => ({
      ...msg,
      content: anonymizeContent(msg.content),
    }));
  }

  return JSON.stringify(data, null, 2);
};

/**
 * Exporte une conversation en texte brut
 */
export const exportAsText = (
  conversation: ExportConversation,
  options: Partial<ExportOptions> = {}
): string => {
  const finalOptions: ExportOptions = {
    includeTimestamps: true,
    includeMetadata: true,
    format: 'txt',
    anonymize: false,
    ...options,
  };

  let content = `CONVERSATION: ${conversation.title}\n`;
  content += `Exported: ${conversation.exportedAt}\n`;
  if (finalOptions.includeMetadata) {
    content += `Duration: ${conversation.duration}\n`;
  }
  content += `${'='.repeat(60)}\n\n`;

  conversation.messages.forEach((msg) => {
    const timestamp = finalOptions.includeTimestamps ? ` [${msg.timestamp}]` : '';
    const role = msg.role === 'user' ? 'YOU' : 'COACH';
    const msgContent = finalOptions.anonymize ? anonymizeContent(msg.content) : msg.content;
    content += `${role}${timestamp}:\n${msgContent}\n\n`;
  });

  return content;
};

/**
 * Exporte une conversation en Markdown
 */
export const exportAsMarkdown = (
  conversation: ExportConversation,
  options: Partial<ExportOptions> = {}
): string => {
  const finalOptions: ExportOptions = {
    includeTimestamps: true,
    includeMetadata: true,
    format: 'markdown',
    anonymize: false,
    ...options,
  };

  let content = `# ${conversation.title}\n\n`;
  content += `**Exported:** ${conversation.exportedAt}\n`;
  if (finalOptions.includeMetadata) {
    content += `**Duration:** ${conversation.duration}\n`;
  }
  content += `\n---\n\n`;

  conversation.messages.forEach((msg) => {
    const timestamp = finalOptions.includeTimestamps ? ` *(${msg.timestamp})*` : '';
    const role = msg.role === 'user' ? '👤' : '🤖';
    const msgContent = finalOptions.anonymize ? anonymizeContent(msg.content) : msg.content;
    content += `**${role} ${msg.role === 'user' ? 'You' : 'Coach'}**${timestamp}\n\n`;
    content += `${msgContent}\n\n`;
  });

  return content;
};

/**
 * Crée et télécharge un fichier d'export
 */
export const downloadExport = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Génère un lien partageable pour une conversation
 */
export const generateShareLink = (conversationId: string, options: any = {}): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://emotionscare.com';
  const params = new URLSearchParams({
    id: conversationId,
    readonly: options.readonly ? 'true' : 'false',
    expiry: options.expiryDays || '7',
  });
  return `${baseUrl}/share/coach/${conversationId}?${params.toString()}`;
};

/**
 * Anonymise le contenu en supprimant les informations sensibles
 */
export const anonymizeContent = (content: string): string => {
  let anonymized = content;

  // Masquer les emails
  anonymized = anonymized.replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[EMAIL]');

  // Masquer les numéros de téléphone
  anonymized = anonymized.replace(/\b\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\b/g, '[PHONE]');

  // Masquer les noms propres (capitalisés)
  anonymized = anonymized.replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g, '[NAME]');

  // Masquer les adresses
  anonymized = anonymized.replace(/\d+\s+[^,]+(?:,\s*[^,]+){1,2}/g, '[ADDRESS]');

  return anonymized;
};

/**
 * Obtient les statistiques d'une conversation
 */
export const getConversationStats = (conversation: ExportConversation) => {
  const userMessages = conversation.messages.filter((m) => m.role === 'user');
  const coachMessages = conversation.messages.filter((m) => m.role === 'assistant');

  const totalWords = conversation.messages.reduce(
    (sum, msg) => sum + msg.content.split(/\s+/).length,
    0
  );

  const avgMessageLength = totalWords / conversation.messages.length;

  return {
    totalMessages: conversation.messages.length,
    userMessages: userMessages.length,
    coachMessages: coachMessages.length,
    totalWords,
    avgMessageLength: Math.round(avgMessageLength),
  };
};

/**
 * Génère un résumé PDF de la conversation (nécessite une dépendance PDF)
 */
export const generatePDFExport = async (
  conversation: ExportConversation,
  options: Partial<ExportOptions> = {}
): Promise<Blob> => {
  // Cette fonction nécessiterait une dépendance comme jsPDF ou pdfkit
  // Pour l'instant, on retourne une promesse qui exporte en JSON
  const jsonContent = exportAsJSON(conversation, options);
  return new Blob([jsonContent], { type: 'application/json' });
};

/**
 * Valide les options d'export
 */
export const validateExportOptions = (options: Partial<ExportOptions>): boolean => {
  const validFormats = ['json', 'pdf', 'txt', 'markdown'];
  if (options.format && !validFormats.includes(options.format)) {
    logger.error(new Error(`Invalid format: ${options.format}`), 'LIB');
    return false;
  }
  return true;
};
