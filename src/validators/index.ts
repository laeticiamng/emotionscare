/**
 * Validators - Export centralisé
 *
 * Regroupe tous les schémas de validation Zod de l'application
 * @module validators
 */

// ============================================
// COMMON VALIDATORS
// ============================================
export {
  // Email & Contact
  EmailSchema,
  PhoneSchema,
  // Strings
  NameSchema,
  UsernameSchema,
  TextSchema,
  ShortTextSchema,
  // Date & Time
  DateSchema,
  BirthDateSchema,
  TimestampSchema,
  // Numbers
  ScoreSchema,
  RatingSchema,
  PercentageSchema,
  PositiveNumberSchema,
  // IDs
  UUIDSchema,
  IdSchema,
  // URLs & Media
  URLSchema,
  ImageURLSchema,
  AudioURLSchema,
  VideoURLSchema,
  // Arrays
  TagsSchema,
  IdsArraySchema,
  // Pagination & Search
  PaginationSchema,
  SearchSchema,
  // Geolocation
  GeoLocationSchema,
  // Colors
  HexColorSchema,
  RGBColorSchema,
  // Files
  FileMetadataSchema,
  // Types
  type PaginationInput,
  type SearchInput,
  type GeoLocation,
  type FileMetadata,
  type Email,
  type Phone,
  type Name,
  type Username,
  type UUID,
} from './common';

// ============================================
// AUTH VALIDATORS
// ============================================
export {
  // Password
  PasswordSchema,
  SimplePasswordSchema,
  PasswordConfirmSchema,
  // Login
  LoginSchema,
  MagicLinkSchema,
  // Registration
  UserRoleSchema,
  RegisterSchema,
  RegisterB2BSchema,
  // Password Reset
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  // MFA
  TOTPCodeSchema,
  MFAVerifySchema,
  MFASetupSchema,
  RecoveryCodeSchema,
  MFARecoverySchema,
  // Email Verification
  VerifyEmailSchema,
  ResendVerificationSchema,
  // Session
  RefreshTokenSchema,
  LogoutSchema,
  // OAuth
  OAuthProviderSchema,
  OAuthCallbackSchema,
  // Helpers
  getPasswordStrength,
  isValidEmail,
  isValidPassword,
  // Types
  type LoginInput,
  type MagicLinkInput,
  type UserRole,
  type RegisterInput,
  type RegisterB2BInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
  type MFAVerifyInput,
  type MFASetupInput,
  type MFARecoveryInput,
  type VerifyEmailInput,
  type ResendVerificationInput,
  type RefreshTokenInput,
  type LogoutInput,
  type OAuthProvider,
  type OAuthCallbackInput,
} from './auth';

// ============================================
// PROFILE VALIDATORS
// ============================================
export {
  // Base Profile
  LanguageSchema,
  ThemeSchema,
  GenderSchema,
  UpdateProfileSchema,
  ProfileSchema,
  // Preferences
  NotificationPreferencesSchema,
  DisplayPreferencesSchema,
  PrivacyPreferencesSchema,
  WellnessPreferencesSchema,
  UserPreferencesSchema,
  // Accessibility
  AccessibilitySettingsSchema,
  // Account
  UpdateEmailSchema,
  DeleteAccountSchema,
  DataExportSchema,
  // Contact
  ContactInfoSchema,
  // Social
  SocialLinksSchema,
  SocialProfileSchema,
  // Organization
  OrganizationProfileSchema,
  // Helpers
  validatePartialProfile,
  validatePreferences,
  // Types
  type Language,
  type Theme,
  type Gender,
  type UpdateProfileInput,
  type Profile,
  type NotificationPreferences,
  type DisplayPreferences,
  type PrivacyPreferences,
  type WellnessPreferences,
  type UserPreferences,
  type AccessibilitySettings,
  type UpdateEmailInput,
  type DeleteAccountInput,
  type DataExportInput,
  type ContactInfo,
  type SocialLinks,
  type SocialProfile,
  type OrganizationProfile,
} from './profile';

// ============================================
// FORMS VALIDATORS
// ============================================
export {
  // Contact
  ContactFormSchema,
  // Feedback
  FeedbackFormSchema,
  QuickRatingSchema,
  NPSFormSchema,
  // Report
  ReportContentSchema,
  // Goals
  CreateGoalSchema,
  UpdateGoalProgressSchema,
  // Challenges
  JoinChallengeSchema,
  CreateChallengeSchema,
  // Comments
  CreateCommentSchema,
  UpdateCommentSchema,
  // Search
  SearchFiltersSchema,
  // Subscription
  NewsletterSubscribeSchema,
  UnsubscribeSchema,
  // Booking
  BookSessionSchema,
  // Invites
  InviteUserSchema,
  BulkInviteSchema,
  // Helpers
  validateForm,
  getFormErrors,
  // Types
  type ContactFormInput,
  type FeedbackFormInput,
  type QuickRatingInput,
  type NPSFormInput,
  type ReportContentInput,
  type CreateGoalInput,
  type UpdateGoalProgressInput,
  type JoinChallengeInput,
  type CreateChallengeInput,
  type CreateCommentInput,
  type UpdateCommentInput,
  type SearchFiltersInput,
  type NewsletterSubscribeInput,
  type UnsubscribeInput,
  type BookSessionInput,
  type InviteUserInput,
  type BulkInviteInput,
} from './forms';

// ============================================
// MUSIC VALIDATORS
// ============================================
export {
  // Generation
  SunoModelSchema,
  MusicGenerationInputSchema,
  // Playlist
  CreatePlaylistSchema,
  AddToPlaylistSchema,
  // Share
  ShareMusicSchema,
  // Preferences
  MusicPreferencesSchema,
  // Session
  MusicSessionConfigSchema,
  // Emotion
  EmotionUpdateSchema,
  // Feedback
  SessionFeedbackSchema,
  // Challenge
  StartChallengeSchema,
  // Helpers
  validateInput,
  validateInputAsync,
  sanitizeText,
  isValidUUID,
  isValidURL,
  // Types
  type MusicGenerationInput,
  type CreatePlaylistInput,
  type AddToPlaylistInput,
  type ShareMusicInput,
  type MusicPreferencesInput,
  type MusicSessionConfig,
  type EmotionUpdateInput,
  type SessionFeedbackInput,
  type StartChallengeInput,
} from './music';
