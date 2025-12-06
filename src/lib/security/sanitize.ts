import sanitizeHtml from 'sanitize-html';

const USER_CONTENT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  allowedSchemes: ['http', 'https', 'mailto'],
  parser: {
    lowerCaseAttributeNames: true,
  },
};

const normalizeWhitespace = (value: string): string => {
  const sanitizedLines = value
    .split('\n')
    .map((line) =>
      line
        .replace(/\u00a0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trimEnd()
    );

  return sanitizedLines.join('\n').trim();
};

export const sanitizeUserContent = (input: string): string => {
  if (!input) {
    return '';
  }

  const sanitized = sanitizeHtml(input, USER_CONTENT_SANITIZE_OPTIONS);
  return normalizeWhitespace(sanitized.replace(/\r\n?/g, '\n'));
};

export const sanitizeChatHistory = (inputs: string[]): string[] =>
  inputs.map((entry) => sanitizeUserContent(entry));
