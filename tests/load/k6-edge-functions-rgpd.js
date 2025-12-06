/**
 * Tests de charge K6 pour Edge Functions RGPD
 * Simule 100+ utilisateurs simultanés
 * 
 * Installation K6:
 * - macOS: brew install k6
 * - Windows: choco install k6
 * - Linux: sudo apt install k6
 * 
 * Exécution:
 * k6 run tests/load/k6-edge-functions-rgpd.js
 * 
 * Avec options:
 * k6 run --vus 100 --duration 5m tests/load/k6-edge-functions-rgpd.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Métriques personnalisées
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const successfulRequests = new Counter('successful_requests');
const failedRequests = new Counter('failed_requests');

// Configuration des scénarios de charge
export const options = {
  // Scénarios de montée en charge progressive
  scenarios: {
    // Scénario 1: Montée progressive vers 100 utilisateurs
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 },   // Montée à 20 utilisateurs en 2 min
        { duration: '3m', target: 50 },   // Montée à 50 utilisateurs en 3 min
        { duration: '2m', target: 100 },  // Montée à 100 utilisateurs en 2 min
        { duration: '5m', target: 100 },  // Maintien à 100 utilisateurs pendant 5 min
        { duration: '2m', target: 0 },    // Descente progressive
      ],
      gracefulRampDown: '30s',
    },
    
    // Scénario 2: Pics de charge (spike testing)
    spike_test: {
      executor: 'ramping-vus',
      startTime: '15m',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 200 },  // Pic soudain à 200 utilisateurs
        { duration: '1m', target: 200 },   // Maintien
        { duration: '30s', target: 0 },    // Retour rapide
      ],
    },
    
    // Scénario 3: Stress test (dépasser les limites)
    stress_test: {
      executor: 'ramping-vus',
      startTime: '20m',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '3m', target: 200 },
        { duration: '3m', target: 300 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  
  // Seuils de performance (SLAs)
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<5000'], // 95% < 2s, 99% < 5s
    http_req_failed: ['rate<0.05'],                  // Taux d'erreur < 5%
    errors: ['rate<0.1'],                            // Taux d'erreur métier < 10%
    response_time: ['p(95)<3000'],                   // 95% des réponses < 3s
  },
};

// Configuration Supabase
const SUPABASE_URL = __ENV.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const SUPABASE_ANON_KEY = __ENV.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Headers communs
const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

/**
 * Test de l'Edge Function compliance-audit/latest
 */
function testComplianceAuditLatest() {
  const startTime = Date.now();
  
  const res = http.post(
    `${SUPABASE_URL}/functions/v1/compliance-audit/latest`,
    JSON.stringify({}),
    { headers }
  );
  
  const duration = Date.now() - startTime;
  responseTime.add(duration);
  
  const success = check(res, {
    'status is 200 or 404': (r) => r.status === 200 || r.status === 404,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'has valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch (e) {
        return false;
      }
    },
  });
  
  if (success) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
    errorRate.add(1);
  }
  
  return res;
}

/**
 * Test de l'Edge Function compliance-audit/history
 */
function testComplianceAuditHistory() {
  const startTime = Date.now();
  
  const res = http.post(
    `${SUPABASE_URL}/functions/v1/compliance-audit/history`,
    JSON.stringify({}),
    { headers }
  );
  
  const duration = Date.now() - startTime;
  responseTime.add(duration);
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has audits': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.audits !== undefined;
      } catch (e) {
        return false;
      }
    },
    'response time < 3s': (r) => r.timings.duration < 3000,
  });
  
  if (success) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
    errorRate.add(1);
  }
  
  return res;
}

/**
 * Test de l'Edge Function gdpr-alert-detector
 */
function testGdprAlertDetector() {
  const startTime = Date.now();
  
  const types = ['export', 'deletion', 'consent'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  const payload = {
    type: randomType,
    userId: `load-test-user-${__VU}-${__ITER}`,
    metadata: {
      urgent: Math.random() > 0.8,
      reason: `Load test ${__VU}/${__ITER}`,
    },
  };
  
  const res = http.post(
    `${SUPABASE_URL}/functions/v1/gdpr-alert-detector`,
    JSON.stringify(payload),
    { headers }
  );
  
  const duration = Date.now() - startTime;
  responseTime.add(duration);
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has alertsCreated field': (r) => {
      try {
        const data = JSON.parse(r.body);
        return typeof data.alertsCreated === 'number';
      } catch (e) {
        return false;
      }
    },
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  if (success) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
    errorRate.add(1);
  }
  
  return res;
}

/**
 * Test de l'Edge Function dsar-handler
 */
