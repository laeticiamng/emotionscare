// @ts-nocheck
import { logger } from '@/lib/logger';

const STORAGE_KEY = "es_metrics_queue";
const MAX_BYTES = 2_000_000; // 2MB
const TTL_HOURS = 72;

interface QueueItem {
  endpoint: string;
  body: string;
  minuteBucket: number;
  timestamp: number;
}

function sha1Simple(str: string): string {
  return Array.from(new TextEncoder().encode(str))
    .reduce((a, b) => ((a << 5) - a + b) >>> 0, 0)
    .toString(16);
}

function readQueue(): QueueItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const items = JSON.parse(stored) as QueueItem[];
    const now = Date.now();
    const ttlMs = TTL_HOURS * 60 * 60 * 1000;
    
    // Filter out expired items
    return items.filter(item => (now - item.timestamp) < ttlMs);
  } catch {
    return [];
  }
}

function writeQueue(items: QueueItem[]): void {
  try {
    let serialized = JSON.stringify(items);
    
    // If too large, remove oldest items
    while (serialized.length > MAX_BYTES && items.length > 0) {
      items.shift(); // Remove oldest
      serialized = JSON.stringify(items);
    }
    
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    logger.warn('Failed to write metrics queue', error as Error, 'ANALYTICS');
  }
}

async function sendMetric(endpoint: string, body: any): Promise<void> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

export async function postMetric(endpoint: string, body: any): Promise<void> {
  const minuteBucket = Math.floor(Date.now() / 60000);
  const bodyStr = JSON.stringify(body);
  const hashKey = `${endpoint}|${sha1Simple(bodyStr)}|${minuteBucket}`;
  
  // Get current queue and remove duplicates
  const queue = readQueue().filter(item => {
    const itemHash = `${item.endpoint}|${sha1Simple(item.body)}|${item.minuteBucket}`;
    return itemHash !== hashKey;
  });
  
  // Add new item to queue
  const newItem: QueueItem = {
    endpoint,
    body: bodyStr,
    minuteBucket,
    timestamp: Date.now()
  };
  
  queue.push(newItem);
  writeQueue(queue);
  
  // Try to send immediately
  try {
    await sendMetric(endpoint, body);
    
    // If successful, remove from queue
    const updatedQueue = readQueue().filter(item => {
      const itemHash = `${item.endpoint}|${sha1Simple(item.body)}|${item.minuteBucket}`;
      return itemHash !== hashKey;
    });
    writeQueue(updatedQueue);
  } catch (error) {
    // Failed to send - item remains in queue for later retry
    logger.warn('Metric queued for later retry', error as Error, 'ANALYTICS');
  }
}

export async function flushMetricsQueue(): Promise<void> {
  const queue = readQueue();
  const remaining: QueueItem[] = [];
  
  for (const item of queue) {
    try {
      await sendMetric(item.endpoint, JSON.parse(item.body));
      // Successfully sent - don't add to remaining
    } catch (error) {
      // Failed to send - keep in queue
      remaining.push(item);
    }
  }
  
  writeQueue(remaining);
}
