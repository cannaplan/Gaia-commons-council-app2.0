# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it to us privately:

1. **Email**: security@gaia-commons.org (or appropriate contact)
2. **GitHub**: Use private vulnerability reporting (Settings → Security → Report a vulnerability)

**Please do not** create public GitHub issues for security vulnerabilities.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Timeline

- **24 hours**: Initial acknowledgment
- **7 days**: Preliminary assessment
- **30 days**: Fix and disclosure timeline

## Security Measures

### 1. Application Security

#### Security Headers (Helmet)

The API uses Helmet middleware to set secure HTTP headers:

```typescript
app.use(helmet());
```

**Headers Set:**
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS filter
- `Strict-Transport-Security` - Forces HTTPS (when enabled)
- Removes `X-Powered-By` - Hides server information

#### CORS Configuration

Cross-Origin Resource Sharing is configured to control access:

```typescript
// Development (permissive)
cors({ origin: true, credentials: true })

// Production (restrictive - recommended)
cors({ 
  origin: ['https://your-domain.com'], 
  credentials: true 
})
```

**Configuration:**
- Set `CORS_ORIGIN` environment variable for production
- Use specific domain whitelist, not `*`
- Enable credentials only when necessary

#### Rate Limiting

Protection against brute force and DoS attacks:

```typescript
rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit per IP
  message: 'Too many requests from this IP'
})
```

**Configuration:**
- Adjust via `API_RATE_LIMIT` and `API_RATE_WINDOW` env vars
- Consider per-endpoint limits for sensitive operations
- Use Redis for distributed rate limiting in production

#### Request Timeout

Prevents resource exhaustion from slow clients:

```typescript
REQUEST_TIMEOUT=30000  // 30 seconds default
```

#### Request ID Tracing

Every request gets a unique UUID for audit trails:

```typescript
X-Request-Id: 550e8400-e29b-41d4-a716-446655440000
```

**Benefits:**
- Security audit trails
- Request tracking
- Debugging support

### 2. Database Security

#### SQL Injection Prevention

**Always use parameterized queries:**

```typescript
// ✅ SAFE
await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ UNSAFE - Never do this!
await pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

#### Connection Security

```typescript
// Connection pool configuration
{
  max: 20,                      // Limit max connections
  idleTimeoutMillis: 30000,     // Close idle connections
  connectionTimeoutMillis: 2000, // Fail fast on timeout
  statement_timeout: 30000       // Query timeout
}
```

**Recommendations:**
- Use SSL/TLS for database connections in production
- Rotate database credentials regularly
- Use separate credentials for different environments
- Grant minimum necessary permissions

#### Connection String Security

**Never hardcode credentials:**

```typescript
// ✅ GOOD
const password = process.env.DB_PASSWORD;

// ❌ BAD
const password = 'my-secret-password';
```

**Use secrets management:**
- Kubernetes Secrets
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault

### 3. Input Validation

#### JSON Payload Limits

```typescript
express.json({ limit: '10mb' })
```

**Prevents:**
- Memory exhaustion attacks
- Large payload DoS

#### URL Encoding

```typescript
express.urlencoded({ extended: true })
```

**Security:**
- Limits nested object depth
- Prevents prototype pollution (with express 5.x)

### 4. Error Handling

#### Safe Error Messages

```typescript
// Development - detailed errors
if (process.env.NODE_ENV === 'development') {
  res.json({ error: err.message, stack: err.stack });
}

// Production - generic errors
res.json({ error: 'Internal server error' });
```

**Never expose:**
- Stack traces
- Internal paths
- Database error details
- Configuration details

### 5. Secrets Management

#### Environment Variables

**Required secrets:**
- `DB_PASSWORD` - Database password
- `DB_USER` - Database username
- Session secrets (if implementing auth)
- API keys (if using third-party services)

**Best Practices:**
- Never commit `.env` files
- Use `.env.example` for templates
- Rotate secrets regularly
- Use different secrets per environment

#### .gitignore

Ensure these are excluded:

```gitignore
.env
.env.local
.env.production
*.pem
*.key
secrets/
```

### 6. Dependency Security

#### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated
```

#### Automated Security Scanning

**GitHub Actions Security Workflow:**
- Weekly security scans
- npm audit on PR
- CodeQL analysis
- Dependabot updates

#### Dependency Policies

- Review all new dependencies
- Prefer well-maintained packages
- Check for known vulnerabilities
- Use `npm ci` for reproducible builds

### 7. Authentication & Authorization

**Current Status:** No authentication implemented

**Future Implementation:**

```typescript
// Recommended approach
- JWT tokens for stateless auth
- OAuth2 for third-party integration
- API keys for service-to-service
- Role-based access control (RBAC)
```

### 8. Network Security

#### HTTPS/TLS

