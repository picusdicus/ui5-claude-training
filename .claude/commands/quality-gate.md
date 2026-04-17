---
description: Runs a 4-role agent team quality gate on the codebase and produces a scored report
allowed-tools: Read, Grep, Glob
---

Form a team to do a complete quality gate on this SAP UI5 project:

- Architect (reviews overall structure, routing, component design, 
  manifest.json completeness)
- Security Reviewer (checks for hardcoded strings, exposed credentials,
  unsafe OData calls, missing input validation, unvalidated route parameters)
- Performance Analyst (checks binding efficiency, $select usage,
  lazy loading, bundle config, Component-preload setup)
- i18n Auditor (verifies ALL user-facing strings use i18n,
  finds hardcoded text, checks concatenation patterns)

Each team member reviews the full webapp/ folder independently.
Lead consolidates findings into a single report with:
- Score table: Role | Score /25 | Summary
- Top 5 critical fixes with: Priority | Finding | Flagged By | Fix
- Overall health score /100
- Verdict: production-ready or blockers present

$ARGUMENTS