function testDsarHandler() {
  const startTime = Date.now();
  
  const actions = ['create', 'list'];
  const requestTypes = ['access', 'deletion', 'rectification', 'portability'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  let payload;
  if (randomAction === 'create') {
    payload = {
      action: 'create',
      requestType: requestTypes[Math.floor(Math.random() * requestTypes.length)],
      userEmail: `loadtest-${__VU}-${__ITER}@test.com`,
      details: `Load test request from VU ${__VU}`,
    };
  } else {
    payload = {
      action: 'list',
      userId: `load-test-user-${__VU}`,
    };
  }
  
  const res = http.post(
    `${SUPABASE_URL}/functions/v1/dsar-handler`,
    JSON.stringify(payload),
    { headers }
  );
  
  const duration = Date.now() - startTime;
  responseTime.add(duration);
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'valid response structure': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data !== null;
      } catch (e) {
        return false;
      }
    },
    'response time < 30s': (r) => r.timings.duration < 30000,
  });
  
  if (success) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
    errorRate.add(1);
  }
  
  return res;
}

/**
 * Scénario principal exécuté par chaque utilisateur virtuel
 */
export default function () {
  // Mix réaliste des opérations (distribution selon fréquence d'usage)
  const rand = Math.random();
  
  if (rand < 0.4) {
    // 40% - Consultation du dernier audit (opération la plus fréquente)
    testComplianceAuditLatest();
  } else if (rand < 0.6) {
    // 20% - Consultation de l'historique
    testComplianceAuditHistory();
  } else if (rand < 0.85) {
    // 25% - Détection d'alertes
    testGdprAlertDetector();
  } else {
    // 15% - Création/consultation DSAR
    testDsarHandler();
  }
  
  // Think time : temps de réflexion entre les requêtes (1-3 secondes)
  sleep(Math.random() * 2 + 1);
}

/**
 * Fonction de configuration initiale (une fois au début)
 */
export function setup() {
  console.log('🚀 Démarrage des tests de charge RGPD');
  console.log(`📊 URL Supabase: ${SUPABASE_URL}`);
  console.log(`👥 Configuration: Montée progressive jusqu'à 100+ utilisateurs`);
  
  return {
    startTime: new Date().toISOString(),
  };
}

/**
 * Fonction de nettoyage finale (une fois à la fin)
 */
export function teardown(data) {
  console.log('✅ Tests de charge terminés');
  console.log(`⏱️  Durée totale: depuis ${data.startTime}`);
  console.log(`📈 Requêtes réussies: ${successfulRequests.value}`);
  console.log(`❌ Requêtes échouées: ${failedRequests.value}`);
}

/**
 * Gestion des erreurs et logs personnalisés
 */
export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

// Helper pour le résumé texte
function textSummary(data, opts) {
  const indent = opts?.indent || '';
  const enableColors = opts?.enableColors || false;
  
  let summary = '\n\n';
  summary += `${indent}✨ Résumé des Tests de Charge RGPD\n`;
  summary += `${indent}${'='.repeat(50)}\n\n`;
  
  // Statistiques HTTP
  summary += `${indent}📊 Requêtes HTTP:\n`;
  summary += `${indent}  Total: ${data.metrics.http_reqs?.values?.count || 0}\n`;
  summary += `${indent}  Réussies: ${successfulRequests.value}\n`;
  summary += `${indent}  Échouées: ${failedRequests.value}\n`;
  summary += `${indent}  Taux d'erreur: ${(errorRate.rate * 100).toFixed(2)}%\n\n`;
  
  // Temps de réponse
  summary += `${indent}⏱️  Temps de réponse:\n`;
  summary += `${indent}  Moyenne: ${data.metrics.http_req_duration?.values?.avg?.toFixed(2) || 0}ms\n`;
  summary += `${indent}  Médiane: ${data.metrics.http_req_duration?.values?.med?.toFixed(2) || 0}ms\n`;
  summary += `${indent}  P95: ${data.metrics.http_req_duration?.values?.['p(95)']?.toFixed(2) || 0}ms\n`;
  summary += `${indent}  P99: ${data.metrics.http_req_duration?.values?.['p(99)']?.toFixed(2) || 0}ms\n`;
  summary += `${indent}  Max: ${data.metrics.http_req_duration?.values?.max?.toFixed(2) || 0}ms\n\n`;
  
  // Seuils
  summary += `${indent}🎯 Seuils de performance:\n`;
  const thresholds = data.root_group?.checks || [];
  thresholds.forEach(check => {
    const icon = check.passes ? '✅' : '❌';
    summary += `${indent}  ${icon} ${check.name}\n`;
  });
  
  return summary;
}
