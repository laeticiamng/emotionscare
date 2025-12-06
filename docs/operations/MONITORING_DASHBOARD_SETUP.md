# 📊 Monitoring Dashboard Setup Guide

**Setup comprehensive monitoring dashboards for real-time visibility into EmotionsCare v1.0 production environment.**

---

## 🎯 Overview

This guide helps you set up monitoring dashboards across multiple platforms:
- **Sentry**: Error tracking and performance monitoring
- **Infrastructure**: System health and resource utilization
- **Custom**: Business metrics and user engagement
- **Status Page**: Public-facing status communication

---

## 1. Sentry Dashboard Setup

### Step 1: Access Sentry

```
URL: https://sentry.io/projects/emotionscare/
Project: emotionscare/emotionscare
```

### Step 2: Create Custom Dashboard

**Dashboard Name**: EmotionsCare v1.0 Production

**Widgets to Add**:

#### Widget 1: Error Rate Overview
```
- Type: Line chart
- Metric: Event count (24 hours)
- Filter: Transaction status is "error"
- Threshold: Red line at 0.5%
- Alert: Show alert if > 1%
```

#### Widget 2: Response Time Trends
```
- Type: Line chart
- Metric: Transaction duration (P50, P95, P99)
- Filter: Release is "v1.0.0"
- Threshold: Yellow at 1000ms, Red at 2000ms
```

#### Widget 3: User Adoption
```
- Type: Area chart
- Metric: Unique users
- Time period: Last 24 hours
- Color: Green (trending up)
```

#### Widget 4: Issue Backlog
```
- Type: Number widget
- Metric: Unresolved issues
- Threshold: Red if > 10, Yellow if > 5
```

#### Widget 5: Top 10 Errors
```
- Type: Table
- Columns: Error type, Count, Last seen
- Sort: Count descending
- Filter: Last 24 hours
```

#### Widget 6: Feature Health
```
- Type: Gauge chart for each major feature:
  - Emotion Detection: Error rate
  - Music Generation: Success rate
  - Voice Journaling: Duration
  - Meditation: Session completion
  - All others...
```

#### Widget 7: Geographic Distribution
```
- Type: World map
- Metric: Error rate by region
- Color scale: Green (good) to Red (issues)
```

#### Widget 8: API Integration Health
```
- Type: Status dashboard
- Integrations:
  - OpenAI (✓ Healthy)
  - Hume API (✓ Healthy)
  - Suno API (✓ Healthy)
  - Spotify (✓ Healthy)
  - Google Calendar (✓ Healthy)
  - Zoom (✓ Healthy)
  - Firebase FCM (✓ Healthy)
```

### Step 3: Configure Alerts

**Critical Alerts** (P1 - Immediate escalation):
```
1. Error Rate > 2% for 5 minutes
2. Response Time P95 > 3 seconds
3. Authentication failures > 50/min
4. Database connection pool exhausted
5. Out of memory detected
6. Disk space critical
```

**High Alerts** (P2 - Urgent):
```
1. Error Rate > 1% for 10 minutes
2. Response Time P95 > 2 seconds
3. API integration failures
4. Cache hit ratio < 50%
5. Slow queries detected (> 5 seconds)
```

**Warning Alerts** (P3 - Monitor):
```
1. Error Rate > 0.5%
2. Response Time P95 > 1 second
3. Unusual traffic pattern
4. New errors detected
5. Performance degradation > 20%
```

### Step 4: Slack Integration

**Configure Slack notification channel**:
```
Channel: #alerts-critical
Rule: Send P1 alerts immediately
Format: Include error details and stack trace
Escalation: @on-call-engineer
```

**Channel: #alerts-high**:
```
Rule: Send P2 alerts with 5-minute digest
Format: Summary + link to Sentry
```

**Channel: #alerts-medium**:
```
Rule: Daily digest of P3 alerts at 9 AM UTC
Format: Summary statistics
```

---

## 2. Metrics Dashboard (Business & Technical)

### Create Custom Metrics Dashboard

**Dashboard Name**: EmotionsCare v1.0 - Comprehensive Metrics

**Key Metrics to Track**:

```
📊 PERFORMANCE METRICS
├─ Response Time (P50/P95/P99)
├─ Error Rate (%)
├─ Success Rate (%)
├─ Uptime (%)
└─ Throughput (req/sec)

👥 USER METRICS
├─ Active Users (now/24h/7d)
├─ New Users (today)
├─ Daily Active Users (DAU)
├─ Monthly Active Users (MAU)
└─ Session Duration (avg)

🎯 FEATURE METRICS
├─ Emotion Detection: Success Rate
├─ Music Generation: Completion %
├─ Voice Journaling: Transcription Accuracy
├─ Meditation: Average Duration
├─ Coaching: Lessons Completed
└─ Data Export: Files Generated

💾 INFRASTRUCTURE METRICS
├─ CPU Usage (%)
├─ Memory Usage (%)
├─ Disk Space (available GB)
├─ Database Connections (active)
├─ Connection Pool Status
└─ Cache Hit Ratio

🔌 API INTEGRATION METRICS
├─ OpenAI: Requests/Errors
├─ Hume API: Detection Accuracy
├─ Suno: Generation Success
├─ Spotify: Playlist Exports
├─ Google Calendar: Syncs
├─ Zoom: Meeting Initiations
└─ Firebase: FCM Delivery

⚠️ ERROR METRICS
├─ Total Errors (24h)
├─ Error Rate by Type
├─ Most Frequent Errors
├─ Error Trend (increasing/stable)
└─ User Impact Count

💰 BUSINESS METRICS
├─ Feature Adoption Rate
├─ Feature Usage Frequency
├─ User Satisfaction Score
├─ Support Ticket Volume
└─ User Retention Rate
```

