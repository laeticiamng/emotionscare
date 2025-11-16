# 📋 Service Level Agreement (SLA)

EmotionsCare Production Service Level Agreement and commitment.

## Overview

This SLA defines the performance and availability targets for EmotionsCare production services. The SLA applies to all production environments and serves as a contractual commitment to users and stakeholders.

**Effective Date**: 2025-11-14
**Version**: 1.0.0
**Review Cycle**: Quarterly

---

## 1. Service Availability

### Availability Target
```
Target Uptime: 99.9%
Per Month Allowance: 43.2 minutes of downtime
Per Year Allowance: 8.76 hours of downtime
```

### Availability Definition
Service is considered available when:
- Application responds to HTTP requests
- Core features accessible (authentication, journal, meditation)
- Error rate < 5% on service requests
- Response time P95 < 3 seconds

### Availability Exclusions
Scheduled maintenance, customer configurations, and external service failures are not counted toward SLA violations.

### Measurement
- Monitored from multiple geographic regions
- Measured every minute
- Monthly aggregation and reporting

---

## 2. Performance Targets

### Response Time

| Percentile | Target | Measurement |
|-----------|--------|-------------|
| P50       | < 500ms | Typical user experience |
| P95       | < 1000ms | 95% of users see < 1s |
| P99       | < 3000ms | 99% of users see < 3s |

**Exclusions**:
- External API calls (OpenAI, Spotify, Hume)
- Large file uploads/downloads
- Initial page load (time to first byte)

### Core Web Vitals

| Metric | Good | Target | Poor |
|--------|------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | < 2.0s | > 4s |
| FID (First Input Delay) | < 100ms | < 50ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 | > 0.25 |

### Error Rate

| Severity | Target | Action |
|----------|--------|--------|
| P1 (Critical) | 0% | Page down → P1 incident |
| P2 (High) | < 0.5% | Major feature broken → Escalate |
| P3 (Medium) | < 2% | Non-critical issue → Monitor |
| P4 (Low) | < 5% | Warnings/errors → Track |

---

## 3. Feature-Specific SLAs

### Authentication Service
```
Availability: 99.99%
Response Time: < 500ms (P95)
Failure Impact: User cannot login
Priority: P1 - Highest
```

### Journal Service
```
Availability: 99.9%
Response Time: < 1000ms (P95)
Failure Impact: Cannot create/read entries
Priority: P2
```

### Meditation Service
```
Availability: 99.9%
Response Time: < 1000ms (P95)
Failure Impact: Cannot start sessions
Priority: P2
```

### Music Recommendations
```
Availability: 95% (external API dependency)
Response Time: < 2000ms (P95)
Failure Impact: No music, but app still works
Priority: P3
```

### Integrations (Spotify, Google, Zoom)
```
Availability: 90% (relies on external services)
Response Time: < 3000ms (P95)
Failure Impact: Feature unavailable, fallback provided
Priority: P3-P4
```

---

## 4. Support & Response Times

### Incident Severity & Response

| Severity | Definition | Response Target | Resolution Target |
|----------|-----------|-----------------|------------------|
| P1 - Critical | Service down, all users affected | 5 minutes | 4 hours |
| P2 - High | Major feature broken, significant impact | 15 minutes | 8 hours |
| P3 - Medium | Feature partially broken, workaround available | 1 hour | 24 hours |
| P4 - Low | Minor issue, no user impact | 24 hours | 1 week |

### Support Channels

**24/7 Support Available For**:
- P1 incidents (production outage)
- P2 incidents (major feature down)
- Security issues

**Business Hours Support** (Mon-Fri, 9 AM-5 PM UTC):
- P3 incidents
- Feature requests
- General questions

**Contact Methods**:
1. Slack: #incidents (priority)
2. Email: support@emotionscare.com
3. Phone: +1-XXX-XXX-XXXX (P1 only)

---

## 5. Maintenance Windows

### Scheduled Maintenance

**Scheduled Maintenance Window**:
- Sunday 2:00 AM - 3:00 AM UTC
- Announced 1 week in advance
- Exempt from SLA calculations

**Maintenance Frequency**:
- Database: 1st Sunday of month
- Application: 2nd Sunday of month
- Infrastructure: As needed (announced)

