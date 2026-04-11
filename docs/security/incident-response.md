# Incident Response Plan

**Product:** AnswerTheQuestion! (ATQ)
**Owner:** Rebecca Everton
**Contact:** hello@answerthequestion.co.uk
**Last updated:** 11 April 2026
**Next review:** 11 October 2026

---

## 1. Purpose

This plan defines how ATQ detects, contains, investigates, and reports security incidents — especially personal-data breaches under UK GDPR Articles 33 and 34. It exists so that, under pressure, there is a single source of truth for who does what, in what order, and by when.

The service is used by children. **Any incident involving child data is automatically at least severity HIGH regardless of volume.**

---

## 2. Scope

In scope:

- Unauthorised access or disclosure of parent or child data
- Loss of availability of the service (extended outage)
- Loss of integrity of data (corruption, unauthorised modification)
- Compromise of credentials (Supabase, LemonSqueezy, Resend, GitHub, Vercel)
- Malicious code / supply-chain compromise in dependencies
- Abuse of the service (scraping, enumeration, brute force)
- Incidents at a third-party processor (Supabase, Vercel, LemonSqueezy, Resend, GA4)
- Lost or stolen device that had active credentials for any of the above

Out of scope (tracked separately in normal bug tracking):
- Functional bugs with no security or privacy impact
- Minor content errors

---

## 3. Severity classification

| Severity | Description | Examples |
|---|---|---|
| **S1 — Critical** | Confirmed unauthorised access to personal data, or full outage with data-loss risk | RLS bypass confirmed exploited; Supabase credentials stolen and used; webhook signing key leaked and orders forged |
| **S2 — High** | Probable data exposure not yet confirmed, or partial outage affecting paying users | Suspicious query pattern in Supabase logs touching cross-account data; Resend account phishing attempt with partial success; leaked token with unknown scope |
| **S3 — Medium** | Vulnerability discovered with no evidence of exploitation | CVE in dependency with no known exploit; rate-limit bypass reported via responsible disclosure; misconfigured CORS header |
| **S4 — Low** | Informational finding, no exposure | Outdated dependency, audit alert with patch already available, cosmetic header missing |

**Any incident involving children's personal data is automatically escalated at least one severity level.** An S3 finding that touches child data is handled as S2.

---

## 4. Roles

At present, ATQ is operated by a single person (Rebecca). Until additional roles exist, the following hats apply:

| Role | Responsibility | Current holder |
|---|---|---|
| **Incident commander** | Decides containment actions, owns the response, is the single point of truth | Rebecca |
| **Comms lead** | Drafts parent notifications, ICO notification, and any public statement | Rebecca |
| **Forensics lead** | Pulls logs, preserves evidence, reconstructs the timeline | Rebecca (with Claude assistance on request) |
| **Data protection lead** | Assesses legal obligations under UK GDPR | Rebecca |
| **Deputy** | Backup if Rebecca is unavailable for more than 8 hours | (to appoint before launch — record contact in private note, not in this repo) |

If Rebecca is unreachable, the deputy is authorised to take containment actions (revoke credentials, take the site offline, rotate secrets) without further approval.

---

## 5. Detection sources

| Source | What it tells us | Where to look |
|---|---|---|
| Supabase project logs | Auth failures, RLS denials, slow queries, unexpected inserts | Supabase dashboard → Logs |
| Supabase database logs | Query patterns, volume anomalies | Supabase dashboard → Database → Logs |
| Vercel runtime logs | Edge function errors, 4xx/5xx spikes | Vercel dashboard → Project → Logs |
| LemonSqueezy dashboard | Chargebacks, refund spikes, webhook delivery failures | LS admin |
| Resend dashboard | Bounce spikes, complaint spikes, delivery failures | Resend admin |
| Cloudflare / Vercel WAF | Rate limit hits, bot traffic, scraping attempts | Vercel dashboard → Firewall |
| GitHub security alerts | Secret scanning, Dependabot | GitHub → Security tab |
| Parent reports | Email to hello@answerthequestion.co.uk | Inbox (flag subject "SECURITY") |
| Responsible disclosure | Same inbox, subject "SECURITY DISCLOSURE" | Inbox |

