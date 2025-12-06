// @ts-nocheck

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .alert-box {
      background-color: #fee;
      border-left: 4px solid #e53e3e;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .success-box {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .metric {
      display: inline-block;
      margin: 10px 15px;
      text-align: center;
    }
    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
    }
    .metric-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">EmotionsCare</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} EmotionsCare. Tous droits réservés.</p>
      <p>Vous recevez cet email car vous êtes inscrit sur notre plateforme.</p>
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  alert: (data: any) => baseTemplate(`
    <div class="alert-box">
      <h2 style="margin-top: 0; color: #e53e3e;">⚠️ Alerte Critique</h2>
      <p><strong>${data.title || 'Alerte système'}</strong></p>
      <p>${data.message || 'Une anomalie a été détectée sur le système.'}</p>
    </div>
    
    ${data.metrics ? `
      <div style="text-align: center; margin: 30px 0;">
        ${Object.entries(data.metrics as Record<string, any>).map(([key, value]) => `
          <div class="metric">
            <div class="metric-value">${value}</div>
            <div class="metric-label">${key}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    <p>Veuillez prendre les mesures nécessaires immédiatement.</p>
    
    ${data.actionUrl ? `
      <div style="text-align: center;">
        <a href="${data.actionUrl}" class="button">Voir les détails</a>
      </div>
    ` : ''}
  `),

  compliance: (data: any) => baseTemplate(`
    <h2 style="color: #667eea;">📊 Rapport de Conformité RGPD</h2>
    
    <div class="info-box">
      <p><strong>Score global de conformité :</strong> ${data.score || 'N/A'}%</p>
      <p><strong>Période :</strong> ${data.period || 'N/A'}</p>
    </div>
    
    ${data.findings && data.findings.length > 0 ? `
      <h3>Points d'attention :</h3>
      <ul>
        ${data.findings.map((finding: string) => `<li>${finding}</li>`).join('')}
      </ul>
    ` : '<p style="color: #22c55e;">✅ Aucune anomalie détectée.</p>'}
    
    <div style="text-align: center;">
      <a href="${data.dashboardUrl || '#'}" class="button">Accéder au dashboard</a>
    </div>
  `),

  welcome: (data: any) => baseTemplate(`
    <h2 style="color: #667eea;">🎉 Bienvenue ${data.name || ''} !</h2>
    
    <p>Nous sommes ravis de vous accueillir sur <strong>EmotionsCare</strong>, votre plateforme de bien-être digital.</p>
    
    <div class="success-box">
      <p><strong>Votre compte est maintenant actif !</strong></p>
      <p>Email : ${data.email || ''}</p>
    </div>
    
    <h3>Prochaines étapes :</h3>
    <ul>
      <li>Complétez votre profil</li>
      <li>Explorez nos modules de bien-être</li>
      <li>Configurez vos préférences de confidentialité</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="${data.appUrl || '#'}" class="button">Commencer maintenant</a>
    </div>
  `),

  export_ready: (data: any) => baseTemplate(`
    <h2 style="color: #667eea;">📦 Vos données sont prêtes</h2>
    
    <p>Bonjour ${data.name || ''},</p>
    
    <p>Votre export de données personnelles (RGPD) a été généré avec succès.</p>
    
    <div class="info-box">
      <p><strong>Taille du fichier :</strong> ${data.fileSize || 'N/A'}</p>
      <p><strong>Format :</strong> ${data.format || 'ZIP'}</p>
      <p><strong>Validité :</strong> ${data.expiresIn || '7 jours'}</p>
    </div>
    
    <p>⚠️ <em>Ce lien est à usage unique et expirera dans ${data.expiresIn || '7 jours'}.</em></p>
    
    <div style="text-align: center;">
      <a href="${data.downloadUrl || '#'}" class="button">Télécharger mes données</a>
    </div>
  `),

  delete_request: (data: any) => baseTemplate(`
    <h2 style="color: #e53e3e;">🗑️ Demande de suppression de compte</h2>
    
    <p>Bonjour ${data.name || ''},</p>
    
    <p>Nous avons bien reçu votre demande de suppression de compte.</p>
    
    <div class="alert-box">
      <p><strong>⏰ Période de rétractation : 30 jours</strong></p>
      <p>Votre compte sera définitivement supprimé le <strong>${data.deletionDate || 'N/A'}</strong>.</p>
    </div>
    
    <h3>Ce qui sera supprimé :</h3>
    <ul>
      <li>Toutes vos données personnelles</li>
      <li>Vos sessions et historique</li>
      <li>Vos paramètres et préférences</li>
    </ul>
    
    <p><strong>Vous avez changé d'avis ?</strong> Vous pouvez annuler cette demande à tout moment avant la date de suppression définitive.</p>
    
    <div style="text-align: center;">
      <a href="${data.cancelUrl || '#'}" class="button">Annuler la suppression</a>
    </div>
  `),
};
