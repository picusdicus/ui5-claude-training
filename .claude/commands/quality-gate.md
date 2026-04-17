Form a team to do a complete quality gate on the current codebase:

- Architect (reviews overall structure, routing, component design)
- Security Reviewer (checks for hardcoded strings, exposed credentials, 
  unsafe OData calls, missing input validation)
- Performance Analyst (checks binding efficiency, model usage, 
  lazy loading, bundle size impact)
- i18n Auditor (verifies ALL user-facing strings use i18n, 
  finds any hardcoded text)

Each team member reviews the full webapp/ folder independently.
Lead consolidates findings into a single report with:
- One section per role
- Overall project health score /100
- Top 5 critical fixes across all roles