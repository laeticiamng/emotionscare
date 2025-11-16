# ✅ Pre-Deployment Checklist

Complete checklist for pre-deployment verification before pushing to production.

## Pre-Deployment Checklist - Final Review

**Date**: _______________
**Version**: _______________
**Deployment Type**: ☐ Staging  ☐ Production
**Reviewer**: _______________
**Approver**: _______________

---

## Phase 1: Code Quality & Testing (1 hour)

### Code Review
- [ ] All PRs reviewed and approved
- [ ] No TODO comments in production code
- [ ] No console.log() statements (except for errors)
- [ ] No hardcoded credentials or API keys
- [ ] No debugging code left in
- [ ] Code follows project style guide

### Testing
- [ ] Unit tests passing: `npm run test`
- [ ] E2E tests passing: `npm run test:e2e`
- [ ] No test warnings or errors
- [ ] Test coverage adequate (aim for > 80%)
- [ ] All critical paths tested

### Build Verification
- [ ] Production build successful: `npm run build`
- [ ] No build warnings
- [ ] Bundle size acceptable (< 500KB for main bundle)
- [ ] Source maps included for debugging
- [ ] All assets optimized (images, fonts)

### Dependencies
- [ ] No security vulnerabilities: `npm audit`
- [ ] No outdated critical dependencies
- [ ] All dependencies locked: `package-lock.json` committed
- [ ] No unused dependencies
- [ ] No duplicate dependencies

---

## Phase 2: Environment Configuration (30 min)

### Environment Variables
- [ ] All required env vars documented in .env.example
- [ ] No example values in production env vars
- [ ] Secrets stored securely (not in git)
- [ ] Environment-specific configs separate
- [ ] API endpoints correct for environment:
  - [ ] Supabase URL
  - [ ] OpenAI API endpoint
  - [ ] Hume API endpoint
  - [ ] Spotify/Google/Zoom endpoints

### Database Configuration
- [ ] Database backup taken recently (< 24h)
- [ ] Database migrations reviewed and tested
- [ ] Connection pooling configured
- [ ] RLS policies in place and tested
- [ ] Data retention policies configured

### API Integration Configuration
- [ ] All API keys configured and tested:
  - [ ] OpenAI (GPT-4, Whisper, Vision)
  - [ ] Hume API
  - [ ] Suno API
  - [ ] Spotify OAuth
  - [ ] Google OAuth
  - [ ] Zoom API
  - [ ] Firebase FCM
  - [ ] Resend (email)
- [ ] Rate limiting configured
- [ ] Error handling for API failures
- [ ] Fallback mechanisms in place

### Monitoring & Alerting Configuration
- [ ] Sentry DSN configured
- [ ] Sentry alert rules active (14 rules)
- [ ] Slack integration tested
- [ ] PagerDuty integration tested
- [ ] Email notifications configured
- [ ] Dashboards accessible and ready

---

## Phase 3: Security Review (1 hour)

### Security Checks
- [ ] No hardcoded passwords
- [ ] No API keys in code
- [ ] No PII in logs
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection protection verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

### Data Protection
- [ ] Encryption in transit (TLS 1.3)
- [ ] Encryption at rest enabled
- [ ] Passwords hashed properly
- [ ] Session tokens secure
- [ ] Sensitive fields encrypted
- [ ] PII redaction in logs verified

### Access Control
- [ ] Authentication working
- [ ] Authorization (RLS) tested
- [ ] Admin access restricted
- [ ] Support access logged
- [ ] MFA required for privileged operations
- [ ] API rate limiting in place

### Compliance
- [ ] GDPR compliance verified
- [ ] CCPA compliance verified
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Consent management working
- [ ] Data retention policy in place

---

## Phase 4: Performance & Load Testing (1.5 hours)

### Frontend Performance
- [ ] Lighthouse score > 85 (Performance)
- [ ] Lighthouse score > 85 (Accessibility)
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] No layout thrashing
- [ ] Images optimized
- [ ] Code splitting working

### Backend Performance
- [ ] API endpoints < 200ms (P95)
- [ ] No N+1 queries
- [ ] Database queries optimized
- [ ] Connection pooling working
- [ ] Cache headers configured
- [ ] CDN caching enabled

