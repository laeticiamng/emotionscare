// @ts-nocheck
/**
 * Email Templates Service
 * Advanced email templates for various notifications
 */

import { logger } from '@/lib/logger';

export interface EmailTemplateData {
  [key: string]: any;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Generate email template with dynamic data
 */
export function generateTemplate(
  templateName: string,
  data: EmailTemplateData
): EmailTemplate {
  const templates: Record<string, (data: EmailTemplateData) => EmailTemplate> = {
    welcome: generateWelcomeEmail,
    weekly_report: generateWeeklyReportEmail,
    challenge_complete: generateChallengeCompleteEmail,
    streak_milestone: generateStreakMilestoneEmail,
    wellness_alert: generateWellnessAlertEmail,
    team_invitation: generateTeamInvitationEmail,
    export_ready: generateExportReadyEmail,
    subscription_renewal: generateSubscriptionRenewalEmail,
    achievement_unlocked: generateAchievementUnlockedEmail,
    coach_recommendation: generateCoachRecommendationEmail,
  };

  const templateGenerator = templates[templateName];
  if (!templateGenerator) {
    logger.warn(`Unknown email template: ${templateName}`, {}, 'EMAIL');
    return generateDefaultEmail(data);
  }

  return templateGenerator(data);
}

/**
 * Base HTML wrapper for all emails
 */
function baseHtmlWrapper(content: string, preheader: string = ''): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>EmotionsCare</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center; }
    .header img { max-width: 150px; }
    .header h1 { color: #ffffff; margin: 16px 0 0 0; font-size: 24px; }
    .content { padding: 32px; color: #374151; line-height: 1.6; }
    .content h2 { color: #1f2937; font-size: 20px; margin-bottom: 16px; }
    .content p { margin: 16px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .button:hover { opacity: 0.9; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
    .stat-card { background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 700; color: #6366f1; }
    .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .achievement { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .achievement-icon { font-size: 48px; }
    .achievement-title { font-size: 18px; font-weight: 700; color: #92400e; margin: 8px 0; }
    .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; }
    .footer a { color: #6366f1; text-decoration: none; }
    .divider { height: 1px; background-color: #e5e7eb; margin: 24px 0; }
    .tip-box { background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .tip-box h4 { color: #1e40af; margin: 0 0 8px 0; }
    .tip-box p { margin: 0; color: #1e3a8a; }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px 16px; }
      .stats-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#f4f4f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="container">
    <div class="header">
      <h1>EmotionsCare</h1>
    </div>
    ${content}
    <div class="footer">
      <p>EmotionsCare - Votre compagnon bien-tre</p>
      <p>
        <a href="https://emotionscare.app/settings/notifications">Grer les notifications</a> |
        <a href="https://emotionscare.app/privacy">Politique de confidentialit</a>
      </p>
      <p style="margin-top: 16px;">
         ${new Date().getFullYear()} EmotionsCare. Tous droits rservs.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Welcome Email Template
 */
function generateWelcomeEmail(data: EmailTemplateData): EmailTemplate {
  const { name, email } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>Bienvenue sur EmotionsCare, ${name || 'Cher utilisateur'} !</h2>
      <p>
        Nous sommes ravis de vous accueillir dans notre communaut ddie au bien-tre motionnel.
        Votre parcours vers une meilleure gestion de vos motions commence maintenant.
      </p>

      <div class="tip-box">
        <h4>Premiers pas</h4>
        <p>Commencez par effectuer votre premier scan motionnel pour dcouvrir comment vous vous sentez aujourd'hui.</p>
      </div>

      <p style="text-align: center;">
        <a href="https://emotionscare.app/scan" class="button">
          Faire mon premier scan
        </a>
      </p>

      <div class="divider"></div>

      <h3>Dcouvrez nos fonctionnalits :</h3>
      <ul style="padding-left: 20px;">
        <li><strong>Scan motionnel</strong> - Analysez vos motions en temps rel</li>
        <li><strong>Musique adaptative</strong> - Des playlists gnres selon votre humeur</li>
        <li><strong>Coach IA</strong> - Un accompagnement personnalis 24/7</li>
        <li><strong>Journal motionnel</strong> - Suivez votre volution</li>
        <li><strong>Exercices de respiration</strong> - Retrouvez votre calme</li>
      </ul>

      <p>
        Si vous avez des questions, notre quipe est l pour vous aider.
      </p>
      <p>
         bientt sur EmotionsCare !
      </p>
      <p>
        <strong>L'quipe EmotionsCare</strong>
      </p>
    </div>
  `, `Bienvenue sur EmotionsCare ! Commencez votre parcours bien-tre.`);

  return {
    subject: `Bienvenue sur EmotionsCare, ${name || 'Cher utilisateur'} !`,
    html,
    text: `Bienvenue sur EmotionsCare, ${name || 'Cher utilisateur'} !\n\nNous sommes ravis de vous accueillir. Commencez par effectuer votre premier scan motionnel sur https://emotionscare.app/scan`,
  };
}

/**
 * Weekly Report Email Template
 */
function generateWeeklyReportEmail(data: EmailTemplateData): EmailTemplate {
  const {
    name,
    weekNumber,
    wellbeingScore,
    wellbeingChange,
    totalSessions,
    totalMinutes,
    topEmotion,
    streakDays,
    recommendations = [],
  } = data;

  const changeIndicator = wellbeingChange >= 0 ? '' : '';
  const changeColor = wellbeingChange >= 0 ? '#22c55e' : '#ef4444';

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>Votre rapport hebdomadaire</h2>
      <p>Bonjour ${name || 'Cher utilisateur'},</p>
      <p>
        Voici le rsum de votre semaine ${weekNumber || ''} sur EmotionsCare.
      </p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${wellbeingScore || '--'}</div>
          <div class="stat-label">Score bien-tre</div>
          <div style="color: ${changeColor}; font-size: 14px; margin-top: 4px;">
            ${changeIndicator} ${Math.abs(wellbeingChange || 0)}% vs semaine prcdente
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalSessions || 0}</div>
          <div class="stat-label">Sessions compltes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalMinutes || 0}</div>
          <div class="stat-label">Minutes de pratique</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${streakDays || 0}</div>
          <div class="stat-label">Jours conscutifs</div>
        </div>
      </div>

      ${topEmotion ? `
      <div class="tip-box">
        <h4>motion dominante cette semaine</h4>
        <p>Votre motion la plus frquente tait : <strong>${topEmotion}</strong></p>
      </div>
      ` : ''}

      ${recommendations.length > 0 ? `
      <div class="divider"></div>
      <h3>Recommandations personnalises</h3>
      <ul style="padding-left: 20px;">
        ${recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
      </ul>
      ` : ''}

      <p style="text-align: center;">
        <a href="https://emotionscare.app/activity" class="button">
          Voir mes statistiques dtailles
        </a>
      </p>

      <p>Continuez comme a, vous tes sur la bonne voie !</p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `Votre score bien-tre cette semaine : ${wellbeingScore}/100`);

  return {
    subject: `Votre rapport hebdomadaire - Score: ${wellbeingScore || '--'}/100`,
    html,
    text: `Rapport hebdomadaire EmotionsCare\n\nScore bien-tre: ${wellbeingScore}/100\nSessions: ${totalSessions}\nMinutes de pratique: ${totalMinutes}\nSrie: ${streakDays} jours`,
  };
}

/**
 * Challenge Complete Email Template
 */
function generateChallengeCompleteEmail(data: EmailTemplateData): EmailTemplate {
  const { name, challengeName, pointsEarned, badgeName, totalChallenges } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <div class="achievement">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-title">Dfi complt !</div>
      </div>

      <h2>Flicitations ${name || ''}!</h2>
      <p>
        Vous avez termin avec succs le dfi <strong>"${challengeName}"</strong> !
      </p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">+${pointsEarned || 0}</div>
          <div class="stat-label">Points gagns</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalChallenges || 1}</div>
          <div class="stat-label">Dfis complts</div>
        </div>
      </div>

      ${badgeName ? `
      <div class="tip-box">
        <h4>Nouveau badge dbloqué !</h4>
        <p>Vous avez obtenu le badge : <strong>${badgeName}</strong></p>
      </div>
      ` : ''}

      <p style="text-align: center;">
        <a href="https://emotionscare.app/challenges" class="button">
          Dcouvrir d'autres dfis
        </a>
      </p>

      <p>Continuez  vous dpasser !</p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `Flicitations ! Vous avez complt le dfi "${challengeName}"`);

  return {
    subject: `🏆 Dfi "${challengeName}" complt !`,
    html,
    text: `Flicitations ! Vous avez termin le dfi "${challengeName}" et gagn ${pointsEarned} points.`,
  };
}

/**
 * Streak Milestone Email Template
 */
function generateStreakMilestoneEmail(data: EmailTemplateData): EmailTemplate {
  const { name, streakDays, nextMilestone, bonusPoints } = data;

  const milestoneEmojis: Record<number, string> = {
    7: '🔥',
    14: '⚡',
    30: '💎',
    60: '👑',
    90: '🌟',
    365: '🏅',
  };

  const emoji = milestoneEmojis[streakDays] || '🎯';

  const html = baseHtmlWrapper(`
    <div class="content">
      <div class="achievement">
        <div class="achievement-icon">${emoji}</div>
        <div class="achievement-title">${streakDays} jours conscutifs !</div>
      </div>

      <h2>Incroyable ${name || ''}!</h2>
      <p>
        Vous maintenez votre engagement depuis <strong>${streakDays} jours</strong> conscutifs.
        C'est une performance remarquable !
      </p>

      ${bonusPoints ? `
      <div class="stat-card" style="margin: 24px 0;">
        <div class="stat-value">+${bonusPoints}</div>
        <div class="stat-label">Points bonus</div>
      </div>
      ` : ''}

      ${nextMilestone ? `
      <div class="tip-box">
        <h4>Prochain objectif</h4>
        <p>Plus que ${nextMilestone - streakDays} jours pour atteindre ${nextMilestone} jours !</p>
      </div>
      ` : ''}

      <p style="text-align: center;">
        <a href="https://emotionscare.app/gamification" class="button">
          Voir mes progrs
        </a>
      </p>

      <p>Ne lchez rien, vous tes formidable !</p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `${streakDays} jours conscutifs ! Continuez comme a !`);

  return {
    subject: `${emoji} ${streakDays} jours conscutifs - Flicitations !`,
    html,
    text: `Flicitations ! Vous avez atteint ${streakDays} jours conscutifs sur EmotionsCare.`,
  };
}

/**
 * Wellness Alert Email Template
 */
function generateWellnessAlertEmail(data: EmailTemplateData): EmailTemplate {
  const { name, alertType, message, suggestions = [] } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>Un message de votre coach bien-tre</h2>
      <p>Bonjour ${name || ''},</p>
      <p>${message}</p>

      ${suggestions.length > 0 ? `
      <div class="tip-box">
        <h4>Suggestions personnalises</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${suggestions.map((s: string) => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <p style="text-align: center;">
        <a href="https://emotionscare.app/coach" class="button">
          Parler  mon coach
        </a>
      </p>

      <p>
        Nous sommes l pour vous accompagner.
      </p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `Message important de votre coach bien-tre`);

  return {
    subject: `💚 Un message de votre coach bien-tre`,
    html,
    text: `${message}\n\n${suggestions.join('\n')}`,
  };
}

/**
 * Team Invitation Email Template
 */
function generateTeamInvitationEmail(data: EmailTemplateData): EmailTemplate {
  const { inviterName, teamName, companyName, inviteUrl } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>Vous tes invit(e)  rejoindre une quipe !</h2>
      <p>
        <strong>${inviterName}</strong> vous invite  rejoindre l'quipe
        <strong>"${teamName}"</strong>${companyName ? ` chez ${companyName}` : ''} sur EmotionsCare.
      </p>

      <div class="tip-box">
        <h4>Qu'est-ce que EmotionsCare ?</h4>
        <p>
          EmotionsCare est une plateforme de bien-tre motionnel qui vous aide  mieux
          comprendre et grer vos motions au quotidien.
        </p>
      </div>

      <p style="text-align: center;">
        <a href="${inviteUrl}" class="button">
          Accepter l'invitation
        </a>
      </p>

      <p style="font-size: 12px; color: #6b7280;">
        Ce lien expire dans 7 jours. Si vous n'avez pas demand cette invitation,
        vous pouvez ignorer cet email.
      </p>
    </div>
  `, `${inviterName} vous invite  rejoindre ${teamName} sur EmotionsCare`);

  return {
    subject: `Invitation  rejoindre "${teamName}" sur EmotionsCare`,
    html,
    text: `${inviterName} vous invite  rejoindre l'quipe "${teamName}" sur EmotionsCare. Cliquez ici pour accepter: ${inviteUrl}`,
  };
}

/**
 * Export Ready Email Template
 */
function generateExportReadyEmail(data: EmailTemplateData): EmailTemplate {
  const { name, downloadUrl, fileSize, format, expiresIn } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>Vos donnes sont prtes !</h2>
      <p>Bonjour ${name || ''},</p>
      <p>
        L'export de vos donnes est termin et prt  tre tlcharg.
      </p>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" style="font-size: 18px;">${format?.toUpperCase() || 'ZIP'}</div>
          <div class="stat-label">Format</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="font-size: 18px;">${fileSize || 'N/A'}</div>
          <div class="stat-label">Taille</div>
        </div>
      </div>

      <p style="text-align: center;">
        <a href="${downloadUrl}" class="button">
          Tlcharger mes donnes
        </a>
      </p>

      <div class="tip-box">
        <h4>Important</h4>
        <p>
          Ce lien de tlchargement expire dans <strong>${expiresIn || '24 heures'}</strong>.
          Assurez-vous de tlcharger vos donnes avant cette date.
        </p>
      </div>

      <p>
        Conformment au RGPD, vos donnes vous appartiennent.
      </p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `Vos donnes EmotionsCare sont prtes  tre tlcharges`);

  return {
    subject: `📦 Vos donnes sont prtes - EmotionsCare`,
    html,
    text: `Vos donnes EmotionsCare sont prtes. Tlchargez-les ici: ${downloadUrl}. Ce lien expire dans ${expiresIn}.`,
  };
}

/**
 * Subscription Renewal Email Template
 */
function generateSubscriptionRenewalEmail(data: EmailTemplateData): EmailTemplate {
  const { name, planName, renewalDate, amount, currency = 'EUR' } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>Rappel de renouvellement</h2>
      <p>Bonjour ${name || ''},</p>
      <p>
        Votre abonnement <strong>${planName}</strong> sera renouvel automatiquement
        le <strong>${renewalDate}</strong>.
      </p>

      <div class="stat-card" style="margin: 24px 0;">
        <div class="stat-value">${amount} ${currency}</div>
        <div class="stat-label">Montant du renouvellement</div>
      </div>

      <p>
        Si vous souhaitez modifier ou annuler votre abonnement, vous pouvez le faire
        depuis les paramtres de votre compte.
      </p>

      <p style="text-align: center;">
        <a href="https://emotionscare.app/settings/subscription" class="button">
          Grer mon abonnement
        </a>
      </p>

      <p>Merci de votre confiance !</p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `Votre abonnement ${planName} sera renouvel le ${renewalDate}`);

  return {
    subject: `Rappel: Renouvellement de votre abonnement ${planName}`,
    html,
    text: `Votre abonnement ${planName} sera renouvel le ${renewalDate} pour ${amount} ${currency}.`,
  };
}

/**
 * Achievement Unlocked Email Template
 */
function generateAchievementUnlockedEmail(data: EmailTemplateData): EmailTemplate {
  const { name, achievementName, achievementDescription, pointsEarned, rarity } = data;

  const rarityColors: Record<string, string> = {
    common: '#9ca3af',
    rare: '#3b82f6',
    epic: '#8b5cf6',
    legendary: '#f59e0b',
  };

  const html = baseHtmlWrapper(`
    <div class="content">
      <div class="achievement" style="background: linear-gradient(135deg, ${rarityColors[rarity] || '#fef3c7'}20 0%, ${rarityColors[rarity] || '#fde68a'}40 100%);">
        <div class="achievement-icon">🎖️</div>
        <div class="achievement-title">${achievementName}</div>
        <div style="font-size: 12px; color: ${rarityColors[rarity] || '#92400e'}; text-transform: uppercase;">
          ${rarity || 'Commun'}
        </div>
      </div>

      <h2>Flicitations ${name || ''} !</h2>
      <p>
        Vous avez dbloqu un nouveau succs : <strong>${achievementName}</strong>
      </p>
      <p style="color: #6b7280; font-style: italic;">
        "${achievementDescription}"
      </p>

      ${pointsEarned ? `
      <div class="stat-card" style="margin: 24px 0;">
        <div class="stat-value">+${pointsEarned}</div>
        <div class="stat-label">Points gagns</div>
      </div>
      ` : ''}

      <p style="text-align: center;">
        <a href="https://emotionscare.app/gamification" class="button">
          Voir tous mes succs
        </a>
      </p>

      <p>Continuez  explorer pour dbloquer plus de succs !</p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `Nouveau succs dbloqu : ${achievementName}`);

  return {
    subject: `🎖️ Succs dbloqu : ${achievementName}`,
    html,
    text: `Flicitations ! Vous avez dbloqu le succs "${achievementName}". ${achievementDescription}`,
  };
}

/**
 * Coach Recommendation Email Template
 */
function generateCoachRecommendationEmail(data: EmailTemplateData): EmailTemplate {
  const { name, recommendation, context, actionUrl, actionLabel } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>Une recommandation de votre coach</h2>
      <p>Bonjour ${name || ''},</p>

      ${context ? `
      <p style="color: #6b7280;">
        ${context}
      </p>
      ` : ''}

      <div class="tip-box">
        <h4>Recommandation personnalise</h4>
        <p>${recommendation}</p>
      </div>

      <p style="text-align: center;">
        <a href="${actionUrl || 'https://emotionscare.app/coach'}" class="button">
          ${actionLabel || 'Commencer maintenant'}
        </a>
      </p>

      <p>
        Votre coach est toujours l pour vous accompagner.
      </p>
      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `, `Nouvelle recommandation de votre coach EmotionsCare`);

  return {
    subject: `💡 Recommandation de votre coach`,
    html,
    text: `${context || ''}\n\nRecommandation: ${recommendation}`,
  };
}

/**
 * Default Email Template (fallback)
 */
function generateDefaultEmail(data: EmailTemplateData): EmailTemplate {
  const { title, message, actionUrl, actionLabel } = data;

  const html = baseHtmlWrapper(`
    <div class="content">
      <h2>${title || 'Message de EmotionsCare'}</h2>
      <p>${message || ''}</p>

      ${actionUrl ? `
      <p style="text-align: center;">
        <a href="${actionUrl}" class="button">
          ${actionLabel || 'En savoir plus'}
        </a>
      </p>
      ` : ''}

      <p><strong>L'quipe EmotionsCare</strong></p>
    </div>
  `);

  return {
    subject: title || 'Message de EmotionsCare',
    html,
    text: `${title || ''}\n\n${message || ''}`,
  };
}

export default { generateTemplate };
