// @ts-nocheck

import { z } from 'zod';

// Schémas de validation sécurisés
export const secureEmailSchema = z
  .string()
  .email("Format d'email invalide")
  .min(5, "Email trop court")
  .max(254, "Email trop long")
  .refine(
    (email) => !email.includes('..'),
    "Format d'email invalide"
  );

export const securePasswordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(128, "Le mot de passe est trop long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
  );

export const secureNameSchema = z
  .string()
  .min(1, "Le nom est requis")
  .max(100, "Le nom est trop long")
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"
  );

export const secureTextSchema = z
  .string()
  .max(10000, "Texte trop long")
  .refine(
    (text) => !/<script|javascript:|data:/i.test(text),
    "Contenu non autorisé détecté"
  );

// Fonction de sanitisation
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Supprime les balises HTML
    .replace(/javascript:/gi, '') // Supprime les liens javascript
    .replace(/data:/gi, '') // Supprime les URLs data
    .trim();
};

// Validation d'URL sécurisée
export const secureUrlSchema = z
  .string()
  .url("URL invalide")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    "Seuls les protocoles HTTP et HTTPS sont autorisés"
  );

// Validation de fichiers
export const secureFileSchema = z.object({
  name: z.string().max(255, "Nom de fichier trop long"),
  size: z.number().max(10 * 1024 * 1024, "Fichier trop volumineux (max 10MB)"),
  type: z.string().refine(
    (type) => [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain'
    ].includes(type),
    "Type de fichier non autorisé"
  )
});

export class DataValidator {
  static validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      throw new Error(`Validation failed: ${result.error.errors.map(e => e.message).join(', ')}`);
    }
    
    return result.data;
  }

  static isValidEmotionScore(score: number): boolean {
    return Number.isFinite(score) && score >= 0 && score <= 10;
  }

  static isValidDate(date: string): boolean {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed.getTime() > 0;
  }

  static sanitizeHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  }
}
