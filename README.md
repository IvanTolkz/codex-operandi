# Codex Operandi

> A discipline framework for non-technical founders shipping production software with AI coding agents.

---

## Why this exists

In 2026, a non-technical founder can ship production-grade software using AI coding agents — Claude Code, Cursor, Copilot, and others. But "shipping" is not the hard part anymore. **Discipline is.**

An AI agent left without rules will:

- Generate code that compiles but breaks under real load
- Skip security checks because they slow it down
- Patch symptoms instead of fixing root causes
- Create parallel implementations that duplicate the existing system
- Ship "demo-grade" code that fails the first audit

The Codex Operandi is the playbook that prevents this. It is not a style guide. It is not a checklist. It is the **enforcement layer** that turns an AI agent into a disciplined engineer accountable to your product, your users, and your future team.

This framework was forged on Tolkerz between February and May 2026 by Ivan Boole — a non-technical founder who shipped 700+ tests, 80+ Row-Level Security policies, and a production MVP working with Claude Code as primary agent.

It works whether you have one Claude session or multiple agents running in parallel.

---

## The 5 criteria

Every artifact produced by an AI agent on your codebase must satisfy these five falsifiable criteria. If even one fails, the artifact is rejected — no exceptions.

### 1. Evolvable

The artifact must remain modifiable without rewriting. Code, documentation, and configuration that lock the team into a single path are forbidden.

**How to evaluate** — Can a future contributor change this without touching three other files? Are there hardcoded values that should be configuration? Is there parallel implementation drift?

**Anti-patterns** — Magic numbers, copy-paste duplication, parallel-build (creating `auth_v2.tsx` next to `auth.tsx` instead of refactoring), tight coupling to a vendor or library that cannot be swapped.

### 2. Traceable

Every change must be explainable from the commit log alone. The "why" of a decision must survive the agent that made it.

**How to evaluate** — Can a new contributor understand why this exists from `git log` and the linked issue or PR alone? Are decisions logged when made, or buried in chat history?

**Anti-patterns** — Drive-by commits with vague messages, undocumented architectural pivots, deferred decisions without trigger conditions in a tech-debt registry.

### 3. Scalable

The artifact must hold under realistic load — not the load of a demo. For Tolkerz, the bar is 100,000 users, 1,000 requests per second, 10,000 active rows in the largest tables.

**How to evaluate** — Does the query use an index? Is pagination cursor-based? Is the cache strategy explicit? Is state externalized (Redis, DB) or kept in process memory? Are N+1 queries forbidden?

**Anti-patterns** — `LIKE '%x%'` for search at scale, `offset/limit` on large tables, in-process state that breaks under multi-instance deployment, missing rate limits.

### 4. Auditable

Every action that touches user data or security boundaries must be reviewable after the fact. An auditor must be able to reconstruct what happened, by whom, and to what data.

**How to evaluate** — Are there logs at the boundaries (auth, payments, deletion, escalation)? Are sensitive operations gated by explicit checks? Is there a clear separation between public, user, and admin code paths?

**Anti-patterns** — Silent error handlers (`except: pass`), admin-level database clients used in user-facing endpoints, production data in test fixtures, missing rate limits on sensitive operations.

### 5. Team-able

The artifact must remain workable by a team that did not write it. This is the criterion that prevents "founder-only" code — software only the original author can maintain.

**How to evaluate** — Can a new engineer onboard without an oral tradition? Are conventions discoverable from the repo alone? Does the codebase have its own documentation, or only the founder's memory?

**Anti-patterns** — Cryptic naming (`tmp`, `data1`, `x`), undocumented business logic, "ask the founder" as the only escalation path, configuration spread across env vars, code, and chat messages.

---

## How to enforce — the 5 cercles

Discipline is not enforced by goodwill. It is enforced by a deterministic process applied before every action:

1. **STOP** — Does this problem actually exist? Read the code, read the recent commits, read the docs. The AI is biased toward agreeing the problem exists. Verify it yourself.

2. **RESEARCH** — How do experts solve this? Industry patterns, official documentation, real benchmarks. Never ask the AI for an opinion. Give it jurisprudence.

3. **GRID** — Define falsifiable criteria. Each criterion is binary — PASS or FAIL. No "should be fine," no "probably works."

