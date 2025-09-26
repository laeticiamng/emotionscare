/**
 * Main.tsx - RouterV2 réparé
 */

// ULTRA EMERGENCY MODE - Pas d'imports du tout
console.log('🚨 ULTRA EMERGENCY MODE');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found');
  document.body.innerHTML = '<h1 style="color: red;">ROOT ELEMENT NOT FOUND</h1>';
} else {
  console.log('✅ Root element found');
  
  // Injection HTML directe
  rootElement.innerHTML = `
    <div style="
      min-height: 100vh;
      background-color: white;
      color: black;
      padding: 20px;
      font-family: Arial, sans-serif;
      font-size: 16px;
    ">
      <h1 style="color: black; font-size: 32px; margin-bottom: 20px;">
        🚨 ULTRA EMERGENCY - EmotionsCare
      </h1>
      <p style="color: black; font-size: 18px; margin-bottom: 20px;">
        Test HTML pur - Si vous voyez ceci, JavaScript fonctionne !
      </p>
      <div style="
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 2px solid #ccc;
      ">
        <h2 style="color: black; margin-bottom: 10px;">Diagnostic:</h2>
        <ul style="color: black;">
          <li>✅ HTML: OK</li>
          <li>✅ JavaScript: OK</li>
          <li>✅ CSS inline: OK</li>
          <li>✅ Root element: Trouvé</li>
        </ul>
      </div>
      <button 
        onclick="alert('JavaScript fonctionne!'); console.log('✅ Click OK');"
        style="
          background-color: #28a745;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 5px;
          font-size: 18px;
          cursor: pointer;
          margin-right: 10px;
        "
      >
        Test JavaScript
      </button>
      <button 
        onclick="window.location.reload();"
        style="
          background-color: #dc3545;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 5px;
          font-size: 18px;
          cursor: pointer;
        "
      >
        Recharger la page
      </button>
    </div>
  `;
  
  console.log('✅ HTML injecté avec succès');
}
