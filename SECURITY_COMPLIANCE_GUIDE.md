# 🔐 Security & Compliance Guide

Complete security and compliance procedures for EmotionsCare production.

## Table of Contents
1. [Security Overview](#security-overview)
2. [GDPR Compliance](#gdpr-compliance)
3. [Data Protection](#data-protection)
4. [Access Control](#access-control)
5. [Incident Response](#incident-response)
6. [Audit & Logging](#audit--logging)
7. [Vulnerability Management](#vulnerability-management)
8. [Compliance Checklist](#compliance-checklist)

---

## Security Overview

### Security Pillars

**Confidentiality**: Only authorized users access data
- Encryption in transit (TLS 1.3)
- Encryption at rest (AES-256)
- Row-level security (RLS) policies
- Access token management

**Integrity**: Data is not modified without authorization
- Database constraints
- Transaction logging
- Audit trails
- Change verification

**Availability**: Service remains accessible
- Uptime SLA: 99.9%
- Disaster recovery
- DDoS mitigation
- Load balancing

---

## GDPR Compliance

### Data Subject Rights

**Right to Access (Article 15)**
```
Implementation:
- Users can export all their data via settings
- Endpoint: GET /api/users/data-export
- Format: JSON or CSV
- Response time: < 30 days (usually < 1 day)

Process:
1. User clicks "Download my data"
2. Job queued (async, can take minutes)
3. Email sent with download link
4. Link expires after 7 days
```

**Right to Rectification (Article 16)**
```
Implementation:
- Users can edit profile information
- Update email, name, preferences
- Immediate effect in UI
- Audit trail logged

Endpoint: PATCH /api/users/profile
```

**Right to Erasure (Article 17)**
```
Implementation:
- "Delete my account" button in settings
- Requires password confirmation
- Soft delete (marked as deleted, kept 30 days)
- Hard delete after 30 days (GDPR compliance)

Process:
1. User confirms deletion
2. Account marked as deleted
3. Data anonymized where possible
4. Legal hold check
5. Deletion job scheduled (30 days)
6. Final notification sent
```

**Right to Restrict Processing (Article 18)**
```
Implementation:
- Users can restrict data use
- Settings: "Restrict Processing"
- Blocks: Analytics, recommendations, marketing

Effect:
- No machine learning
- No A/B testing
- No external sharing
- Core functionality continues
```

**Right to Portability (Article 20)**
```
Implementation:
- Data export in standard format
- Endpoint: GET /api/users/data-export?format=json
- Includes: Profile, journal, meditation, settings
- Format: Machine-readable JSON

Process:
1. User requests export
2. Data compiled (< 30 seconds)
3. Download link provided
4. Export includes all linked data
```

**Right to Object (Article 21)**
```
Implementation:
- Users can opt-out of processing
- Email marketing opt-out
- Personalization opt-out
- Profiling opt-out

Process:
1. User changes preferences
2. Immediately effective
3. Confirmation email sent
4. No further processing occurs
```

### Data Protection Impact Assessment (DPIA)

Required for high-risk processing:
- Emotion analysis (Hume API)
- Behavioral tracking
- Automated decision-making

**DPIA Required For**:
- New data sources
- New processing purposes
- High-risk processing
- Large-scale data collection

**Process**:
1. Identify processing activity
2. Assess necessity and proportionality
3. Identify risks
4. Evaluate mitigations
5. Document decision
6. Review annually

### Consent Management

**Explicit Consent Required For**:
- Email marketing
- Analytics tracking
- Recommendation algorithms
- Third-party sharing
- Cookies (non-essential)

**Consent Implementation**:
```
Database Table: user_consents
Fields:
- user_id (FK)
- consent_type (enum)
- granted (boolean)
- timestamp (datetime)
- expires_at (datetime)

Types:
- analytics
- marketing
- personalization
- profiling
- third_party_sharing
```

**Cookie Consent Banner**:
```
Essential Cookies (always):
- Session token
- CSRF token
- Language preference

Non-Essential (require consent):
- Analytics (Sentry)
- Personalization
- Tracking
```

---

## Data Protection

### Encryption Standards

**In Transit**
```
Protocol: TLS 1.3 (minimum)
Certificate: Let's Encrypt (auto-renewed)
Cipher Suites: ECDHE-RSA-AES256-GCM-SHA384
HSTS: Enabled (1 year, includeSubDomains)
HPKP: Not implemented (risk of lockout)

Verification:
- SSL Labs A+ rating
- OWASP SSL Testing Grade A
```

**At Rest**
```
Database:
- Default encryption: AES-256-GCM
- Key management: Managed by Supabase
- Backups: Encrypted with same key

Files:
- Encryption: Server-side encryption (SSE-S3)
- Key rotation: Automatic (monthly)
- Audit logging: All key access

Sensitive Fields:
- Passwords: bcrypt (cost 12)
- Tokens: Encrypted in database
- API Keys: Encrypted in environment
```

### Sensitive Data Handling

**Classification Levels**

```
Level 1 - Public:
- App version
- Feature list
- General documentation

Level 2 - Internal:
- Architecture diagrams
- Performance metrics
- Deployment procedures

Level 3 - Confidential:
- API keys
- Customer data
- Security vulnerabilities
- Business metrics

Level 4 - Secret:
- Master passwords
- Encryption keys
- Backup passphrases
```

**Handling Requirements**

```
Level 3 Confidential:
- Encryption at rest
- Access control (3+ people)
- Audit logging
- Secure disposal (shredding)

Level 4 Secret:
- Hardware security module (HSM)
- Multi-person control
- No logging
- Destroyed after use
```

### Personally Identifiable Information (PII)

**PII Definition**:
```
Email address
Phone number
Name
Address
Birthdate
Social security number
Financial account numbers
Biometric data
Device IDs
```

**PII Protection**:
- Encrypted in database
- Never logged
- Sentry PII scrubbing enabled
- Limited access (support team only)
- Annual audit of access logs

**PII in Logs**:
```
Automatic scrubbing of:
- Email addresses: [redacted-email]
- Phone numbers: [redacted-phone]
- IP addresses: [redacted-ip]
- UUIDs/IDs: [redacted-id]
- Tokens: [redacted-token]
```

---

## Access Control

### Authentication

**Password Policy**
```
Requirements:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers
- At least 1 special character
- Not in common password list
- Not reused (last 5 passwords)

Enforcement:
- Checked at signup
- Checked at password change
- Enforced by Supabase Auth
```

**Multi-Factor Authentication (MFA)**
```
Required For:
- Admin accounts
- Support staff
- Financial access
- Security team

Options:
- TOTP (Google Authenticator, Authy)
- SMS (if phone on file)
- Backup codes (10 single-use)

Enforcement:
- MFA setup required within 24 hours
- Re-authentication for sensitive operations
- Backup codes printed and stored securely
```

**Session Management**
```
Token Lifetime:
- Access token: 60 minutes
- Refresh token: 7 days
- Session cookie: Secure, HttpOnly

Handling:
- Issued via Supabase Auth
- Stored in httpOnly cookie
- Automatically sent with requests
- Validated on backend
- Rotated on refresh
```

### Authorization

**Role-Based Access Control (RBAC)**
```
Roles:
- user: Regular user (full app access)
- admin: Administrator (platform management)
- support: Support team (customer access)
- auditor: Audit team (read-only access)

Permissions Matrix:
- User: Create/read/update own data
- Admin: Full platform access
- Support: Read customer data (with audit log)
- Auditor: Read all (no modify)

Implementation:
- Checked via RLS policies
- Logged for compliance
- Audited monthly
```

**Row-Level Security (RLS)**
```
Enabled: All production tables
Policy Examples:

journal_entries:
- Users can see own entries
- Users can see shared entries
- Admins can see all (with reason)

users:
- Users can see own profile
- Admins can see all profiles
- Support can see limited fields
```

### Third-Party Access

**OAuth Applications**
```
Integrated Services:
- Spotify (for music export)
- Google Calendar (for event sync)
- Zoom (for video calls)

Token Management:
- Stored encrypted
- Refresh tokens rotated
- Revocation available
- Audit logged

User Control:
- Settings > Connected Accounts
- Revoke access any time
- View last accessed time
- See requested permissions
```

---

## Vulnerability Management

### Vulnerability Scanning

**Automated Scanning**
```
Code:
- npm audit (weekly)
- Snyk (continuous)
- SAST scanning (on push)

Dependencies:
- Outdated package detection
- License compliance check
- Known CVE detection

Infrastructure:
- Port scanning
- SSL/TLS validation
- Configuration review
```

**Frequency**
```
Automatic:
- On every git push
- Daily scheduled scan
- Before deployment

Manual:
- Monthly security audit
- Quarterly penetration test (planned)
- Annual third-party audit
```

### Remediation Process

**Critical (0-7 days)**
```
1. Verify vulnerability
2. Assess impact
3. Develop fix
4. Test fix
5. Deploy to production
6. Verify remediation
7. Update advisory
```

**High (1-30 days)**
```
1. Plan remediation
2. Develop fix
3. Test in staging
4. Deploy to production
5. Monitor for issues
```

**Medium/Low (1-90 days)**
```
1. Add to backlog
2. Plan for next sprint
3. Develop and test
4. Deploy with regular release
```

### Dependency Management

**Update Policy**
```
Security Updates: Apply immediately
Minor Updates: Apply monthly (in batch)
Major Updates: Plan 1-3 months ahead

Testing:
- All updates tested in CI/CD
- Staging deployment first
- Monitor for issues (24 hours)
- Production deployment
```

---

## Incident Response

### Security Incident Classification

**Critical**
- Data breach (> 100 users)
- Unauthorized access to systems
- Ransomware infection
- Active exploitation

**High**
- Data breach (< 100 users)
- Vulnerability in production
- Failed security control
- Insider threat suspected

**Medium**
- Vulnerability in non-critical service
- Security misconfiguration
- Policy violation
- Attempted attack (blocked)

**Low**
- Suspicious activity (monitored)
- Policy minor violation
- Security awareness opportunity
- Testing-related issue

### Incident Response Procedure

**Phase 1: Detection (< 5 min)**
```
1. Alert triggered by automated tool
   - Sentry security error
   - IDS/IPS detection
   - Manual report

2. Validate incident
   - Confirm false positive
   - Assess severity

3. Notification
   - Activate incident response team
   - Create incident ticket
   - Begin logging
```

**Phase 2: Containment (5-30 min)**
```
1. Isolate affected systems
   - Disable compromised accounts
   - Block malicious IPs
   - Revoke tokens

2. Prevent spread
   - Stop data exfiltration
   - Block lateral movement
   - Preserve evidence

3. Communication
   - Notify management
   - Prepare user notification (if needed)
   - Brief legal team
```

**Phase 3: Investigation (30 min - 24 hours)**
```
1. Forensics
   - Collect logs
   - Analyze attack vector
   - Identify root cause

2. Scope assessment
   - Data accessed
   - Systems affected
   - Duration of compromise
   - Users impacted

3. Timeline reconstruction
   - When started
   - How detected
   - Actions taken
```

**Phase 4: Eradication (24-72 hours)**
```
1. Remove malware
   - Clean compromised systems
   - Remove backdoors
   - Verify complete removal

2. Patch vulnerabilities
   - Apply security patches
   - Implement mitigations
   - Harden systems

3. Restore systems
   - Rebuild from backups
   - Restore from clean images
   - Verify functionality
```

**Phase 5: Recovery (as needed)**
```
1. Restore services
   - Bring systems back online
   - Verify data integrity
   - Monitor closely

2. Notifications
   - User notification (if needed)
   - Regulatory notification (if required)
   - Media statement (if major)
```

**Phase 6: Post-Incident (within 1 week)**
```
1. Full postmortem
   - Timeline of events
   - Root cause analysis
   - Contributing factors

2. Action items
   - Process improvements
   - System hardening
   - Training needs

3. Documentation
   - Incident report
   - Lessons learned
   - Share with team
```

### Breach Notification

**Legal Requirements**
```
GDPR: 72 hours to authorities
CCPA: Without unreasonable delay
State Laws: Varies (typically 30 days)

Notification Must Include:
- What happened
- What data was affected
- When it was discovered
- What we're doing about it
- What users should do
- Support resources
```

---

## Audit & Logging

### Logging Standards

**What to Log**
```
Security Events:
- Authentication (success/failure)
- Authorization decisions
- Data access (sensitive)
- Configuration changes
- Admin actions
- Failed security checks
- Privilege escalation

Never Log:
- Passwords
- Tokens/API keys
- Credit card numbers
- PII (full values)
```

**Log Retention**
```
Access logs: 90 days
Error logs: 30 days
Security logs: 1 year
Audit logs: 7 years
Backup logs: 1 year
```

**Log Security**
```
Storage: Encrypted
Transfer: TLS
Access: Restricted (audit team)
Deletion: Secure wiping
Tampering: Detection enabled
```

### Audit Trail

**Activities Logged**:
- User login/logout
- Password changes
- Permission changes
- Data exports
- Support access
- Admin actions
- API key generation
- MFA changes

**Audit Format**
```json
{
  "timestamp": "2025-11-14T10:30:00Z",
  "actor": "admin_id",
  "action": "user_update",
  "resource": "user_id",
  "old_value": {"role": "user"},
  "new_value": {"role": "admin"},
  "ip_address": "[redacted-ip]",
  "status": "success",
  "reason": "Promotion to manager"
}
```

---

## Compliance Checklist

### GDPR Compliance
- [ ] Privacy Policy updated
- [ ] Consent management implemented
- [ ] Data subject rights enabled
- [ ] Data Processing Agreement signed
- [ ] DPIA completed (high-risk)
- [ ] Data Protection Officer appointed
- [ ] Breach notification procedure documented
- [ ] Employee training completed
- [ ] Vendor contracts reviewed
- [ ] Data retention policy documented

### CCPA Compliance
- [ ] Privacy Policy includes CCPA rights
- [ ] Data sale opt-out implemented
- [ ] Data deletion requests honored
- [ ] Access requests honored
- [ ] Opt-in for sensitive data
- [ ] Annual compliance certification
- [ ] Consumer rights notice displayed
- [ ] Disclosure of data practices
- [ ] Service provider contracts updated

### Security Best Practices
- [ ] OWASP Top 10 reviewed
- [ ] Penetration testing scheduled
- [ ] Security training provided
- [ ] Incident response plan documented
- [ ] Backup/recovery tested
- [ ] Encryption enabled
- [ ] Access control configured
- [ ] Logging enabled
- [ ] Monitoring active
- [ ] Vulnerability scanning enabled

### Infrastructure Security
- [ ] TLS 1.3 enabled
- [ ] SSL certificate valid
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Rate limiting enabled
- [ ] DDoS protection active
- [ ] Firewall configured
- [ ] IDS/IPS monitoring
- [ ] WAF rules deployed
- [ ] Secrets management configured

### Application Security
- [ ] Input validation implemented
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Authentication secure
- [ ] Authorization enforced
- [ ] Dependency vulnerabilities resolved
- [ ] Security headers set
- [ ] Error handling secure
- [ ] Logging doesn't expose data

---

## Security Contacts

```
Chief Security Officer: [name@emotionscare.com]
Security Team: security@emotionscare.com
Privacy Officer: privacy@emotionscare.com
Incident Response: incidents@emotionscare.com

Bug Bounty Program: security@emotionscare.com
Responsible Disclosure: See SECURITY.md
```

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GDPR Compliance](https://gdpr-info.eu/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security-management.html)

---

**Created**: 2025-11-14
**Version**: 1.0.0
**Status**: Active - All Production Services
**Next Review**: 2026-02-14 (Quarterly)
