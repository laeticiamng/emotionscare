# 👥 Team Onboarding Guide

Complete onboarding guide for new team members joining EmotionsCare operations.

## Welcome to EmotionsCare! 👋

This guide helps new team members get up to speed with EmotionsCare operations, architecture, and processes.

**Estimated onboarding time**: 4-8 hours depending on role
**Mentorship**: Assigned buddy from existing team

---

## Quick Start (First 30 Minutes)

### 1. Access & Setup
```bash
✓ GitHub access (claude-audit-completion-tasks-01MkZLzdArjQtMWWR6iCeb6m branch)
✓ Slack channels: #incidents, #alerts-critical, #releases
✓ PagerDuty account (on-call schedule)
✓ Sentry access (monitoring dashboard)
✓ VPN/Network access
✓ Database access (read-only initially)
```

### 2. Documentation Overview (15 min)
```
Read in order:
1. DOCUMENTATION_INDEX.md (master navigation)
2. PROJECT_COMPLETION_SUMMARY.md (project overview)
3. ARCHITECTURE_OVERVIEW.md (system design)
4. Your role-specific guide (see below)
```

### 3. Environment Setup (15 min)
```bash
# Clone repository
git clone https://github.com/laeticiamng/emotionscare.git
cd emotionscare
git checkout claude/audit-completion-tasks-01MkZLzdArjQtMWWR6iCeb6m

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local
# Ask team lead for dev credentials

# Start development
npm run dev

# Verify setup
curl http://localhost:5173/health
```

---

## Role-Specific Onboarding

### 🔨 For Developers

**Day 1: Setup & Understanding**
```
1. Complete Quick Start (above)
2. Read: ARCHITECTURE_OVERVIEW.md
3. Read: PROJECT_COMPLETION_SUMMARY.md
4. Clone & build project locally
5. Run: npm run test (should pass)
6. Explore codebase:
   - src/components/ (UI components)
   - src/pages/ (Page components)
   - src/hooks/ (Custom hooks)
   - src/lib/ (Utilities & API)
```

**Day 1: First Tasks**
```
1. Make a trivial change (fix typo, update comment)
2. Create PR and get reviewed
3. Merge and verify deployment
4. Read: OPERATIONAL_RUNBOOKS.md (relevant sections)
```

**Week 1: Deep Dive**
```
1. Understand data flow
   - User registration → Authentication → Database
   - Journal entry creation → Supabase → Storage

2. Review feature implementations
   - Hume API integration (src/hooks/useHumeStream.ts)
   - Music generation (src/contexts/music/useMusicGeneration.ts)
   - Payment processing (if applicable)

3. Set up local debugging
   - Chrome DevTools
   - Sentry sourcemaps
   - React DevTools

4. Complete: 1 small bug fix or feature
```

**Key Resources for Developers**
- Code repository: Main branch or feature branches
- API documentation: (Add link to Swagger/API docs)
- Database schema: ARCHITECTURE_OVERVIEW.md
- Component library: shadcn/ui documentation
- Testing: npm run test, npm run test:e2e

---

### 🚀 For DevOps/SRE

**Day 1: Infrastructure Overview**
```
1. Complete Quick Start
2. Read: STAGING_DEPLOYMENT_GUIDE.md
3. Read: PRODUCTION_DEPLOYMENT_GUIDE.md
4. Read: ARCHITECTURE_OVERVIEW.md
5. Access:
   - Supabase dashboard
   - Vercel/Netlify dashboard
   - Sentry projects
   - GitHub Actions workflow
```

**Day 1: Operational Understanding**
```
1. Review current deployment process
   - GitHub Actions workflow
   - Environment variables
   - Deployment targets

2. Review monitoring
   - Sentry dashboard
   - Lighthouse scores
   - Error rates

3. Review backup strategy
   - Database backups
   - File storage backups
   - Recovery procedures
```