### Load Testing
- [ ] K6 load test completed
- [ ] Load test passed thresholds:
  - [ ] P95 response < 1000ms
  - [ ] Error rate < 1%
- [ ] No memory leaks detected
- [ ] Database connections stable
- [ ] Cache invalidation working

### Monitoring Setup
- [ ] Sentry performance monitoring active
- [ ] Response time tracking enabled
- [ ] Error rate tracking enabled
- [ ] Custom metrics configured
- [ ] Alerts configured for thresholds

---

## Phase 5: Deployment Readiness (1 hour)

### Staging Validation
- [ ] Application deployed to staging
- [ ] All smoke tests passed
- [ ] Health checks passing:
  - [ ] / (homepage)
  - [ ] /api/health (API)
  - [ ] /api/database-health (database)
- [ ] Features working in staging
- [ ] Data looks correct
- [ ] No staging-specific errors

### Deployment Plan
- [ ] Deployment strategy chosen:
  - [ ] Blue-Green (recommended)
  - [ ] Canary (gradual)
  - [ ] Standard
- [ ] Rollback plan documented
- [ ] Team briefed on plan
- [ ] On-call engineer assigned
- [ ] Team lead available for escalation

### Communication Plan
- [ ] Slack channels ready (#releases, #incidents)
- [ ] Status page updated
- [ ] User notifications prepared (if needed)
- [ ] Support team briefed
- [ ] Emergency contacts listed

---

## Phase 6: Team Preparation (30 min)

### Team Readiness
- [ ] Team lead approved deployment
- [ ] On-call engineer confirmed
- [ ] Backup on-call available
- [ ] Team trained on incident response
- [ ] Runbooks reviewed and accessible
- [ ] Post-mortem process understood

### Documentation
- [ ] Deployment guide reviewed
- [ ] Rollback procedures known
- [ ] Incident response procedures known
- [ ] Health check URLs known
- [ ] Escalation contacts documented
- [ ] Emergency procedures briefed

### Monitoring Access
- [ ] Sentry dashboard accessible
- [ ] Slack notifications working
- [ ] PagerDuty alerts working
- [ ] Status page accessible
- [ ] Log aggregation working
- [ ] Metrics dashboards ready

---

## Phase 7: Final Safety Checks (30 min)

### No Last-Minute Changes
- [ ] No code changes < 2 hours before deployment
- [ ] All changes reviewed and tested
- [ ] No experimental features enabled
- [ ] No breaking changes to APIs
- [ ] No database migrations pending

### Backup Verification
- [ ] Recent database backup exists
- [ ] Backup is restorable (tested)
- [ ] File storage backed up
- [ ] Backup location secured
- [ ] Disaster recovery plan available

### Emergency Procedures Verified
- [ ] Rollback procedure tested
- [ ] Database recovery procedure known
- [ ] Incident escalation path clear
- [ ] Communication channels working
- [ ] Team knows who to contact

### Production Environment Validated
- [ ] All infrastructure online
- [ ] Database responding
- [ ] File storage accessible
- [ ] CDN working
- [ ] All third-party services operational

---

## Phase 8: Go/No-Go Decision (15 min)

### Final Assessment

**Code Quality**: ☐ GO  ☐ NO-GO
- Notes: ___________________________________________________

**Testing**: ☐ GO  ☐ NO-GO
- Notes: ___________________________________________________

**Security**: ☐ GO  ☐ NO-GO
- Notes: ___________________________________________________

**Performance**: ☐ GO  ☐ NO-GO
- Notes: ___________________________________________________

**Infrastructure**: ☐ GO  ☐ NO-GO
- Notes: ___________________________________________________

**Team Readiness**: ☐ GO  ☐ NO-GO
- Notes: ___________________________________________________

### Overall Decision

**GO/NO-GO**: ☐ GO  ☐ NO-GO

**If NO-GO, reason**:
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**If NO-GO, resolution plan**:
```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________

Timeline to resolve: _______________
Re-assessment date: _______________
```

---

## Deployment Sign-Off

**I confirm that this deployment has been reviewed and is ready to proceed.**

**Code Owner**: _________________________ Date: _________
**QA Lead**: _________________________ Date: _________
**DevOps Lead**: _________________________ Date: _________
**Engineering Lead**: _________________________ Date: _________
**Product Owner**: _________________________ Date: _________

---

## Risk Assessment

### High Risk Items
```
☐ Major feature deployment
☐ Database migration
☐ Infrastructure change
☐ Third-party integration
☐ Security-critical changes
☐ Performance-critical changes
```

**If any high-risk items checked, extra review required:**
- [ ] Architecture review completed
- [ ] Performance testing completed
- [ ] Security audit completed
- [ ] Load testing completed
- [ ] Rollback plan extensively tested

### Known Issues
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

**Mitigation for known issues**:
```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
```

---

## Post-Deployment Monitoring Plan

### First 15 Minutes
- [ ] Monitor Sentry errors in real-time
- [ ] Check response times trending normal
- [ ] Verify no user complaints in Slack
- [ ] Check system health endpoints

### First Hour
- [ ] Error rate should be < 0.5%
- [ ] Response times P95 < 1000ms
- [ ] No database connection issues
- [ ] API integrations working
- [ ] File storage functioning

### First 24 Hours
- [ ] Monitor for degradation
- [ ] Check business metrics
- [ ] Verify backups running
- [ ] Review monitoring dashboards daily
- [ ] Daily status report to stakeholders

### Monitoring Schedule
```
00:00 - Check health (every 5 min)
01:00 - Full review (every 15 min)
04:00 - Extended review (hourly)
24:00 - Full validation & sign-off
```

---

## Rollback Criteria

**Automatic Rollback If**:
- [ ] Error rate > 10% for 5 minutes
- [ ] Response time P95 > 5 seconds
- [ ] Database unreachable
- [ ] Authentication broken
- [ ] All requests failing (5xx > 50%)

**Manual Rollback Decision If**:
- [ ] Critical user-reported bug
- [ ] Data integrity issue
- [ ] Security vulnerability discovered
- [ ] Unplanned outage
- [ ] Team consensus (2+ leads agree)

**Rollback Execution**:
```
1. Assess severity
2. Team lead approval
3. Execute rollback (< 5 min)
4. Verify health (< 2 min)
5. Notify stakeholders (< 5 min)
6. Post-mortem scheduled
```

---

## Notes & Additional Items

### Special Considerations
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

### Team Communication Points
```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
```

### Follow-up Tasks (Post-Deployment)
- [ ] Document deployment in runbook
- [ ] Gather metrics for optimization
- [ ] Schedule post-mortem if issues
- [ ] Update documentation if needed
- [ ] Share learnings with team

---

## Deployment Timeline

| Time | Activity | Owner | Status |
|------|----------|-------|--------|
| T-24h | Final review | Team Lead | ☐ Complete |
| T-1h | Staging validation | QA | ☐ Complete |
| T-15min | Team briefing | DevOps | ☐ Complete |
| T-0 | Deployment | DevOps | ☐ Complete |
| T+5min | Health check | DevOps | ☐ Complete |
| T+15min | Error monitoring | Team | ☐ Complete |
| T+1h | Performance review | DevOps | ☐ Complete |
| T+24h | Full validation | Team Lead | ☐ Complete |

---

## Emergency Contacts

```
On-Call Engineer: _________________ Phone: _________________
Team Lead: _________________ Phone: _________________
VP Engineering: _________________ Phone: _________________

Slack: #incidents, #alerts-critical
Email: incidents@emotionscare.com
Status Page: https://status.emotionscare.com
```

---

## Document Info

**Created**: 2025-11-14
**Version**: 1.0.0
**Status**: Active - Use Before Every Deployment
**Next Review**: Post-deployment
**Completed By**: _________________________ Date: _________

---

**Remember**: A thorough pre-deployment checklist prevents most production incidents.
**This checklist should take 4-5 hours for thorough review.**
**Do not rush - quality > speed.**

---

✅ **When all items checked, you're ready to deploy!**
