/**
 * Validation exports - Unified validation schemas and utilities
 */

// Auth validation schemas (primary source for auth schemas)
export * from './auth';

// Data validators (excluding sanitizeInput which conflicts with validator.ts)
export {
  secureEmailSchema,
  securePasswordSchema,
  secureNameSchema,
  secureTextSchema,
  secureUrlSchema,
  secureFileSchema
} from './dataValidator';

// Schema utilities (excluding auth schemas already exported above)
export {
  emailSchema,
  passwordSchema,
  nameSchema,
  phoneSchema,
  profileUpdateSchema,
  journalEntrySchema,
  commentSchema,
  searchSchema,
  invitationSchema,
  contactFormSchema,
  feedbackSchema,
  fileUploadSchema
} from './schemas';

// Schema types
export type {
  ProfileUpdateInput,
  JournalEntryInput,
  CommentInput,
  SearchInput,
  InvitationInput,
  FileUploadInput,
  ContactFormInput,
  FeedbackInput
} from './schemas';

// Safe schemas
export * from './safe-schemas';

// General validator (includes sanitizeInput - takes priority)
export * from './validator';