**Production Requirements:**
- Always use HTTPS
- TLS 1.2 minimum (1.3 preferred)
- Valid SSL certificates
- HSTS header enabled

```typescript
// Helmet HSTS configuration
app.use(helmet.hsts({
  maxAge: 31536000,  // 1 year
  includeSubDomains: true,
  preload: true
}));
```

#### Firewall Rules

**Recommended:**
- Allow HTTPS (443) inbound
- Allow HTTP (80) → HTTPS redirect
- Block all other inbound ports
- Restrict database access to application only
- Use VPC/private networks

### 9. Logging & Monitoring

#### Security Logging

**Log these events:**
- Authentication attempts (when implemented)
- Rate limit violations
- Error conditions
- Database connection failures
- Unusual patterns

**Don't log:**
- Passwords
- API keys
- Personal data (PII)
- Credit card numbers

#### Monitoring Alerts

**Set up alerts for:**
- High error rates
- Database connection failures
- Unusual traffic patterns
- Rate limit violations
- Memory/CPU spikes

### 10. Data Protection

#### Sensitive Data Handling

**Current Data:**
- No personal data currently stored
- Financial metrics (public data)
- School information (public data)

**Future Considerations:**
- Encrypt sensitive data at rest
- Use HTTPS for data in transit
- Implement data retention policies
- GDPR/CCPA compliance if applicable

#### Backup Security

```bash
# Encrypt backups
pg_dump gaia_commons | gzip | gpg --encrypt > backup.sql.gz.gpg

# Secure backup storage
- Encrypt backups at rest
- Limit backup access
- Regular backup testing
- Offsite backup storage
```

### 11. Container Security

#### Docker Best Practices

**Implemented:**
- Non-root user (nodejs:nodejs)
- Multi-stage builds
- Minimal base image (node:18-alpine)
- Health checks
- No secrets in Dockerfile

**Recommendations:**
- Scan images for vulnerabilities
- Use specific image tags (not `latest`)
- Sign images
- Use private registry

```bash
# Scan image
docker scan gaia-commons-api:latest

# Run as non-root
USER nodejs
```

### 12. Kubernetes Security

#### Pod Security

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
```

#### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: gaia-api-network-policy
spec:
  podSelector:
    matchLabels:
      app: gaia-commons-api
  ingress:
    - from:
      - podSelector:
          matchLabels:
            role: frontend
      ports:
        - protocol: TCP
          port: 3000
```

#### Secrets Management

```bash
# Create secret
kubectl create secret generic gaia-db-secret \
  --from-literal=DB_PASSWORD=<secure-password>

# Use in deployment
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: gaia-db-secret
        key: DB_PASSWORD
```

## Security Checklist

### Before Deployment

- [ ] All dependencies updated and scanned
- [ ] No secrets in code or config files
- [ ] HTTPS/TLS configured
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled and tuned
- [ ] Error messages sanitized
- [ ] Database connections encrypted
- [ ] Logging configured (no sensitive data)
- [ ] Monitoring alerts set up
- [ ] Backup strategy implemented
- [ ] Security headers verified
- [ ] Input validation implemented
- [ ] SQL injection protection verified
- [ ] Container security configured
- [ ] Network policies applied

### Regular Maintenance

- [ ] Weekly dependency scans
- [ ] Monthly security audits
- [ ] Quarterly penetration testing
- [ ] Annual security review
- [ ] Rotate credentials regularly
- [ ] Review access logs
- [ ] Update security policies
- [ ] Security training for team

## Compliance

### Standards & Frameworks

The API follows security best practices from:

- **OWASP Top 10** - Web application security
- **CWE Top 25** - Common weaknesses
- **NIST Cybersecurity Framework** - Security controls
- **ISO 27001** - Information security (if applicable)

### Certifications

**Current:** None

**Planned:**
- SOC 2 Type II
- ISO 27001
- GDPR compliance (if handling EU data)

## Incident Response

### Security Incident Process

1. **Detection**
   - Monitor alerts
   - User reports
   - Security scans

2. **Containment**
   - Isolate affected systems
   - Block malicious traffic
   - Preserve evidence

3. **Investigation**
   - Analyze logs
   - Identify attack vector
   - Assess impact

4. **Remediation**
   - Apply fixes
   - Update credentials
   - Patch vulnerabilities

5. **Recovery**
   - Restore from backups
   - Verify system integrity
   - Resume operations

6. **Post-Incident**
   - Document lessons learned
   - Update security policies
   - Improve monitoring

### Contact Information

**Security Team:**
- Email: security@gaia-commons.org
- Emergency: [Phone number]
- PGP Key: [Public key fingerprint]

## Security Resources

### Internal Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database security

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

## Version History

- **v5.0.0** (2026-02-12): Initial security policy
  - Security headers with Helmet
  - Rate limiting
  - Request timeout
  - SQL injection protection
  - Secrets management guidelines