**Week 1: Hands-On Training**
```
1. Staging deployment
   - Deploy to staging
   - Run validation checks
   - Monitor for issues

2. Incident response
   - Acknowledge alerts
   - Investigate errors
   - Resolve minor issues

3. Operations tasks
   - Backup verification
   - Log review
   - Performance monitoring

4. Complete: 1 ops task with buddy approval
```

**Key Resources for DevOps**
- Deployment guides: STAGING_DEPLOYMENT_GUIDE.md, PRODUCTION_DEPLOYMENT_GUIDE.md
- Incident response: INCIDENT_RESPONSE_GUIDE.md
- Monitoring: SENTRY_ALERTS_SETUP.md
- Operations: OPERATIONAL_RUNBOOKS.md
- Database: Supabase documentation

---

### 🧪 For QA/Testing

**Day 1: Product Understanding**
```
1. Complete Quick Start
2. Read: PROJECT_COMPLETION_SUMMARY.md
3. Read: STAGING_VALIDATION_GUIDE.md
4. Read: SERVICE_LEVEL_AGREEMENT.md
5. Access:
   - Staging environment
   - Test accounts (ask team lead)
   - Bug tracking system
   - Test case repository
```

**Day 1: Feature Walkthrough**
```
Walk through core features:
1. User registration & login
2. Journal entry creation
3. Meditation sessions
4. Music recommendations
5. Data export
6. Settings & preferences
```

**Week 1: Testing Tasks**
```
1. Execute test cases
   - Manual testing
   - Edge case testing
   - Performance testing

2. Validate features
   - Feature completeness
   - UI/UX consistency
   - Error handling

3. Report bugs
   - Clear description
   - Reproduction steps
   - Expected vs actual

4. Complete: Full feature validation with sign-off
```

**Key Resources for QA**
- Validation guide: STAGING_VALIDATION_GUIDE.md
- Test cases: (Link to test case repository)
- Bug report template: (Create if not exists)
- Performance targets: PERFORMANCE_OPTIMIZATION_GUIDE.md
- SLA: SERVICE_LEVEL_AGREEMENT.md

---

### 🔐 For Security/Compliance

**Day 1: Security Architecture**
```
1. Complete Quick Start
2. Read: SECURITY_COMPLIANCE_GUIDE.md
3. Read: ARCHITECTURE_OVERVIEW.md (Security section)
4. Read: SERVICE_LEVEL_AGREEMENT.md
5. Access:
   - Security logs
   - Audit trails
   - Compliance dashboards
```

**Day 1: Compliance Review**
```
1. Review data handling
   - PII protection
   - Encryption methods
   - Access controls

2. Review compliance
   - GDPR procedures
   - CCPA procedures
   - Data retention policies

3. Review incident response
   - Breach notification process
   - Regulatory reporting
   - Root cause analysis
```

**Week 1: Security Validation**
```
1. Audit security controls
   - Authentication mechanisms
   - Authorization (RLS policies)
   - Encryption implementation

2. Review access logs
   - Unusual activity
   - Privilege escalation
   - Data access patterns

3. Test compliance
   - GDPR data export
   - Data deletion
   - Consent management

4. Complete: Full security audit with report
```

**Key Resources for Security**
- Security guide: SECURITY_COMPLIANCE_GUIDE.md
- Architecture: ARCHITECTURE_OVERVIEW.md
- SLA: SERVICE_LEVEL_AGREEMENT.md
- Incident response: INCIDENT_RESPONSE_GUIDE.md

---

### 📊 For Product/Management

**Day 1: Project Overview**
```
1. Read: PROJECT_COMPLETION_SUMMARY.md
2. Read: SERVICE_LEVEL_AGREEMENT.md
3. Review: Performance metrics (PERFORMANCE_OPTIMIZATION_GUIDE.md)
4. Access:
   - Sentry dashboards
   - Analytics (if available)
   - User feedback channels
```

