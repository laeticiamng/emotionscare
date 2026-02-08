// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { z } from '../_shared/zod.ts';
import { cors, preflightResponse, appendCorsHeaders, rejectCors } from '../_shared/cors.ts';

/**
 * 🔒 SÉCURITÉ: Schéma de validation Zod pour le formulaire de contact
 * Prévient les injections et valide toutes les entrées utilisateur
 */
const ContactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long (max 100 caractères)')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Le nom contient des caractères non autorisés'),
  email: z.string()
    .trim()
    .email('Email invalide')
    .max(255, 'Email trop long'),
  subject: z.string()
    .trim()
    .max(200, 'Sujet trop long (max 200 caractères)')
    .optional()
    .default('Demande générale'),
  message: z.string()
    .trim()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(5000, 'Le message est trop long (max 5000 caractères)'),
  type: z.enum(['general', 'support', 'business', 'bug']).optional().default('general'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium')
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

/**
 * 🛡️ SÉCURITÉ: Rate limiting simple basé sur IP (sans auth)
 * Pour les fonctions publiques comme le formulaire de contact
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 requêtes max
const RATE_WINDOW_MS = 60_000; // par minute

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  // Nettoyage des anciennes entrées (évite fuite mémoire)
  if (rateLimitMap.size > 10000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }
  
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  
  if (entry.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }
  
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

/**
 * 🧹 SÉCURITÉ: Sanitize HTML pour éviter les injections XSS dans les emails
 */
function sanitizeForHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req: Request) => {
  // 🔒 SÉCURITÉ: CORS avec liste blanche (remplace le wildcard *)
  const corsResult = cors(req);
  
  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }
  
  // Note: Pour le formulaire de contact, on accepte les requêtes même sans origin
  // car cela peut être appelé depuis des outils externes légitimes
  // Mais on applique toujours les headers CORS corrects
  
  try {
    // 🛡️ SÉCURITÉ: Rate limiting basé sur IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
                   || req.headers.get('cf-connecting-ip') 
                   || 'unknown';
    
    const rateLimit = checkRateLimit(clientIp);
    
    if (!rateLimit.allowed) {
      console.warn('[contact-form] Rate limit exceeded:', { ip: clientIp });
      const response = new Response(
        JSON.stringify({
          success: false,
          error: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfter} secondes.`,
          code: 'RATE_LIMIT_EXCEEDED'
        }),
        {
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter)
          }
        }
      );
      return appendCorsHeaders(response, corsResult);
    }

    // ✅ VALIDATION: Validation Zod des entrées
    const rawBody = await req.json();
    const validation = ContactFormSchema.safeParse(rawBody);
    
    if (!validation.success) {
      const errors = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      console.warn('[contact-form] Validation failed:', errors);
      
      const response = new Response(
        JSON.stringify({
          success: false,
          error: `Données invalides: ${errors}`,
          code: 'VALIDATION_ERROR'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return appendCorsHeaders(response, corsResult);
    }

    const formData: ContactFormData = validation.data;

    console.log('📧 Nouvelle demande de contact:', {
      name: formData.name,
      email: formData.email,
      type: formData.type,
      priority: formData.priority
    });

    // 🧹 SÉCURITÉ: Sanitize pour l'HTML des emails
    const safeName = sanitizeForHtml(formData.name);
    const safeEmail = sanitizeForHtml(formData.email);
    const safeSubject = sanitizeForHtml(formData.subject);
    const safeMessage = sanitizeForHtml(formData.message);

    // Format email pour l'équipe support
    const emailContent = {
      to: 'contact@emotionscare.com',
      subject: `[EmotionsCare] ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1>📬 Nouvelle Demande de Contact</h1>
            <p>Reçue via le formulaire EmotionsCare</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
              <h3>👤 Informations du Contact</h3>
              <p><strong>Nom:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Type:</strong> ${formData.type}</p>
              <p><strong>Priorité:</strong> ${formData.priority}</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 10px;">
              <h3>💬 Message</h3>
              <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${safeMessage}</div>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>EmotionsCare - Plateforme de Bien-être Émotionnel</p>
            <p>Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      `
    };

    // Email de confirmation pour l'utilisateur
    const confirmationEmail = {
      to: formData.email,
      subject: 'Confirmation de réception - EmotionsCare',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1>✅ Message Reçu</h1>
            <p>Merci de nous avoir contactés !</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 25px; border-radius: 10px;">
              <p>Bonjour ${safeName},</p>
              
              <p>Nous avons bien reçu votre message concernant "<strong>${safeSubject}</strong>".</p>
              
              <p>Notre équipe examine votre demande et vous répondra dans les plus brefs délais :</p>
              <ul>
                <li>🚨 <strong>Urgent:</strong> Dans les 2 heures</li>
                <li>🔥 <strong>Priorité élevée:</strong> Dans les 4 heures</li>
                <li>⚡ <strong>Priorité moyenne:</strong> Dans les 24 heures</li>
                <li>📋 <strong>Priorité faible:</strong> Dans les 48 heures</li>
              </ul>
              
              <p>En attendant, n'hésitez pas à explorer notre centre d'aide ou notre communauté pour des réponses immédiates.</p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #667eea; color: white;">
            <p><strong>Besoin d'aide immédiate ?</strong></p>
            <p>Consultez notre <a href="https://emotionscare.com/help" style="color: white;">Centre d'Aide</a> ou rejoignez notre <a href="https://emotionscare.com/social-cocon" style="color: white;">Communauté</a></p>
          </div>
        </div>
      `
    };

    // Simulation d'envoi d'email (à remplacer par vraie intégration)
    console.log('📧 Email équipe support préparé:', emailContent.subject);
    console.log('📧 Email confirmation utilisateur préparé pour:', formData.email);

    // Response de succès avec détails
    const responseData = {
      success: true,
      message: 'Message reçu avec succès',
      data: {
        ticketId: `EC-${Date.now()}`,
        estimatedResponse: getEstimatedResponse(formData.priority),
        nextSteps: getNextSteps(formData.type),
        supportResources: getSupportResources(formData.type)
      }
    };

    const response = new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' }
    });
    return appendCorsHeaders(response, corsResult);

  } catch (error) {
    console.error('❌ Erreur traitement contact:', error);
    
    const response = new Response(JSON.stringify({
      success: false,
      error: 'Erreur lors du traitement de votre message',
      code: 'CONTACT_FORM_ERROR'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
    return appendCorsHeaders(response, corsResult);
  }
});

function getEstimatedResponse(priority: string): string {
  const responses: Record<string, string> = {
    urgent: 'Dans les 2 heures',
    high: 'Dans les 4 heures', 
    medium: 'Dans les 24 heures',
    low: 'Dans les 48 heures'
  };
  return responses[priority] || responses.medium;
}

function getNextSteps(type: string): string[] {
  const steps: Record<string, string[]> = {
    general: [
      'Votre demande est transmise à notre équipe',
      'Un expert vous contactera personnellement',
      'Vous recevrez une solution adaptée'
    ],
    support: [
      'Analyse technique de votre problème',
      'Diagnostic et identification de la cause',
      'Solution détaillée avec instructions'
    ],
    business: [
      'Évaluation de vos besoins entreprise',
      'Proposition commerciale personnalisée',
      'Démonstration et accompagnement'
    ],
    bug: [
      'Reproduction du bug en environnement test',
      'Correction et tests de qualité',
      'Déploiement de la correction'
    ]
  };
  return steps[type] || steps.general;
}

function getSupportResources(type: string): Array<{title: string, url: string}> {
  const resources: Record<string, Array<{title: string, url: string}>> = {
    general: [
      { title: 'Guide de démarrage', url: '/help/getting-started' },
      { title: 'FAQ complète', url: '/help/faq' },
      { title: 'Tutoriels vidéo', url: '/help/tutorials' }
    ],
    support: [
      { title: 'Centre de dépannage', url: '/help/troubleshooting' },
      { title: 'Guides techniques', url: '/help/technical' },
      { title: 'État des services', url: '/system/status' }
    ],
    business: [
      { title: 'Solutions entreprise', url: '/b2b' },
      { title: 'Plans tarifaires', url: '/pricing' },
      { title: 'Cas d\'usage', url: '/use-cases' }
    ],
    bug: [
      { title: 'Signaler un bug', url: '/help/report-bug' },
      { title: 'Problèmes connus', url: '/help/known-issues' },
      { title: 'Logs système', url: '/system/logs' }
    ]
  };
  return resources[type] || resources.general;
}