**Notice Policy**:
- Planned maintenance: 7 days notice
- Security patches: 24-48 hours notice
- Emergency maintenance: Immediate (with notification)

### Expected Downtime During Maintenance
- Typical duration: 15-30 minutes
- Maximum duration: 60 minutes
- If exceeds 60 minutes → P1 incident procedure

---

## 6. Backup & Disaster Recovery

### Backup Schedule

```
Database:
- Frequency: Every 6 hours
- Retention: 7 days
- Recovery Time Objective (RTO): 1 hour
- Recovery Point Objective (RPO): < 30 minutes

Files:
- Frequency: Real-time replication
- Retention: 30 days with versioning
- RTO: < 15 minutes
- RPO: < 1 minute
```

### Disaster Recovery Commitments

```
If Data Loss Occurs:
- Notify customers within 24 hours
- Restore from backup (< 1 hour)
- Verify data integrity
- Communicate recovery status daily

If Extended Outage (> 4 hours):
- Full incident postmortem
- Service credits applied
- Process improvements documented
```

---

## 7. Service Credits

For violations of the SLA, the following service credits apply:

### Monthly Uptime Credit

| Uptime Achieved | Service Credit |
|-----------------|----------------|
| 99.0% - 99.9% | 10% of monthly fee |
| 98.0% - 98.9% | 25% of monthly fee |
| 97.0% - 97.9% | 50% of monthly fee |
| < 97.0% | 100% of monthly fee |

### Credit Eligibility
- Credits issued automatically
- Applied as account credit
- Expires after 30 days if unused
- Requires incident documentation
- No additional penalties

### Maximum Credits
Total credits capped at 100% of monthly service fee. Multiple incidents in same month don't exceed cap.

---

## 8. Performance Monitoring

### Monitoring Tools
```
Sentry:
- Real-time error tracking
- Performance monitoring
- Release comparison
- Alert configuration

Lighthouse CI:
- Performance scoring
- Accessibility audit
- Best practices check
- SEO validation

K6:
- Load testing
- Stress testing
- Spike testing
- Endpoint validation

Custom Dashboards:
- Real-time metrics
- Historical trends
- Anomaly detection
- Business metrics
```

### Reporting

**Daily Report** (automated):
```
- Uptime percentage
- Error count
- Response time (P50, P95, P99)
- Top errors
- User impact
```

**Weekly Report** (manual):
```
- Uptime summary
- Performance trends
- Incidents summary
- Maintenance completed
- Planned maintenance
```

**Monthly Report** (detailed):
```
- SLA compliance
- Service credits (if applicable)
- Performance metrics
- Incident analysis
- Security events
- Customer feedback
```

---

## 9. Incident Management

### Incident Classification

**P1 - Critical**
- Service completely unavailable
- All users affected
- Revenue impact immediate
- Security breach
- Data loss

**P2 - High**
- Major feature unavailable
- Significant user impact
- Workaround available
- Performance severely degraded
- Non-critical data at risk

**P3 - Medium**
- Feature partially broken
- Limited user impact
- Workaround available
- Performance slightly degraded
- Cosmetic issue

**P4 - Low**
- Minor issue
- No user impact
- Non-urgent
- Can wait until next release
- Cosmetic bug

### Escalation Path

```
P1 Incident:
1. On-call engineer responds (< 5 min)
2. Team lead alerted (< 10 min)
3. Engineering lead engaged (< 15 min)
4. Customer notified (< 30 min)
5. Status updates every 15 minutes

P2 Incident:
1. On-call engineer responds (< 15 min)
2. Team lead alerted (< 30 min)
3. Customer notified (< 1 hour)
4. Status updates every 30 minutes

P3/P4 Incidents:
1. Assigned to available engineer
2. Internal notification
3. Status updates daily
```

---

## 10. Compliance & Certifications

### Security Compliance
- GDPR compliant
- CCPA compliant
- SOC 2 Type II (in progress)
- HIPAA ready (available upon request)

### Data Residency
- Data stored in: US region (Virginia)
- Backup region: US region (Oregon)
- Data never leaves US (configurable)
- GDPR compliance via standard clauses

### Privacy
- No data sold to third parties
- User data encrypted at rest
- Minimal data collection
- User data deletion available
- Annual privacy audit

---

## 11. Acceptable Use Policy

