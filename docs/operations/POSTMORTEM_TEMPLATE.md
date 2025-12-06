# 📋 Post-Mortem Template

Standard template for post-incident postmortem reviews.

---

# Post-Mortem Report

**Incident Title**: _________________________________________________________________

**Date/Time**: ______________________ Duration: ____________________

**Severity Level**: ☐ P1 (Critical)  ☐ P2 (High)  ☐ P3 (Medium)  ☐ P4 (Low)

**Incident ID**: ______________________ Issue Link: ______________________________

**Prepared By**: _________________________ Date: _____________

---

## Executive Summary

**Brief one-paragraph summary of what happened, impact, and resolution:**

```
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
```

---

## Timeline

**Detailed chronological timeline of the incident:**

| Time (UTC) | Event | Owner | Notes |
|-----------|-------|-------|-------|
| HH:MM | Issue first detected | Name | Detection method |
| HH:MM | Alert triggered | System | Sentry/monitoring |
| HH:MM | Engineer notified | Name | Through Slack/phone |
| HH:MM | Investigation started | Name | Initial diagnosis |
| HH:MM | Root cause identified | Name | [describe cause] |
| HH:MM | Resolution attempted | Name | [describe action] |
| HH:MM | Service recovered | Name | Verified health checks |
| HH:MM | Incident declared resolved | Name | All systems green |

**Total Duration**: _______ minutes
**Detection to Response**: _______ minutes
**Response to Resolution**: _______ minutes

---

## Impact Assessment

### Users Affected
- **Number of users**: _______
- **Percentage of user base**: _______%
- **Geographic regions**: ___________________________
- **Feature impacted**: ___________________________

### Data Impact
- **Data loss**: ☐ Yes  ☐ No (If yes, describe): ____________
- **Data corruption**: ☐ Yes  ☐ No (If yes, describe): ____________
- **Sensitive data exposed**: ☐ Yes  ☐ No (If yes, notify security)
- **Data recovery required**: ☐ Yes  ☐ No

### Financial Impact
- **Estimated revenue impact**: $___________
- **Customer credits issued**: $___________
- **Cost of resolution**: $___________

### Reputation Impact
- **User complaints received**: ________
- **Social media mentions**: ________
- **Press coverage**: ☐ Yes  ☐ No
- **Customer escalations**: ________

---

## Root Cause Analysis

### What Happened?
**Detailed description of what actually occurred:**

```
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
```

### Why Did It Happen?

**Contributing factors (check all that apply):**

**Human Factors**:
- [ ] Lack of documentation
- [ ] Inadequate training
- [ ] Communication breakdown
- [ ] Misunderstanding of process
- [ ] Fatigue/overwork
- [ ] Distraction
- [ ] (Other): _____________________

**Process Factors**:
- [ ] Missing checklist item
- [ ] Inadequate review process
- [ ] Missing approval step
- [ ] Inadequate testing
- [ ] Incomplete documentation
- [ ] No change control process
- [ ] (Other): _____________________

**Technical Factors**:
- [ ] Undetected bug in code
- [ ] Race condition
- [ ] Resource exhaustion
- [ ] Third-party service failure
- [ ] Network issue
- [ ] Database issue
- [ ] Infrastructure failure
- [ ] (Other): _____________________

**Environmental Factors**:
- [ ] Production configuration issue
- [ ] Environment variable wrong
- [ ] Secret misconfigured
- [ ] Permission issue
- [ ] (Other): _____________________

### Root Cause (5 Whys)

1. **Why did the incident occur?**
   ```
   _________________________________________________________________
   ```

2. **Why did [answer 1]?**
   ```
   _________________________________________________________________
   ```

3. **Why did [answer 2]?**
   ```
   _________________________________________________________________
   ```

4. **Why did [answer 3]?**
   ```
   _________________________________________________________________
   ```

5. **Why did [answer 4]?**
   ```
   _________________________________________________________________
   ```

**Root Cause**:
```
_____________________________________________________________________
_____________________________________________________________________
```

---

## What Went Well

**Things the team did right that helped resolve the incident:**

1. ___________________________________________________________________
2. ___________________________________________________________________
3. ___________________________________________________________________
4. ___________________________________________________________________
5. ___________________________________________________________________

---

## What Could Be Improved

**Things that slowed down response or resolution:**

1. ___________________________________________________________________
2. ___________________________________________________________________
3. ___________________________________________________________________
4. ___________________________________________________________________
5. ___________________________________________________________________

---

## Action Items

**Required action items to prevent recurrence:**

| # | Action Item | Owner | Priority | Due Date | Status |
|---|-------------|-------|----------|----------|--------|
| 1 | [Prevention: fix root cause] | _____ | P1 | _______ | ☐ |
| 2 | [Prevention: improve process] | _____ | P1 | _______ | ☐ |
| 3 | [Prevention: add monitoring] | _____ | P1 | _______ | ☐ |
| 4 | [Process: improve runbook] | _____ | P2 | _______ | ☐ |
| 5 | [Communication: distribute lessons] | _____ | P2 | _______ | ☐ |
| 6 | [Training: update documentation] | _____ | P2 | _______ | ☐ |

**P1 (Critical)**: Do within 1 week
**P2 (Important)**: Do within 2 weeks
**P3 (Nice to have)**: Do within 1 month

---

## Prevention & Mitigation

### Immediate Actions Taken
**What did we do immediately to prevent recurrence?**

```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
```

### Short-Term Fixes (1-2 weeks)
**Quick wins to improve resilience:**

```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
```

### Long-Term Solutions (1-3 months)
**Comprehensive fixes to address root cause:**

```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
```

### Monitoring Improvements
**New alerts or monitoring to catch similar issues:**