**Day 1: Operational Understanding**
```
1. Review feature status
   - All 14 features completed
   - Deployment ready

2. Review metrics
   - Error rates
   - Performance targets
   - User metrics

3. Review SLA
   - Availability target
   - Support response times
   - Performance commitments
```

**Week 1: Stakeholder Engagement**
```
1. Meet with key stakeholders
   - Engineering team
   - DevOps team
   - Security team

2. Review processes
   - Deployment procedures
   - Incident response
   - Monitoring & alerting

3. Plan next phase
   - Feature roadmap
   - Performance optimization
   - Scaling strategy

4. Complete: Stakeholder briefing document
```

**Key Resources for Product/Management**
- Project summary: PROJECT_COMPLETION_SUMMARY.md
- SLA: SERVICE_LEVEL_AGREEMENT.md
- Performance: PERFORMANCE_OPTIMIZATION_GUIDE.md
- Architecture: ARCHITECTURE_OVERVIEW.md

---

## General Onboarding Checklist

### Access & Setup
- [ ] GitHub account & repository access
- [ ] Slack workspace & channels joined
- [ ] PagerDuty account set up
- [ ] Sentry access granted
- [ ] Database access configured
- [ ] VPN/Network access verified
- [ ] Development environment working

### Documentation Review
- [ ] Read DOCUMENTATION_INDEX.md
- [ ] Read PROJECT_COMPLETION_SUMMARY.md
- [ ] Read ARCHITECTURE_OVERVIEW.md
- [ ] Read role-specific documentation
- [ ] Bookmark key resources
- [ ] Understand SLA (SERVICE_LEVEL_AGREEMENT.md)

### Team Integration
- [ ] Meet with assigned mentor/buddy
- [ ] Introduce yourself in #introductions
- [ ] Attend team standup
- [ ] Add to relevant Slack channels
- [ ] Schedule 1-on-1 with team lead
- [ ] Review team processes & norms

### First Tasks
- [ ] Make trivial change (typo, comment)
- [ ] Create & merge PR
- [ ] Observe deployment
- [ ] Complete 1 assigned task
- [ ] Participate in standup
- [ ] Ask questions (encouraged!)

### Knowledge Verification
- [ ] Can explain system architecture
- [ ] Can navigate documentation
- [ ] Can access all required systems
- [ ] Can run tests locally
- [ ] Can submit PR for review
- [ ] Can answer basic questions about project

---

## Key Concepts

### System Architecture
EmotionsCare is a mental wellness platform with:
- **Frontend**: React + TypeScript (Vite)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Integrations**: AI APIs (OpenAI, Hume, Suno), Social (Spotify, Google, Zoom)
- **Monitoring**: Sentry, Lighthouse, K6

See: ARCHITECTURE_OVERVIEW.md for details

### Feature Set
```
Core Features:
✓ User authentication & profiles
✓ Journal entries (text, audio, images)
✓ Meditation sessions
✓ Music recommendations
✓ AI-powered insights
✓ Data export & GDPR compliance
✓ Integrations with external services
```

See: PROJECT_COMPLETION_SUMMARY.md for full list

### Deployment Process
```
Local Development
  ↓
Feature Branch (Git)
  ↓
Pull Request (Code Review)
  ↓
GitHub Actions (Tests, Build)
  ↓
Staging Deployment (Validation)
  ↓
Production Deployment (Blue-Green)
  ↓
Monitoring (24 hours)
```

See: PRODUCTION_DEPLOYMENT_GUIDE.md for details

### Support & Escalation
```
For Immediate Help:
- Slack: #incidents (urgent), #general (questions)
- Ask your buddy/team lead

For Documentation:
- DOCUMENTATION_INDEX.md (master index)
- Google for specific docs

For Serious Issues:
- Team lead escalation
- PagerDuty (if on-call)
```

---

## Common Questions

### Q: How do I deploy to staging?
A: See STAGING_DEPLOYMENT_GUIDE.md or ask your mentor