### Prohibited Activities
```
Users agree NOT to:
- Attempt to disrupt service
- Reverse engineer the system
- Perform DDoS attacks
- Scrape data without permission
- Automate account creation
- Share accounts with unlimited users
- Use for illegal purposes
- Bypass authentication
```

### Rate Limiting Enforced
```
API Rate Limits:
- Authenticated: 100 req/min per user
- Anonymous: 10 req/min per IP
- File uploads: 100MB/day per user
- Realtime connections: 10 concurrent per user

Violations Result In:
- Temporary rate limiting
- Account suspension (repeated)
- Legal action (malicious)
```

---

## 12. Service Limitation & Disclaimer

### Limitations

1. **No Warranty for External Services**
   - Third-party APIs may have outages
   - Spotify, Google, Zoom availability not guaranteed
   - Fallback features provided when possible

2. **No Liability for**
   - User data loss (backed up daily)
   - Network issues outside our control
   - Customer misconfiguration
   - Data deleted per user request

3. **No Guarantee of**
   - Specific feature availability date
   - Feature compatibility with future services
   - Integration with specific third parties

### Responsibility

**Our Responsibility**:
- Maintain infrastructure
- Provide backups
- Monitor systems
- Respond to incidents
- Comply with regulations

**Customer Responsibility**:
- Use service legally
- Protect account credentials
- Comply with terms
- Report security issues
- Maintain backup of important data

---

## 13. Communication & Transparency

### Status Page
```
Public Status: https://status.emotionscare.com

Displays:
- System status (operational/degraded/down)
- Current incidents
- Scheduled maintenance
- Historical data (99-day graph)
- Component status
```

### Incident Notifications

**During Incident**:
```
- Initial notification: < 30 minutes
- Status updates: Every 15-30 minutes
- Resolution notification: Immediate
- Post-mortem: Within 24 hours
```

**Notification Channels**:
- Email to registered addresses
- Slack to #incidents
- SMS for P1 incidents (if opted in)
- In-app notification

### Postmortem Process
```
1. Incident declared resolved
2. Timeline documented
3. Root cause analysis
4. Contributing factors identified
5. Action items assigned
6. Prevention measures planned
7. Report shared with customers (optional)
8. Follow-up verification (1 week)
```

---

## 14. SLA Changes

### Amendment Process
1. 30-day notice of any changes
2. Material changes require agreement
3. Annual review and adjustment
4. Published on website

### Contact Information
```
Billing Questions: billing@emotionscare.com
Technical Support: support@emotionscare.com
Security Issues: security@emotionscare.com
Incident Escalation: incidents@emotionscare.com

Mailing Address:
EmotionsCare Support
[Company Address]
[City, State, ZIP]
```

---

## 15. SLA Dashboard

### Real-Time Metrics Available

```
Last 24 Hours:
✓ Uptime percentage
✓ Error rate trend
✓ Response time P95
✓ Active users
✓ API health
✓ Database health

Last 30 Days:
✓ Monthly uptime
✓ Service credits earned
✓ Incidents count
✓ Maintenance windows
✓ Performance trends
```

Access at: `https://emotionscare.com/dashboard/sla`

---

## 16. Escalation Contacts

### On-Call Schedule
```
Primary On-Call: Available 24/7/365
Backup On-Call: Available for hand-off
Manager On-Call: Available for P1 escalation

Check PagerDuty for current assignment:
https://emotionscare.pagerduty.com
```

### Direct Escalation (P1 Only)
```
CEO: [contact]
VP Engineering: [contact]
VP Operations: [contact]

Emergency Line: +1-XXX-XXX-XXXX
```

---

## 17. Continuous Improvement

### Quarterly SLA Review
- Analyze uptime data
- Review incidents
- Update targets if needed
- Share learnings

### Annual SLA Assessment
- Industry benchmarking
- Customer feedback
- Technology updates
- Market analysis
- Update agreement

---

## 18. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-14 | Initial SLA |

---

## Acceptance

By using EmotionsCare, you agree to this SLA.

**Effective Date**: 2025-11-14
**Status**: 🟢 Active - All Production Services

---

**For questions about this SLA**: support@emotionscare.com
**Last Updated**: 2025-11-14
**Next Review**: 2026-02-14 (Q1)