4. **VALIDATION GATE** — Run the checks. Lint, build, type-check, tests, security scan. Output is the truth, not the agent's claim.

5. **AUTOMATION** — Loop until all criteria are PASS. The human is removed from the correction loop.

The discipline is not about writing better prompts. It is about **building gates the AI cannot skip**.

---

## How to enforce — example rules

The Tolkerz codebase enforces 40+ explicit rules in `.claude/rules/`. A representative sample:

| Rule | What it does |
|---|---|
| Never delete a test to make CI pass — restore the broken function instead | Prevents the AI from "fixing" by removing accountability |
| TypeScript mandatory for any new file in `src/` | Stops type-debt accumulation organically |
| Soft delete only — never hard-delete user data | Audit-friendly, GDPR-aligned, recovery-ready |
| User data uses RLS-scoped DB client; admin client requires staff verification | Defense-in-depth at the data layer |
| Anti-soap code grid (10 falsifiable criteria) checked before every commit | AI tendency toward soap code (the new spaghetti) is countered at write-time |
| Refactor in place — never create parallel implementations | Stops "lost day" incidents where the agent rebuilds next to existing code |
| Branch + PR required — main is protected by hooks and server-side branch protection | The founder is the merge gate, not the agent |
| Tech-debt and scale-debt tracked explicitly, with trigger conditions | Deferred decisions become visible, not invisible |

These rules are loaded into the agent context at every session start. The agent cannot operate without them.

---

## How to enforce — Watchtower

When multiple AI coding agents run in parallel, discipline must move from prompt-level intention to repo-level governance.

**Watchtower** is the Codex Operandi discipline for coordinating AI coding agents safely inside the same repository. It was originally drafted as **Control Tower**, then renamed Watchtower after the reference implementation was proven on Tolkerz.

Watchtower is not just a philosophy. It is a repo-level operating framework built around a simple chain:

1. **Claim before code** — an agent declares scope, intent, branch, and estimated work window before editing files.
2. **Bootstrap before work** — permission to work is established before the real implementation PR.
3. **Scope enforcement** — the pull request must stay inside the claimed files.
4. **Founder merge gate** — the agent never merges itself into `main`.
5. **Server-side release** — the claim is released only after merge, not before.

The easiest analogy is a meeting-room booking system: nobody should walk into the same room at the same time without knowing who reserved it and why. But Watchtower goes further than reservation. It is also the audit trail, the scope contract, the merge discipline, and the release protocol that keeps parallel AI work safe.

Read the chapter: [`docs/codex/chapter-watchtower.md`](docs/codex/chapter-watchtower.md)  
Founder-friendly guide: [`docs/codex/watchtower-for-non-technical-founders.md`](docs/codex/watchtower-for-non-technical-founders.md)

---

## What the Codex is not

- It is not a replacement for engineering judgment. It is the discipline layer that lets a non-technical founder enforce engineering standards they didn't grow up with.
- It is not a guarantee of correctness. It is a guarantee that errors are caught at gates rather than by users.
- It is not opposed to speed. It is the only sustainable way to be fast: a single broken PR costs more than a hundred validated ones.
- It is not generic. Each rule has a concrete origin in a real incident on a real product.

---

## How to adopt it

1. **Fork it.** Take what fits your domain. The 5 criteria generalize. The 40 rules are Tolkerz-specific examples — write your own.

2. **Forge your gates.** A criterion without a gate is a wish. A gate without a criterion is a checkbox. You need both.

3. **Track your dette.** Every deferred decision goes into a registry with a trigger. Otherwise it disappears.

4. **Keep the founder in the merge loop.** The agent ships to a branch. The founder merges. The branch protection enforces it server-side.

5. **Write down your why.** The rules will outlive you. The why behind them must too.

---

## License

This document is published under **CC-BY-4.0**. Use it. Adapt it. Build on it. Cite the origin if you ship something that owes its discipline to it.

Public reference: [github.com/IvanTolkz/codex-operandi](https://github.com/IvanTolkz/codex-operandi)

Forged on Tolkerz between February and May 2026 by Ivan Boole.

---

*The author remains non-technical. The system operates as if he were not.*