---

## 3. Infrastructure Monitoring

### Supabase Dashboard

**URL**: Dashboard > Monitoring

**Metrics to Monitor**:
```
Database:
├─ Query Performance
├─ Connection Pool Status
├─ Replication Lag
├─ Storage Usage
└─ Backup Status

Auth:
├─ Active Sessions
├─ Login Failures
├─ Sign-Up Rate
└─ MFA Adoption

Storage:
├─ Total Storage Used
├─ Upload/Download Bandwidth
├─ File Count
└─ Storage Growth Rate
```

### System Health Dashboard

**Create dashboard showing**:
```
Server Health:
├─ CPU Usage (all servers)
├─ Memory Usage (all servers)
├─ Disk I/O
├─ Network I/O
└─ Process Status

Network:
├─ Inbound Traffic
├─ Outbound Traffic
├─ Requests Per Second
├─ Packet Loss
└─ Latency

Storage:
├─ Database Size
├─ File Storage Usage
├─ Backup Size
└─ Available Space
```

---

## 4. Status Page Setup

### Public-Facing Status

**Platform Options**:
- Statuspage.io
- Incident.io
- StatusCake
- Custom dashboard

**Create Components**:
```
API Status:
├─ Status: Operational
├─ Uptime: 99.95%
└─ Last Update: [time]

Database:
├─ Status: Operational
├─ Response Time: 50ms
└─ Last Update: [time]

Authentication:
├─ Status: Operational
├─ Success Rate: 99.9%
└─ Last Update: [time]

Features:
├─ Emotion Detection: Operational
├─ Music Generation: Operational
├─ Voice Journaling: Operational
├─ Meditation Timer: Operational
├─ Calendar Sync: Operational
└─ [All 14 features...]

Integrations:
├─ OpenAI: Operational
├─ Hume API: Operational
├─ Suno API: Operational
├─ Spotify: Operational
├─ Google Calendar: Operational
├─ Zoom: Operational
└─ Firebase FCM: Operational
```

**Update Frequency**: Automatic every 5 minutes

---

## 5. Real-Time Monitoring Dashboard (War Room)

### For Deployment & Incident Response

**Create dashboard with**:

```
LIVE METRICS (Auto-refresh: 10 seconds)
├─ Current Error Rate
├─ Current Response Time (P95)
├─ Active Users (realtime)
├─ Requests/sec
├─ Database Query Time
└─ API Integration Status (green/red)

ALERTS (Auto-update)
├─ Active Alerts (count)
├─ Recent Alerts (last 10)
├─ Escalation Status
└─ On-Call Assignment

SYSTEM HEALTH
├─ CPU: [graph]
├─ Memory: [graph]
├─ Disk: [graph]
└─ Network: [graph]

DEPLOYMENT INFO
├─ Current Version: v1.0.0
├─ Deployment Time: [time]
├─ Deployed By: [name]
└─ Status: ✅ Healthy
```

**Access**: War room display or mobile-friendly URL

---

## 6. Weekly Health Report Automation

### Automated Report Generation

**Script**: `/scripts/generate-weekly-health-report.js`

```javascript
// Runs every Monday at 9 AM UTC

const generateWeeklyReport = async () => {
  const metrics = {
    uptime: await getUptime('last-7-days'),
    errorRate: await getErrorRate('last-7-days'),
    avgResponse: await getAvgResponseTime('last-7-days'),
    userGrowth: await getUserGrowth('last-7-days'),
    features: await getFeatureMetrics('last-7-days'),
    incidents: await getIncidents('last-7-days'),
    alerts: await getAlertsSummary('last-7-days'),
  };

  const report = {
    date: new Date(),
    weekStarting: getMonday(new Date()),
    metrics,
    trends: analyzeTrends(metrics),
    anomalies: detectAnomalies(metrics),
    recommendations: generateRecommendations(metrics),
  };

  // Send to team
  await sendSlack(report, '#health-reports');
  await sendEmail(report, 'team@emotionscare.com');

  // Save to database
  await saveReport(report);
};

// Schedule: 0 9 * * 1 (Monday 9 AM UTC)
```

---

## 7. Alert Escalation Workflow

### Multi-Stage Alert System

