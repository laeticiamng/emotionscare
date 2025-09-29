import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'business' | 'bug';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();

    console.log('📧 Nouvelle demande de contact:', {
      name: formData.name,
      email: formData.email,
      type: formData.type,
      priority: formData.priority
    });

    // Validation des données
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error('Données manquantes: nom, email et message requis');
    }

    // Format email pour l'équipe support
    const emailContent = {
      to: 'support@emotionscare.ai',
      subject: `[EmotionsCare] ${formData.subject || 'Nouvelle demande de contact'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1>📬 Nouvelle Demande de Contact</h1>
            <p>Reçue via le formulaire EmotionsCare</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
              <h3>👤 Informations du Contact</h3>
              <p><strong>Nom:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Type:</strong> ${formData.type}</p>
              <p><strong>Priorité:</strong> ${formData.priority}</p>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 10px;">
              <h3>💬 Message</h3>
              <div style="background: #f1f3f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${formData.message}</div>
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
              <p>Bonjour ${formData.name},</p>
              
              <p>Nous avons bien reçu votre message concernant "<strong>${formData.subject || 'Demande générale'}</strong>".</p>
              
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
            <p>Consultez notre <a href="https://emotionscare.ai/help" style="color: white;">Centre d'Aide</a> ou rejoignez notre <a href="https://emotionscare.ai/social-cocon" style="color: white;">Communauté</a></p>
          </div>
        </div>
      `
    };

    // Simulation d'envoi d'email (à remplacer par vraie intégration)
    console.log('📧 Email équipe support préparé:', emailContent.subject);
    console.log('📧 Email confirmation utilisateur préparé pour:', formData.email);

    // Response de succès avec détails
    const response = {
      success: true,
      message: 'Message reçu avec succès',
      data: {
        ticketId: `EC-${Date.now()}`,
        estimatedResponse: getEstimatedResponse(formData.priority),
        nextSteps: getNextSteps(formData.type),
        supportResources: getSupportResources(formData.type)
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur traitement contact:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erreur lors du traitement de votre message',
      code: 'CONTACT_FORM_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getEstimatedResponse(priority: string): string {
  const responses = {
    urgent: 'Dans les 2 heures',
    high: 'Dans les 4 heures', 
    medium: 'Dans les 24 heures',
    low: 'Dans les 48 heures'
  };
  return responses[priority] || responses.medium;
}

function getNextSteps(type: string): string[] {
  const steps = {
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
  const resources = {
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