import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// ============================================
// K6 LOAD TESTS FOR STAGING DEPLOYMENT
// ============================================
// Run with: k6 run tests/load/k6-staging-tests.js

// Custom metrics
const errorRate = new Rate('errors');
const responseTrend = new Trend('response_time');
const successCounter = new Counter('requests_success');
const requestCounter = new Counter('requests_total');

// Configuration
const baseUrl = __ENV.BASE_URL || 'https://staging.emotionscare.com';
const apiUrl = baseUrl + '/api';

// Load test configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp-up to 10 users
    { duration: '3m', target: 50 },   // Ramp-up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Spike to 100 users
    { duration: '5m', target: 100 },  // Hold at 100 users
    { duration: '2m', target: 0 },    // Ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'],     // 95% of requests < 1s
    'http_req_failed': ['rate<0.01'],        // Error rate < 1%
    'errors': ['rate<0.01'],                 // Custom error rate < 1%
  },
};

// ============================================
// TEST SCENARIOS
// ============================================

export default function () {
  // 40% chance: Homepage load
  if (Math.random() < 0.4) {
    testHomepage();
  }
  // 30% chance: User registration
  else if (Math.random() < 0.3) {
    testUserRegistration();
  }
  // 30% chance: Authenticated flows
  else {
    testAuthenticatedFlows();
  }
}

// ============================================
// TEST: HOMEPAGE LOAD
// ============================================

function testHomepage() {
  group('Homepage Load', () => {
    const res = http.get(baseUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'page contains title': (r) => r.body.includes('EmotionsCare'),
      'response time < 2s': (r) => r.timings.duration < 2000,
    });

    if (!success) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(res.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });
}

// ============================================
// TEST: USER REGISTRATION
// ============================================

function testUserRegistration() {
  group('User Registration', () => {
    // Generate unique email
    const timestamp = Date.now();
    const email = `test-${timestamp}-${Math.random().toString(36).substr(2, 9)}@staging.emotionscare.com`;

    // GET signup page
    const getRes = http.get(baseUrl + '/signup');
    check(getRes, {
      'GET /signup status 200': (r) => r.status === 200,
    });

    sleep(2);

    // POST register
    const registerRes = http.post(apiUrl + '/auth/register', JSON.stringify({
      email: email,
      password: 'StagingTest123!',
      name: 'Test User',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    const success = check(registerRes, {
      'registration status is 200/201': (r) => r.status === 200 || r.status === 201,
      'response contains user_id': (r) => r.body.includes('id') || r.body.includes('user_id'),
      'response time < 1s': (r) => r.timings.duration < 1000,
    });

    if (!success) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(registerRes.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });
}

// ============================================
// TEST: AUTHENTICATED FLOWS
// ============================================

function testAuthenticatedFlows() {
  let authToken = '';

  group('Authentication', () => {
    // Login
    const loginRes = http.post(apiUrl + '/auth/login', JSON.stringify({
      email: 'test@staging.emotionscare.com',
      password: 'StagingPassword123!',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    const loginSuccess = check(loginRes, {
      'login status 200': (r) => r.status === 200,
      'response contains token': (r) => r.body.includes('token') || r.body.includes('access_token'),
    });

    if (loginSuccess) {
      try {
        const body = JSON.parse(loginRes.body);
        authToken = body.token || body.access_token || '';
      } catch (e) {
        // Token extraction failed
      }
    }

    if (!loginSuccess) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(loginRes.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });

  if (!authToken) return; // Skip remaining tests if auth failed

  const authHeaders = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  // Get user profile
  group('Get User Profile', () => {
    const res = http.get(apiUrl + '/users/profile', {
      headers: authHeaders,
    });

    const success = check(res, {
      'status 200': (r) => r.status === 200,
      'response contains user data': (r) => r.body.includes('email') || r.body.includes('name'),
    });

    if (!success) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(res.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });

  // Get meditation history
  group('Get Meditation History', () => {
    const res = http.get(apiUrl + '/meditation/history', {
      headers: authHeaders,
    });

    const success = check(res, {
      'status 200': (r) => r.status === 200,
      'response is array': (r) => r.body.includes('[') || r.body.includes('meditation'),
    });

    if (!success) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(res.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });

  // Get journal entries
  group('Get Journal Entries', () => {
    const res = http.get(apiUrl + '/journal', {
      headers: authHeaders,
    });

    const success = check(res, {
      'status 200': (r) => r.status === 200,
      'response contains journal data': (r) => r.body.includes('journal') || r.body.includes('entry') || r.body.includes('['),
    });

    if (!success) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(res.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });

  // Create journal entry
  group('Create Journal Entry', () => {
    const entryRes = http.post(apiUrl + '/journal', JSON.stringify({
      title: 'Load Test Entry',
      content: 'This is a load test journal entry.',
      mood: 'calm',
      type: 'text',
    }), {
      headers: authHeaders,
    });

    const success = check(entryRes, {
      'status 200/201': (r) => r.status === 200 || r.status === 201,
      'response contains id': (r) => r.body.includes('id'),
    });

    if (!success) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(entryRes.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });

  // Create meditation session
  group('Create Meditation Session', () => {
    const sessionRes = http.post(apiUrl + '/meditation', JSON.stringify({
      program: 'calm',
      duration: 5,
      completed: true,
    }), {
      headers: authHeaders,
    });

    const success = check(sessionRes, {
      'status 200/201': (r) => r.status === 200 || r.status === 201,
      'response contains session id': (r) => r.body.includes('id'),
    });

    if (!success) errorRate.add(1);
    else successCounter.add(1);

    responseTrend.add(sessionRes.timings.duration);
    requestCounter.add(1);

    sleep(1);
  });

  // Logout
  group('Logout', () => {
    const logoutRes = http.post(apiUrl + '/auth/logout', {}, {
      headers: authHeaders,
    });

    check(logoutRes, {
      'logout status 200': (r) => r.status === 200,
    });

    successCounter.add(1);
    requestCounter.add(1);

    sleep(1);
  });
}

// ============================================
// SUMMARY
// ============================================

export function teardown(data) {
  console.log('✅ Load test completed');
  console.log(`📊 Total requests: ${requestCounter.value}`);
  console.log(`✅ Successful: ${successCounter.value}`);
  console.log(`❌ Failed: ${errorRate.value}`);
  console.log(`⏱️  Average response time: ${responseTrend.value.toFixed(0)}ms`);
}