Detection is currently **manual and reactive**. A dedicated alerting layer (e.g. Sentry for front-end, Logtail for Supabase, Better Uptime for availability) is on the post-launch roadmap. Until that lands, Rebecca checks Supabase and Vercel logs daily during the first 30 days after launch.

---

## 6. Response phases

The standard NIST SP 800-61 phases apply: **prepare → detect → contain → eradicate → recover → lessons learned**.

### 6.1 Preparation (steady state)

- This plan kept current; reviewed every 6 months
- Credentials inventoried in `docs/secret-rotation.md`
- Backups verified per `docs/backup-restore.md`
- Incident log template ready (see §10)
- Communication templates drafted (see §9)
- 2FA enabled on all admin accounts (GitHub, Vercel, Supabase, LemonSqueezy, Resend, domain registrar, email)

### 6.2 Detection and triage (0–1 hour)

1. **Acknowledge** the signal. Open a private incident log entry (§10). Note the timestamp in UTC.
2. **Classify severity** using §3. When in doubt, err high.
3. **Decide the blast radius.** Which systems? Which user populations? Any child data involved?
4. **Decide whether to invoke full response.** S1 and S2 always invoke. S3 invokes if child data is in scope or if there is any public-facing risk.

### 6.3 Containment (0–4 hours)

Objective: stop the bleeding before worrying about root cause.

**Credential compromise (any token, key, or password):**
- Rotate the credential at the source (issue new, revoke old). Use `docs/secret-rotation.md`
- Invalidate all sessions if the compromised credential unlocks user sessions
- Audit logs for any action taken by the old credential in the window from issue to revocation

**Data exposure suspected in the database:**
- Take the affected endpoint(s) offline (disable edge function, or flip a feature flag)
- Preserve a snapshot of the database before changing anything (Supabase Point-in-Time restore window is the fallback)
- Rotate service role key regardless of attack path

**Full outage:**
- Flip maintenance page on Vercel (static HTML with contact details; no dependency on Supabase)
- Confirm backups are accessible from `docs/backup-restore.md`
- Do not attempt recovery until root cause is understood

**Third-party processor incident:**
- Subscribe to the processor's status page in real time
- Freeze writes into that processor if possible (e.g. pause webhooks)
- Monitor incoming data for anomalies

### 6.4 Eradication and recovery (4–72 hours)

- Identify root cause. Write the timeline from the logs.
- Patch the underlying vulnerability. Deploy through the usual review pipeline — a security incident does **not** bypass the normal review process, because a rushed fix can make things worse.
- Restore from backup only if integrity of current data cannot be established.
- Bring the affected surface back online.
- Monitor for 24 hours after recovery for repeat signals.

### 6.5 Post-incident (within 5 business days)

- Write a post-mortem (blameless; see template in §11)
- Identify any control that would have prevented the incident and add it to the backlog
- Update this document if the response revealed a gap in the plan
- Update DPIA §8 risk register if the risk profile has changed
- Archive the incident log in an encrypted note (outside the repo) for 2 years

---

## 7. Legal obligations under UK GDPR

### 7.1 Personal data breach — definition

Under Art. 4(12), a "personal data breach" means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data. **It does not require confirmed exfiltration.** Loss of availability (e.g. permanent data loss due to a failed backup) is also a breach.

### 7.2 ICO notification — the 72-hour rule (Art. 33)

If the breach is **likely to result in a risk to the rights and freedoms of natural persons**, the ICO must be notified **within 72 hours of becoming aware of it**.

**"Becoming aware"** is the point at which Rebecca has a reasonable degree of certainty that a security incident has occurred that led to personal data being compromised. Mere suspicion is not awareness; confirmation of the incident (e.g. after a quick triage) is.

**If not notified within 72 hours,** the notification must still be made **as soon as possible**, accompanied by reasons for the delay.

