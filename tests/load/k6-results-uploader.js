/**
 * K6 Results Uploader - Upload des résultats vers Supabase
 * Utilisé dans le pipeline CI/CD pour persister les métriques
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Upload K6 summary vers Supabase
 */
export async function uploadK6Metrics(summaryData) {
  try {
    const metrics = extractMetrics(summaryData);
    
    console.log('Uploading K6 metrics to Supabase...');
    
    const { data, error } = await supabase
      .from('k6_metrics')
      .insert(metrics);

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully uploaded ${metrics.length} K6 metrics`);
    return data;
  } catch (error) {
    console.error('❌ Failed to upload K6 metrics:', error);
    throw error;
  }
}

/**
 * Extrait métriques du summary K6
 */
function extractMetrics(summary) {
  const metrics = [];
  
  // Parser chaque fonction testée
  const functions = ['compliance-audit', 'gdpr-alert-detector', 'dsar-handler'];
  
  for (const funcName of functions) {
    const metric = {
      function_name: funcName,
      http_req_duration_p95: parseMetric(summary, funcName, 'http_req_duration', 'p(95)'),
      http_req_duration_p99: parseMetric(summary, funcName, 'http_req_duration', 'p(99)'),
      http_req_failed_rate: parseMetric(summary, funcName, 'http_req_failed', 'rate'),
      vus_max: parseMetric(summary, funcName, 'vus_max', 'value'),
      iterations: parseMetric(summary, funcName, 'iterations', 'count'),
      data_received_rate: parseMetric(summary, funcName, 'data_received', 'rate') || 0,
      data_sent_rate: parseMetric(summary, funcName, 'data_sent', 'rate') || 0,
      metadata: {
        test_type: summary.test_type || 'load_test',
        duration: summary.duration,
      },
    };
    
    metrics.push(metric);
  }
  
  return metrics;
}

/**
 * Parse une métrique du summary K6
 */
function parseMetric(summary, functionName, metricName, aggregation) {
  try {
    const key = `${functionName}_${metricName}`;
    const metric = summary.metrics[key];
    
    if (!metric) {
      console.warn(`Metric ${key} not found`);
      return 0;
    }
    
    return metric[aggregation] || 0;
  } catch (error) {
    console.warn(`Error parsing metric ${metricName}:`, error);
    return 0;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const summaryPath = process.argv[2];
  
  if (!summaryPath) {
    console.error('Usage: node k6-results-uploader.js <summary.json>');
    process.exit(1);
  }
  
  const fs = await import('fs/promises');
  const summaryData = JSON.parse(await fs.readFile(summaryPath, 'utf-8'));
  
  await uploadK6Metrics(summaryData);
}
