# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

We take the security of FitBook Auto seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report vulnerabilities through one of the following channels:

1. **Email**: security@fitbookauto.com (preferred)
2. **GitHub Security Advisory**: Use the "Report a vulnerability" feature in the Security tab

### What to Include

Please include the following information in your report:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your name/handle** (for acknowledgment, if desired)

### Example Report

```
Subject: [SECURITY] SQL Injection in booking preferences API

Description:
The /api/preferences endpoint is vulnerable to SQL injection when
processing the 'studioName' parameter.

Steps to Reproduce:
1. Send POST request to /api/preferences
2. Include malicious SQL in studioName field: "'; DROP TABLE users;--"
3. Observe database error

Potential Impact:
- Database compromise
- Unauthorized data access
- Data loss

Suggested Fix:
Use parameterized queries instead of string concatenation

Reporter: security-researcher-123
```

---

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity (critical: 1-7 days, high: 7-30 days)

---

## Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide a more detailed response within 7 days
- We will keep you informed of our progress
- We will publicly disclose vulnerabilities after a fix is released
- We will credit you for the discovery (unless you prefer to remain anonymous)

---

## Security Measures

FitBook Auto implements the following security measures:

### Data Encryption

- **At Rest**: All user credentials are encrypted using AES-256-GCM encryption
- **In Transit**: All API communications use HTTPS/TLS 1.3
- **Keys**: Encryption keys stored in environment variables, never in code

### Authentication & Authorization

- JWT tokens for API authentication (Phase 2)
- User session management
- Rate limiting on all endpoints
- Input validation and sanitization

### Database Security

- Parameterized queries to prevent SQL injection
- Row-level security policies (Supabase)
- Regular backups
- Principle of least privilege for database access

### API Security

- CORS configured for known origins
- Request size limits
- Timeout configurations
- Error messages don't leak sensitive information

### Browser Automation Security

- Sandboxed execution environment
- No persistent storage of session data
- Credentials decrypted only when needed
- Automatic cleanup of browser data

### Infrastructure Security

- Environment variables for secrets
- No credentials in logs
- Regular dependency updates
- Security headers (HSTS, CSP, etc.)

---

## Known Limitations

The following are known limitations, not vulnerabilities:

1. **Browser Automation Detection**
   - Platforms may detect and block automation
   - We use stealth plugins but detection is possible

2. **Credential Storage**
   - Credentials must be stored to enable automation
   - Encryption mitigates risk but cannot eliminate it entirely

3. **Third-Party Platform Changes**
   - Platform UI changes may break automation
   - Not a security issue but affects reliability

---

## Security Best Practices for Users

### Strong Passwords

Use strong, unique passwords for:
- Your FitBook Auto account
- Platform accounts (ClassPass, Mindbody, etc.)

### Environment Security

- Keep your `.env` files secure
- Never commit `.env` to version control
- Use strong encryption keys (32+ random bytes)
- Rotate encryption keys periodically

### Access Control

- Limit who has access to your deployment
- Use strong passwords for Supabase, Render, etc.
- Enable 2FA where possible

### Monitoring

- Review booking history regularly
- Check for unauthorized access
- Monitor email notifications

---

## Security Updates

We will announce security updates through:

1. **GitHub Security Advisories**
2. **Release Notes** (with severity rating)
3. **Email** (if you've subscribed)

### Update Process

```bash
# Check current version
npm run version

# Update to latest version
git pull
cd frontend && npm install
cd ../backend && npm install

# Review CHANGELOG for security fixes
```

---

## Compliance

This project follows:

- **OWASP Top 10** guidelines
- **CWE Top 25** vulnerability mitigation
- **NIST Cybersecurity Framework** principles

---

## Security Checklist for Developers

Before submitting code:

- [ ] No hardcoded credentials or API keys
- [ ] Input validation for all user inputs
- [ ] Parameterized database queries
- [ ] Sensitive data encrypted
- [ ] Error messages don't leak information
- [ ] Dependencies up-to-date (no known vulnerabilities)
- [ ] HTTPS enforced
- [ ] Rate limiting considered
- [ ] Security tests included

---

## Third-Party Security

### Dependencies

We use:
- **Dependabot**: Automatic dependency updates
- **npm audit**: Regular security audits
- **Snyk**: Vulnerability scanning (optional)

### Service Providers

We rely on the security of:
- **Vercel**: Frontend hosting
- **Render**: Backend hosting
- **Supabase**: Database
- **Resend**: Email delivery

Review their security policies:
- [Vercel Security](https://vercel.com/security)
- [Render Security](https://render.com/security)
- [Supabase Security](https://supabase.com/security)
- [Resend Security](https://resend.com/security)

---

## Bug Bounty Program

We currently do not have a formal bug bounty program. However:

- We appreciate responsible disclosure
- We will acknowledge contributors in release notes
- We may offer swag or recognition for significant findings

---

## Questions?

For security-related questions (non-vulnerabilities):
- Open a GitHub Discussion
- Email: security@fitbookauto.com

For vulnerabilities, please follow the reporting process above.

---

## Acknowledgments

We thank the following researchers for responsible disclosure:

_(None yet - be the first!)_

---

**Thank you for helping keep FitBook Auto and our users safe!**