```
ALERT TRIGGERED
    ↓
P1 (Critical) → Immediate Slack
              → PagerDuty trigger
              → SMS to on-call
              → Phone call (if no response in 5 min)
              ↓
         Auto-escalate to VP Engineering if not acked in 15 min

P2 (High)    → Slack notification
             → PagerDuty alert (not urgent)
             → Digest email (5-minute batches)
             ↓
         Escalate if not acked in 1 hour

P3 (Medium)  → Slack notification
             → Digest email (hourly)
             → Daily report

P4 (Low)     → Daily digest email only
             → Slack weekly summary
```

### Escalation Contacts

```
Level 1: On-Call Engineer
  - PagerDuty assignment
  - 5-minute response target

Level 2: Engineering Lead
  - Notify if on-call cannot resolve
  - 15-minute escalation

Level 3: VP Engineering
  - Notify if critical issue impacts users
  - 30-minute escalation

Level 4: CEO/Founder
  - Notify if major outage (> 1 hour)
  - Complete information loss
  - Security breach
```

---

## 8. Custom Dashboard Queries

### Useful Sentry Queries

**Top Error Types (Last 24 Hours)**:
```sql
SELECT error_type, COUNT(*) as count
FROM events
WHERE timestamp > now() - interval '24 hours'
GROUP BY error_type
ORDER BY count DESC
LIMIT 10
```

**Error Rate by Feature**:
```sql
SELECT feature,
       COUNT(CASE WHEN status='error' THEN 1 END) / COUNT(*) as error_rate
FROM transactions
WHERE timestamp > now() - interval '1 hour'
GROUP BY feature
```

**P95 Response Time Trend**:
```sql
SELECT DATE_TRUNC('5 minutes', timestamp) as bucket,
       PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration) as p95
FROM transactions
WHERE timestamp > now() - interval '24 hours'
GROUP BY bucket
ORDER BY bucket
```

**User Impact of Errors**:
```sql
SELECT error_type,
       COUNT(DISTINCT user_id) as affected_users,
       COUNT(*) as total_occurrences
FROM events
WHERE timestamp > now() - interval '24 hours'
GROUP BY error_type
ORDER BY affected_users DESC
```

---

## 9. Dashboard Maintenance

### Weekly Maintenance Checklist

```
☐ Verify all widgets are updating correctly
☐ Check for any broken connections or data sources
☐ Review alert rule effectiveness
☐ Adjust thresholds based on recent metrics
☐ Archive old dashboards
☐ Update dashboard documentation
☐ Test alert notifications
☐ Review escalation workflows
```

### Monthly Deep Dive

```
☐ Analyze overall system health
☐ Identify trends and patterns
☐ Review alert noise (false positives)
☐ Adjust sensitivity of alerts
☐ Plan capacity upgrades if needed
☐ Review SLA compliance
☐ Update team on metrics
☐ Plan performance improvements
```

---

## 10. Team Access & Permissions

### Dashboard Access Matrix

| Role | Sentry | Supabase | Status | Custom |
|------|--------|----------|--------|--------|
| Engineering | Full | Full | Read | Full |
| DevOps | Full | Full | Read | Full |
| QA | Read | Read | Read | Read |
| Product | Read | Read | Read | Read |
| Security | Full | Full | Read | Full |
| Management | Read | Read | Read | Read |
| On-Call | Full | Full | Read | Full |

### Share Dashboard Links

```
Internal Monitoring:
- War Room: [link to real-time dashboard]
- Weekly Report: [link to weekly email]
- Historical Trends: [link to analytics]

Team Documentation:
- Metrics Glossary: [link]
- Alert Meanings: [link]
- Troubleshooting: [link]
```

---

## Monitoring Checklist

Before declaring deployment successful:

**Sentry Setup**:
- [ ] Dashboard created with 8+ widgets
- [ ] 14 alert rules configured
- [ ] Slack integration tested
- [ ] PagerDuty integration tested
- [ ] Email notifications working

**Metrics Dashboard**:
- [ ] All key metrics visible
- [ ] Performance metrics tracked
- [ ] Feature metrics visible
- [ ] Infrastructure metrics monitored
- [ ] API integration status shown

**Infrastructure**:
- [ ] Supabase monitoring active
- [ ] System health dashboard ready
- [ ] Backup status visible
- [ ] Database performance tracked
- [ ] Storage usage monitored

**Status Page**:
- [ ] Public status page live
- [ ] All components listed
- [ ] Automatic updates working
- [ ] Historical uptime visible
- [ ] Incident history shown

**Real-Time**:
- [ ] War room dashboard ready
- [ ] Live metrics updating
- [ ] Alert notifications working
- [ ] Escalation paths clear
- [ ] Team trained on system

**Automation**:
- [ ] Weekly reports generating
- [ ] Alert escalation working
- [ ] Notifications sending
- [ ] Data retention configured
- [ ] Backup verification running

---

## Quick Links

**Sentry**: https://sentry.io/projects/emotionscare/
**Supabase**: https://app.supabase.io/projects
**Status Page**: https://status.emotionscare.com
**War Room**: [internal dashboard URL]

---

**Document Created**: 2025-11-14
**Status**: Ready for implementation
**Setup Time**: ~2-3 hours for full implementation

Start with Sentry setup first, then expand to other platforms.

