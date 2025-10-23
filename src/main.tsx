// TEST ULTRA-MINIMAL: Pas de React, juste du JavaScript pur
console.log('🔴🔴🔴 MAIN.TSX CHARGÉ 🔴🔴🔴');
console.error('TEST ERROR LOG');
console.warn('TEST WARN LOG');

const root = document.getElementById('root');

if (!root) {
  console.error('ROOT NOT FOUND');
  alert('ERREUR: Root element introuvable');
} else {
  console.log('ROOT FOUND:', root);
  
  // Écrire directement dans le DOM sans React
  root.innerHTML = `
    <div style="
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      font-family: system-ui, sans-serif;
    ">
      <h1 style="font-size: 48px; margin-bottom: 20px;">
        ✅ MAIN.TSX EXÉCUTÉ
      </h1>
      <p style="font-size: 24px; margin-bottom: 20px;">
        Le fichier main.tsx se charge et s'exécute correctement!
      </p>
      <div style="
        background: rgba(255,255,255,0.1);
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
      ">
        <h2 style="font-size: 20px; margin-bottom: 10px;">📊 Tests:</h2>
        <ul style="font-size: 18px; line-height: 1.8;">
          <li>✅ JavaScript s'exécute</li>
          <li>✅ DOM accessible</li>
          <li>✅ innerHTML fonctionne</li>
          <li>⏳ React à réintégrer</li>
        </ul>
      </div>
      <p style="font-size: 14px; opacity: 0.8;">
        ${new Date().toISOString()}
      </p>
    </div>
  `;
  
  console.log('✅ DOM UPDATED');
  alert('SUCCESS: Application chargée!');
}