```
1. _________________________________________________________________
   Threshold: ____________________
   Alert to: ____________________

2. _________________________________________________________________
   Threshold: ____________________
   Alert to: ____________________

3. _________________________________________________________________
   Threshold: ____________________
   Alert to: ____________________
```

### Process Improvements
**Changes to prevent similar incidents:**

```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
```

---

## Communication

### Internal Communication
- [ ] Slack notification sent: _________________ (time)
- [ ] Status page updated: _________________ (time)
- [ ] Team standup briefed: _________________ (time)
- [ ] Leadership notified: _________________ (time)

### External Communication
- [ ] Users notified: ☐ Yes  ☐ No  When: _____________
- [ ] Notification content reviewed: ☐ Yes  ☐ No
- [ ] Social media response: ☐ Yes  ☐ No
- [ ] Press release: ☐ Yes  ☐ No

### Follow-Up Communication
- [ ] Root cause explanation shared: ☐ Yes  ☐ No
- [ ] Action items communicated: ☐ Yes  ☐ No
- [ ] Prevention measures explained: ☐ Yes  ☐ No
- [ ] Expected timeline for fixes: ☐ Yes  ☐ No

---

## Learning & Training

### Team Learnings
**What did the team learn from this incident?**

```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
4. _________________________________________________________________
5. _________________________________________________________________
```

### Training Needs Identified
- [ ] Runbook training needed
- [ ] Process training needed
- [ ] Technical training needed
- [ ] Escalation procedure clarification needed
- [ ] Tool training needed (which tool): _____________

### Documentation Updates Required
- [ ] Runbook needs update
- [ ] SOP needs update
- [ ] Architecture documentation needs update
- [ ] Deployment checklist needs update
- [ ] Troubleshooting guide needs update

---

## Metrics & Analysis

### Response Metrics
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Detection time | < 5 min | _____ min | ☐ Met |
| Response time (first action) | < 15 min | _____ min | ☐ Met |
| Resolution time | < 60 min | _____ min | ☐ Met |
| Communication time | < 30 min | _____ min | ☐ Met |

### System Metrics During Incident
| Metric | Normal | During Incident | Peak |
|--------|--------|-----------------|------|
| Error rate | 0.2% | ______% | ______% |
| Response time P95 | 850ms | _____ms | _____ms |
| CPU usage | 30% | ____% | ____% |
| Memory usage | 45% | ____% | ____% |
| Database connections | 12 | _____ | _____ |
| Active users | 500 | _____ | _____ |

---

## Incident Review Meeting

### Meeting Details
- **Date/Time**: _________________________
- **Location/Link**: _________________________
- **Facilitator**: _________________________
- **Attendees**: _________________________

### Discussion Topics
- [ ] Timeline review and validation
- [ ] Root cause discussion and agreement
- [ ] Impact assessment review
- [ ] Action items assignment
- [ ] Timeline and ownership
- [ ] Prevention measures discussion
- [ ] Communication review
- [ ] Team feedback and morale check

### Decisions Made
```
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________
```

### Open Questions
```
1. _________________________________________________________________
   Owner: _________________ Due: _____________
2. _________________________________________________________________
   Owner: _________________ Due: _____________
3. _________________________________________________________________
   Owner: _________________ Due: _____________
```

---

## Sign-Off

### Postmortem Completion
- [ ] Timeline completed and reviewed
- [ ] Root cause identified and validated
- [ ] Action items assigned with owners and dates
- [ ] Prevention measures documented
- [ ] Lessons learned documented
- [ ] Review meeting completed
- [ ] All stakeholders agree on findings

**Facilitator Sign-Off**: _________________________ Date: _________

### Stakeholder Review
- [ ] Engineering Lead reviewed: _________________ Date: _________
- [ ] VP Engineering reviewed: _________________ Date: _________
- [ ] Security Team reviewed (if applicable): _________________ Date: _________
- [ ] Legal reviewed (if applicable): _________________ Date: _________

---

## Follow-Up

### Action Item Tracking
- **When**: Review action items daily for first week
- **How**: Track in project management tool
- **Who**: Project owner
- **Escalation**: If item not completed by due date

### Monitoring Period
- **Duration**: 1 month
- **Focus**: Watch for similar issues
- **Alert**: Lower thresholds during monitoring period
- **Review**: Weekly check-in on metrics

### Next Postmortem
- **Date**: (1 month after incident)
- **Owner**: _________________________
- **Agenda**: Verify action items complete, no recurrence

---

## Appendices

### Appendix A: Links & References
- Sentry error: [link]
- GitHub issue: [link]
- Related PR: [link]
- Internal docs: [link]
- External docs: [link]

### Appendix B: Error Logs
```
[Paste relevant error logs here]
```

### Appendix C: System Metrics During Incident
```
[Paste graphs or metrics screenshots here]
```

### Appendix D: Customer Feedback
```
[Summarize customer complaints or feedback]
```

### Appendix E: Additional Notes
```
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
```

---

## Document Info

**Report Created**: _________________ by _________________________
**Last Updated**: _________________ by _________________________
**Status**: ☐ Draft  ☐ In Review  ☐ Approved  ☐ Complete

**Approval**: _________________________ (Team Lead) Date: _________

---

## Distribution

This postmortem should be shared with:
- [ ] Engineering team
- [ ] DevOps team
- [ ] Product team
- [ ] Customer support team
- [ ] Leadership
- [ ] Security team (if applicable)

**Sharing Date**: _________________ by _________________________

---

**Remember**:
- Postmortems are blameless - focus on prevention, not blame
- Complete within 24-48 hours of incident resolution
- Include all perspectives (engineering, ops, product, customers)
- Use findings to improve processes and tools
- Share learnings across the organization

---

✅ **Use this template to ensure consistent, thorough incident reviews.**
