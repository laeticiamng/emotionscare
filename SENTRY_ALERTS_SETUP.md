# 🚨 Sentry Alerts Configuration Guide

Complete guide for setting up production-ready alerting in Sentry for EmotionsCare.

## Overview

This guide covers:
- Alert rule creation in Sentry UI
- Slack and PagerDuty integration
- Email digest configuration
- Performance metric monitoring
- Alert response procedures

## Prerequisites

- [ ] Sentry project created and configured
- [ ] Slack workspace with admin access
- [ ] PagerDuty account (optional, for critical alerts)
- [ ] Email relay configured
- [ ] `VITE_SENTRY_DSN` environment variable set

## Part 1: Sentry UI Configuration

### 1.1 Navigate to Alert Rules

1. Go to [Sentry Project Settings](https://sentry.io/settings/emotionscare/projects/)
2. Click on your project
3. Go to **Alerts > Alert Rules**
4. Click **Create Alert Rule**

### 1.2 Create Error Rate Alerts

#### Alert: High Error Rate (5%)

```
Rule Name: High Error Rate (5%)
Condition:
  - For the environment(s): production
  - When: The issue is: any issue
  - And: error rate is > 5%
  - Within the last 5 minutes

Actions:
  - Send notification to: #alerts-critical, PagerDuty
  - Severity: Critical
  - Repeat notifications: every 30 minutes if condition persists
```

**Setup Steps:**
1. Click "Create Alert Rule"
2. Name: "High Error Rate (5%)"
3. Set condition: `error_rate > 5%`
4. Time window: 5 minutes
5. Add action: Slack notification to #alerts-critical
6. Add action: PagerDuty trigger
7. Save

#### Alert: Medium Error Rate (2%)

```
Rule Name: Medium Error Rate (2%)
Condition:
  - Environment: production
  - Error rate > 2%
  - Within 5 minutes

Actions:
  - Send to: #alerts-errors, email
  - Severity: Warning
```

### 1.3 Create Performance Alerts

#### Alert: P95 Response Time > 3s

```
Rule Name: P95 Response Time > 3s
Condition:
  - For environment: production
  - When: Transaction duration 95th percentile > 3000ms
  - Within the last 10 minutes

Actions:
  - Slack: #alerts-performance
  - Email: ops@emotionscare.com
  - Severity: Warning
```

**Setup Steps:**
1. Go to Alerts > Alert Rules
2. Create new rule
3. Set metric: `transaction.duration.percentile_95`
4. Operator: `>`
5. Value: `3000` (milliseconds)
6. Add Slack action
7. Save

#### Alert: P99 Response Time > 5s

```
Rule Name: P99 Response Time > 5s
Condition:
  - Environment: production
  - Transaction duration p99 > 5000ms
  - Within 10 minutes

Actions:
  - Slack: #alerts-critical
  - PagerDuty: on-call team
  - Email: ops@emotionscare.com
  - Severity: Critical
```

### 1.4 Create Web Vitals Alerts

#### Alert: LCP Degradation

```
Rule Name: LCP Degradation (> 2.5s)
Condition:
  - Environment: production
  - Measurement: LCP > 2500ms
  - 50+ occurrences in 5 minutes

Actions:
  - Slack: #alerts-performance
  - Email: frontend-team@emotionscare.com
```

#### Alert: CLS Degradation

```
Rule Name: CLS Degradation (> 0.1)
Condition:
  - Environment: production
  - Measurement: CLS > 0.1
  - 20+ occurrences in 5 minutes

Actions:
  - Slack: #alerts-performance
```

### 1.5 Create Critical Exception Alerts

#### Alert: Database Errors

```
Rule Name: Database Connection Errors
Condition:
  - For environment: production
  - When: error message contains: "database" OR "postgres" OR "connection"
  - Any issue
  - 3+ occurrences in 5 minutes

Actions:
  - Slack: #alerts-critical
  - PagerDuty: immediate escalation
  - Email: ops@emotionscare.com
```

**Setup Steps (Advanced):**
1. Create rule
2. Condition Type: "When": Basic
3. Select condition: "Error message" contains
4. Value: `database|postgres|connection` (regex)
5. Threshold: 3+ events
6. Time window: 5 minutes
7. Add critical actions

#### Alert: Authentication Errors

```
Rule Name: Authentication Failures
Condition:
  - Error message contains: "auth" OR "unauthorized" OR "401" OR "403"
  - 10+ occurrences in 5 minutes
  - Environment: production

Actions:
  - Slack: #alerts-errors
  - Email: security@emotionscare.com
```

#### Alert: Critical API Integration Failures

```
Rule Name: Critical API Failures
Condition:
  - Error message contains: "supabase" OR "openai" OR "hume" OR "spotify" OR "zoom"
  - Environment: production
  - 2+ occurrences in 5 minutes

Actions:
  - Slack: #alerts-critical
  - PagerDuty: on-call
  - Email: ops@emotionscare.com
```

### 1.6 Create Volume-Based Alerts

#### Alert: High Request Volume

```
Rule Name: Requests > 1000/min
Condition:
  - For environment: production
  - When: Request volume > 1000 per minute
  - Within the last minute

Actions:
  - Slack: #alerts-general
  - Monitor: May indicate DDoS or traffic spike
```

## Part 2: Slack Integration

### 2.1 Install Slack App

1. Go to **Settings > Integrations > Slack**
2. Click **Add Integration**
3. Choose your Slack workspace
4. Click **Allow** to authorize
5. Select default channel (or override per alert)

### 2.2 Create Slack Channels

Create these channels in your Slack workspace:

```
#alerts-critical     - Only P0/P1 incidents
#alerts-errors       - All errors and exceptions
#alerts-performance  - Performance degradation
#alerts-general      - Info and warnings
```

### 2.3 Configure Channel Mappings

In each alert rule, specify the target channel:

```
Critical Error → #alerts-critical
Performance Alert → #alerts-performance
Database Error → #alerts-critical
API Failure → #alerts-critical
Warning → #alerts-general
```

### 2.4 Slack Message Format

Configure Slack notification template:

```
Alert: {alert_name}
Severity: {severity}
Environment: {environment}
Message: {error_message}

Affected Users: {user_count}
Occurrences: {event_count}
First Seen: {first_seen}
Latest: {latest_timestamp}

[View in Sentry] {sentry_link}
```

## Part 3: PagerDuty Integration

### 3.1 Install PagerDuty App

1. Go to **Settings > Integrations > PagerDuty**
2. Click **Add Integration**
3. Sign in to your PagerDuty account
4. Authorize Sentry
5. Select your PagerDuty service

### 3.2 Configure Service Integration

In PagerDuty, go to **Services > EmotionsCare**:

1. **Integrations tab**: Verify Sentry integration is active
2. **Escalation Policy**: Set on-call team
3. **Incident Settings**:
   - Auto-resolve incidents: Disabled (require manual resolution)
   - Urgency: High for all Sentry incidents

### 3.3 Create PagerDuty Escalation

```
Escalation Policy: Sentry Critical

Level 1 (5 min): Primary On-Call Engineer
Level 2 (5 min): Secondary On-Call Engineer
Level 3 (5 min): Engineering Lead
```

### 3.4 Link Critical Alerts to PagerDuty

Configure these alerts to trigger PagerDuty:

- High Error Rate (5%)
- Database Connection Errors
- Service Availability < 99.5%
- Critical API Failures
- P99 Response Time > 5s

## Part 4: Email Configuration

### 4.1 Enable Email Digest

1. Go to **Settings > Email**
2. Set preferred frequency:
   - Daily digest: 9 AM UTC
   - Weekly digest: Monday 9 AM UTC
3. Recipients: `ops@emotionscare.com`

### 4.2 Configure Digest Content

Include in email:
- [ ] Error rate summary
- [ ] Top errors (5-10)
- [ ] Performance metrics
- [ ] Web vitals
- [ ] Users affected
- [ ] Release notes

### 4.3 Threshold-Based Emails

Create rules for automated emails when thresholds exceed:

```
If error_rate > 5% in 1 hour → Email ops team immediately
If response_time_p95 > 3s for 30 min → Email performance team
If uptime < 99.5% → Email on-call engineer
```

## Part 5: Metric Thresholds

### 5.1 Response Time Thresholds

| Percentile | Warning | Critical |
|------------|---------|----------|
| P50        | 500ms   | 1000ms   |
| P95        | 1000ms  | 3000ms   |
| P99        | 2000ms  | 5000ms   |

### 5.2 Web Vitals Thresholds

| Metric | Good    | Warning | Poor   |
|--------|---------|---------|--------|
| LCP    | < 2.5s  | 2.5-4s  | > 4s   |
| FID    | < 100ms | 100-300 | > 300  |
| CLS    | < 0.1   | 0.1-0.25| > 0.25 |

### 5.3 Error Rate Thresholds

| Level      | Threshold | Action          |
|------------|-----------|-----------------|
| Normal     | < 1%      | Monitor         |
| Warning    | 1-2%      | Alert           |
| Critical   | > 5%      | PagerDuty alert |

## Part 6: Alert Response Procedures

### 6.1 On-Call Runbook

When you receive a **#alerts-critical** notification:

1. **Immediate (0-2 min)**
   - [ ] Acknowledge the alert in Slack
   - [ ] Click link to open Sentry
   - [ ] Note the affected service and error message

2. **Assessment (2-5 min)**
   - [ ] Check if issue is:
     - New (first occurrence)
     - Regression (appeared recently)
     - Known (ongoing issue)
   - [ ] Get affected user count
   - [ ] Check error rate trend (increasing/decreasing)

3. **Escalation (if needed)**
   - [ ] If database error: Contact DBA/backend team
   - [ ] If API error: Contact integration owner
   - [ ] If performance: Contact frontend team
   - [ ] If unknown: Escalate to engineering lead

4. **Resolution (ongoing)**
   - [ ] Update Sentry issue with status
   - [ ] Post updates to Slack
   - [ ] Create incident in incident tracker
   - [ ] Document root cause

### 6.2 Alert Fatigue Prevention

To avoid alert fatigue:

- [ ] Set appropriate thresholds (avoid too sensitive)
- [ ] Use time windows (5-10 min, not 1 min)
- [ ] Require minimum occurrences (2-3+ events)
- [ ] Exclude known false positives
- [ ] Review alert rules monthly
- [ ] Disable resolved issues from retriggering within 1 hour

### 6.3 False Positive Handling

If an alert fires but is not a real issue:

1. In Sentry, mark issue as "Resolved"
2. Add comment: "False positive: [reason]"
3. In alert rule, add filter to prevent similar false positives
4. Review and adjust threshold if needed

## Part 7: Monitoring Dashboard

### 7.1 Create Custom Dashboard

Go to **Dashboards > Create Dashboard**

Add these widgets:

```
Row 1: Real-time Metrics
  - Error Rate (last 24h)
  - Request Volume (last 24h)
  - Response Time P95
  - Active Users

Row 2: Web Vitals
  - LCP Distribution
  - CLS Distribution
  - FID Distribution

Row 3: Top Issues
  - Top 10 Issues (by frequency)
  - Top 10 Issues (by impact)

Row 4: Performance
  - Slowest Transactions
  - Most Failed Endpoints
  - Release Comparison
```

### 7.2 Set Up Threshold Indicators

Configure alerts to show:
- 🟢 Green (healthy): Below threshold
- 🟡 Yellow (warning): Between warning and critical
- 🔴 Red (critical): Above critical threshold

## Part 8: Testing Alerts

### 8.1 Test Error Rate Alert

```bash
# Simulate error spike
curl -X POST https://staging.emotionscare.com/test/trigger-error
```

Verify:
- [ ] Sentry captures error
- [ ] Alert rule triggers within 5 min
- [ ] Slack notification sent
- [ ] PagerDuty incident created

### 8.2 Test Performance Alert

```bash
# Load test to trigger P95 > 3s
k6 run tests/load/k6-staging-tests.js
```

Verify:
- [ ] Sentry shows increased response times
- [ ] Performance alert triggers
- [ ] Performance Slack channel notified

### 8.3 Test Slack Integration

In Sentry:
1. Go to **Settings > Integrations > Slack**
2. Click **Test** button
3. Verify test message appears in #alerts-general

### 8.4 Test PagerDuty Integration

1. Go to **Settings > Integrations > PagerDuty**
2. Click **Send Test Incident**
3. Check PagerDuty service for test incident

## Part 9: Environment Variables

Add these to your `.env.staging` and `.env.production`:

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your_key@o123456.ingest.sentry.io/789012
VITE_SENTRY_ENVIRONMENT=staging
VITE_SENTRY_TRACES_SAMPLE_RATE=0.2
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# PagerDuty (optional)
VITE_PAGERDUTY_SERVICE_ID=P1234567

# Alert Recipients
VITE_ALERT_EMAIL_RECIPIENTS=ops@emotionscare.com,devops@emotionscare.com

# Slack Alert Channels (for webhook integrations)
VITE_SLACK_ALERTS_WEBHOOK_URL=https://hooks.slack.com/...
```

## Part 10: Monthly Review Checklist

Every month, review your alerts:

- [ ] Alert rule coverage (all critical services covered?)
- [ ] Threshold appropriateness (too sensitive? not sensitive enough?)
- [ ] False positive rate (< 10%?)
- [ ] Response time (avg time to resolve < 1 hour?)
- [ ] Team feedback (any suggestions for improvement?)
- [ ] New services or endpoints to monitor?
- [ ] Deprecated alert rules to remove?
- [ ] Integrations working? (Slack, PagerDuty, email)

## Troubleshooting

### Alert Not Triggering

1. Check alert rule is "Enabled"
2. Verify condition matches actual issues
3. Check time window (default 5 min)
4. Review threshold (may be too high)
5. Test manually: `curl -X POST {endpoint}/test/trigger-error`

### Missing Slack Notifications

1. Verify Slack integration is configured
2. Check channel permissions (bot has access)
3. Test integration: Settings > Integrations > Slack > Test
4. Check Sentry logs for webhook errors

### PagerDuty Not Creating Incidents

1. Verify PagerDuty service integration active
2. Check escalation policy configured
3. Test integration: Settings > Integrations > PagerDuty > Test
4. Ensure on-call users are scheduled

### Email Digest Not Received

1. Check email configured in Settings > Email
2. Verify email address is correct
3. Check spam/junk folder
4. Test: Create a test issue and check email

## References

- [Sentry Alert Rules Documentation](https://docs.sentry.io/alerts/)
- [Sentry Slack Integration](https://docs.sentry.io/integrations/slack/)
- [PagerDuty Integration](https://docs.sentry.io/integrations/pagerduty/)
- [Custom Alert Rules](https://docs.sentry.io/alerts/create-alerts/)

## Support

For issues or questions:
1. Check [Sentry Status Page](https://status.sentry.io/)
2. Review [Sentry Community](https://discord.gg/sentry)
3. Contact support@sentry.io

---

**Last Updated**: 2025-11-14
**Version**: 1.0.0
**Status**: Production Ready