**How to notify:** ICO online form at [ico.org.uk/for-organisations/report-a-breach/](https://ico.org.uk/for-organisations/report-a-breach/), or phone the ICO helpline on 0303 123 1113 for S1 incidents where the form is too slow.

**What to include (Art. 33(3)):**
- Nature of the breach, categories and approximate number of data subjects and records
- Name and contact details of the DPO or contact point (Rebecca, hello@answerthequestion.co.uk)
- Likely consequences
- Measures taken or proposed to address the breach and mitigate its effects

Information may be provided in phases if not all is available within 72 hours.

### 7.3 Data subject notification (Art. 34)

If the breach is **likely to result in a high risk** to the rights and freedoms of the affected individuals, **the individuals themselves must also be notified without undue delay**.

**High-risk indicators** (any one triggers notification):
- Child data exposed
- Credentials exposed (even hashed, if the attacker has the hash)
- Financial data exposed
- Special category data exposed (we do not process any, but verify)
- Large volume (>500 accounts)
- Data published, sold, or otherwise distributed
- Identity theft or fraud risk

**How to notify affected parents:** transactional email via Resend to the affected parent email addresses, in plain language, describing what happened, what data was involved, what the person can do, and the contact for further information. Template in §9.

**Exception (Art. 34(3)):**
- Encryption rendered the data unintelligible to the attacker
- Subsequent measures eliminate the high risk
- Individual notification would be disproportionate (in which case a public communication is made instead)

In practice, for a children's product, **always assume notification is required** unless there is a clear legal reason otherwise.

### 7.4 Records (Art. 33(5))

Every incident — regardless of whether ICO was notified — is recorded in the internal incident log (§10) with facts, effects, and remediation taken. Records are retained for 2 years minimum.

---

## 8. Notification timeline (target)

```
T+0h      Incident detected / reported
T+1h      Severity classified, incident log started, containment begun
T+4h      Containment verified; communication lead drafts notifications
T+12h     Root cause identified (target for S1/S2)
T+24h     Affected user population confirmed; DPIA risk review started
T+48h     Draft ICO notification reviewed if required
T+72h     ICO notification sent (Art. 33 deadline)
T+72–96h  Affected users notified if required (Art. 34); follow-up plan issued
T+5d      Post-mortem drafted
T+10d     Post-mortem reviewed; backlog items filed
T+30d     Implementation of preventative controls verified
```

This is a **target**, not a hard schedule. The true deadline is "without undue delay" and, for ICO, 72 hours.

---

## 9. Communication templates

### 9.1 Internal incident log entry (plain text, private note)

```
Incident: ATQ-YYYY-NN
Opened:   YYYY-MM-DDTHH:MM:SSZ
Severity: S1 | S2 | S3 | S4
Reporter: <source>
Summary:  <one sentence>
Timeline:
  HH:MM  Event
  HH:MM  Event
Scope:    Systems affected, data involved, user population
Status:   OPEN | CONTAINED | RESOLVED
Notes:    Actions taken, decisions made, links to evidence
```

### 9.2 Parent notification email (S1/S2 breach involving child data)

> **Subject:** Important: a security incident involving your AnswerTheQuestion! account
>
> Dear parent,
>
> On [date], we detected a security incident affecting the AnswerTheQuestion! service. We are writing to you directly because your account may have been affected.
>
> **What happened:** [one or two plain sentences — the honest version]
>
> **What information was involved:** [specific fields — do not generalise]
>
> **What we've done:** [containment, patching, credential rotation, notification of the ICO if applicable]
>
> **What this means for you:** [specific risk, specific action]
>
> **What you should do:**
> - [specific action, e.g. change your password]
> - [specific action, e.g. monitor for suspicious email]
>
> **Where to get more information:** Reply to this email or contact us at hello@answerthequestion.co.uk.
>
> **Your rights:** You have the right to complain to the UK Information Commissioner's Office at ico.org.uk. We have already notified the ICO of this incident. [or: We have assessed that notification to the ICO was not required because …]
>
> I am genuinely sorry that this happened. I take data protection seriously and I am committed to learning from this.
>
> — Rebecca Everton, Answer The Question

### 9.3 Public status note (for service availability incidents)

Short plain-text note on a status page or as a banner on the site:

> We are currently investigating a service issue affecting [feature]. We are working to restore normal operation and will update this message at least every 60 minutes. No action is required from you.

Update every 60 minutes. Do not speculate. Do not attribute blame.

### 9.4 ICO notification (use the ICO form, but draft offline first)

Use the fields listed in §7.2. Keep sentences factual and short. Avoid speculation. If information is missing, say so explicitly and give an estimated time of arrival.

---

## 10. Incident log (master list)

New incidents are appended here with a link to the private incident note. The public log contains identifier, date, severity, one-line summary, and status only — **never personal data, never internal details**.

| ID | Opened | Severity | Summary | Status |
|---|---|---|---|---|
| (none yet) | | | | |

---

## 11. Post-mortem template (blameless)

```markdown
# Post-mortem: ATQ-YYYY-NN

**Severity:** S?
**Duration:** From [UTC] to [UTC] ([duration])
**Impact:** [user population, data involved, downtime]
**Authors:** [names]
**Date:** [YYYY-MM-DD]

## Summary
One paragraph.

## Timeline (UTC)
- HH:MM — Event
- HH:MM — Event

## Impact
Who was affected and how.

## Root cause
Why it happened. Not who. Focus on the system, not the person.

## Resolution and recovery
What we did to stop it and restore service.

## What went well
- …

## What didn't
- …

## Action items
| # | Action | Owner | Due | Priority |
|---|---|---|---|---|
| 1 | … | … | … | P0/P1/P2 |
```

---

## 12. Forensics checklist

If evidence must be preserved for an S1 or regulatory investigation:

- [ ] Capture Supabase logs for the window ±1 hour around the incident
- [ ] Capture Vercel logs for the same window
- [ ] Capture LemonSqueezy webhook delivery history if payments are implicated
- [ ] Capture Resend logs if email is implicated
- [ ] Capture GitHub audit log if supply chain is implicated
- [ ] Snapshot the database using Supabase PITR at the latest safe point
- [ ] Export the repo state at the deployment that was live at incident time
- [ ] Record current versions of all deployed services
- [ ] Take screenshots of relevant dashboards
- [ ] Note the IP addresses and user agents from the logs (without aggregating with profile data)
- [ ] Store all evidence in an encrypted archive, outside of the main repo

Evidence retention: 2 years for any incident with regulatory or legal exposure; 1 year otherwise.

---

## 13. Escalation contacts

Contacts are kept in a private note, not in this repo. This section lists the categories that must exist.

| Category | Why |
|---|---|
| ICO | Breach notification (Art. 33) |
| Supabase support | Database incidents, account compromise |
| Vercel support | Hosting incidents, DDoS protection |
| LemonSqueezy support | Payment fraud, chargeback patterns, webhook failure |
| Resend support | Email delivery issues, compromised sending domain |
| GitHub support | Repo compromise, leaked secrets |
| Domain registrar | DNS compromise |
| Legal counsel | For S1 involving children's data or regulatory risk |
| Insurance (if applicable) | Cyber insurance claim |
| Deputy incident commander | If Rebecca is unreachable for 8+ hours |

---

## 14. Drills and review

- **Tabletop exercise:** every 6 months, walk through a simulated S1 incident end-to-end. Record any gap and update this plan.
- **Restore drill:** monthly, per `docs/backup-restore.md`.
- **Secret rotation drill:** quarterly, per `docs/secret-rotation.md`.
- **Plan review:** every 6 months, or immediately after any incident severity S2 or higher.

Next tabletop: **11 October 2026**.

---

## Appendix — Related documents

- `/docs/DPIA.md` — Data Protection Impact Assessment
- `/docs/secret-rotation.md` — Credential rotation procedure
- `/docs/backup-restore.md` — Backup cadence and restore drill
- `/docs/environment-separation.md` — Dev / staging / prod isolation
- `packages/shared/src/pages/PrivacyPolicyPage.tsx` — Public privacy policy