### Q: What's the emergency procedure?
A: See INCIDENT_RESPONSE_GUIDE.md for P1-P4 procedures

### Q: How do I report a bug?
A: Follow your team's bug report process (ask team lead)

### Q: What's our uptime target?
A: 99.9% - see SERVICE_LEVEL_AGREEMENT.md

### Q: How do I monitor performance?
A: Sentry dashboard or PERFORMANCE_OPTIMIZATION_GUIDE.md

### Q: Who do I contact for help?
A: Your buddy, team lead, or relevant Slack channel

### Q: How do I understand the architecture?
A: ARCHITECTURE_OVERVIEW.md has diagrams and explanations

### Q: What if something breaks?
A: See INCIDENT_RESPONSE_GUIDE.md for procedures

---

## Useful Commands

```bash
# Development
npm run dev              # Start local development
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npm run build           # Production build

# Deployment
git push origin branch   # Push changes
git tag v1.0.0          # Create release tag
vercel deploy --prod    # Deploy to production

# Database
psql -h host -U user    # Connect to database
supabase db reset       # Reset local DB

# Monitoring
curl localhost:5173/health    # Check health
curl emotionscare.com/api/health  # Production health
```

---

## Learning Resources

### Official Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Internal Documentation
- DOCUMENTATION_INDEX.md (all guides)
- ARCHITECTURE_OVERVIEW.md (system design)
- OPERATIONAL_RUNBOOKS.md (daily tasks)
- INCIDENT_RESPONSE_GUIDE.md (emergency procedures)

### Video Tutorials (if available)
- System architecture walkthrough
- Deployment process demo
- Incident response simulation
- Local development setup

---

## Feedback & Improvements

### Report Issues
If you find documentation unclear or outdated:
1. Create an issue in GitHub
2. Suggest improvement in team Slack
3. Create PR with corrections

### Share Knowledge
After you learn something:
1. Document it (update guides if needed)
2. Share with team in Slack
3. Help new team members

### Continuous Improvement
Every 3 months:
- Review onboarding process
- Update documentation
- Gather feedback from new hires
- Improve inefficiencies

---

## Next Steps

### For Your First Week
1. ✓ Complete onboarding checklist
2. ✓ Read all relevant documentation
3. ✓ Set up development environment
4. ✓ Complete 1-2 small tasks
5. ✓ Attend all meetings/standups
6. ✓ Ask questions (lots of them!)

### For Your First Month
1. ✓ Complete 3-5 meaningful tasks
2. ✓ Review code from others
3. ✓ Participate in incident response (if applicable)
4. ✓ Understand full deployment process
5. ✓ Help onboard next team member

### For Your First Quarter
1. ✓ Own one feature or area
2. ✓ Lead one project/initiative
3. ✓ Document learnings
4. ✓ Mentor new team members
5. ✓ Contribute to process improvements

---

## Support & Resources

### Questions?
- **Slack**: Ask in relevant channels
- **Email**: team@emotionscare.com
- **Buddy**: Your assigned mentor
- **Team Lead**: For bigger questions

### Documentation
- **Master Index**: DOCUMENTATION_INDEX.md
- **All Guides**: See repository root
- **External Docs**: Links in guides

### Meetings
- **Daily Standup**: 10:00 AM (timezone)
- **Weekly Planning**: Friday 4:00 PM
- **Incident Review**: After major incidents
- **Monthly Retro**: Last Friday of month

---

## Onboarding Completion

When you've completed onboarding:
1. ✓ All checklist items done
2. ✓ Can explain system architecture
3. ✓ Can navigate documentation
4. ✓ Completed 1-2 meaningful tasks
5. ✓ Feel confident in your role

**Sign-off**: Have your mentor/team lead confirm completion

**Welcome to the team! 🎉**

---

**Created**: 2025-11-14
**Version**: 1.0.0
**Status**: Active - Team Onboarding
**Last Updated**: 2025-11-14
