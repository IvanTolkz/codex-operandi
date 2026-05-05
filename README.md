# Codex Operandi

> A discipline framework for non-technical founders shipping production software with AI coding agents. Forged on Tolkerz between February and May 2026 by Ivan Boole. Public reference: [github.com/IvanTolkz/codex-operandi](https://github.com/IvanTolkz/codex-operandi).

---

## Genesis — Why this Codex exists

This Codex was not written by an experienced engineer formalizing best practices. It was written by a **non-technical co-founder learning on the job**, convinced he was building the platform that would change how people interact online around shared physical experiences.

Precisely because the author has no ten-year engineering background, this Codex exists. Without a senior CTO instinct to catch technical drift in real-time, the system catches it instead — rules, hooks, automated peer review, harness-level gates, and a file architecture that forces every actor (human or AI agent) to respect the invariants.

The stake: avoid the **technical storm at hard go-to-market**. When a product takes off, bad technical choices do not forgive. Twelve months of accumulated tech debt explode in forty-eight hours. Many startups miss their scaling window at exactly that moment — not for lack of product-market fit, but because the stack does not hold the load.

This Codex is therefore an **insurance policy**. Over-investing in discipline upfront to buy the right to scale later. Not for perfectionism. For survival.

The author remains non-technical. The system he built operates as if he were not.

---

## Manifesto — The 6 criteria

Every artifact in this Codex must satisfy six falsifiable criteria. Not vague best practices — yes/no lenses. Failing one is documented (corrected immediately, or tracked with a falsifiable reactivation trigger).

### 1. Domain-faithful (Métiable)

A function, module, or technical decision is *Domain-faithful* when it respects 100% of the business objective it claims to serve, and when that fidelity is verifiable rather than assumed. The most expensive failure mode in early-stage startups is not the technical bug — it is the technically perfect feature that misses the business goal.

### 2. Evolvable

A system is *evolvable* when one can **add** a feature without triggering regression, and **remove** a module without fear of breaking the rest. Many systems are modifiable but not cleanable. The lasagna syndrome destroys legibility within twelve months. *Evolvable* requires both add and remove tests passing.

### 3. Traceable

An action on the system is *traceable* when, at any moment, one can find **who** did **what**, **when**, and **why**, without depending on a human's memory. Three moments where its absence kills: investor due diligence, production incidents, GDPR or security breaches.

### 4. Scalable

A system is *scalable* when it supports usage growth across multiple orders of magnitude without major refactoring. Tolkerz target: **100,000 concurrent users minimum**. Anticipating scale on day one means eliminating choices that prevent scaling: full-table scans, N+1 queries, in-process state, LIKE pattern search, OFFSET pagination.

### 5. Auditable

A system is *auditable* when its security state can be **proven**, not assumed, by an outside party with read access to the public repo. *Secure* is an assertion. *Auditable* is a verification.

### 6. Team-able

A system is *team-able* when an outside developer with standard stack experience becomes operational in **less than three hours** by reading the code and root documentation files. The today-solo-founder is the five-person team of tomorrow.

### How to evaluate a PR with the 6 criteria

A single failed criterion uncorrected blocks merge. Required CHECKPOINT format covers all six criteria with binary pass/fail and notes if failed.

---

## The 40 rules — Quick index

Rules are stored in `.claude/rules/<N>-<slug>.md` and referenced in `CLAUDE.md`. Every Claude session loads them at start.

| # | Slug | One-line summary |
|---|------|------------------|
| 01 | config-context | Never hardcode business types — use useConfig() |
| 02 | permissions | Never read user.role directly — use hasPermission() |
| 03 | soft-delete | Never raw delete — use lifecycle service |
| 04 | id-system | Stable prefixed IDs (usr_, tlk_, etc.) |
| 05 | pages-config | pages.config.js is auto-generated |
| 07 | style-conventions | shadcn/ui + Tailwind + lucide-react |
| 10 | cto-discipline | Never affirm without verifying |
| 13 | scale-mindset | Always think 100k+ users |
| 14 | prise-en-main | Read state at session start; update every 30 min |
| 15 | audits-auto | Daily security/architecture audits via hooks |
| 16 | skills-obligatoires | Always invoke domain skills |
| 17 | browser-use | Use /browse after every deploy |
| 18 | internal-map | Confidential — never expose URLs |
| 19 | never-delete-to-fix | Restore and reinforce — never delete tests |
| 20 | five-circles | STOP, RESEARCH, GRID, TRIBUNAL, AUTOMATION |
| 21 | branch-automatisation | Always branch + PR — never push direct main |
| 22 | check-before-modify | Read recent commits before any modification |
| 23 | typescript-enforcement | All new files in src/ are TypeScript |
| 24 | supabase-client-side | SDK frontend = Auth + Realtime only |
| 25 | events-via-emit-event | State changes via emit_event() |
| 26 | rls-vs-admin-client | RLS for user data, admin only after is_staff |
| 27 | anti-soap-code | 10-criterion grid + CodeGod /70 review |
| 28 | caveman-mode-security | Security rules absolute even in fast mode |
| 29 | agent-directive-absolue | Never patch — fix at source |
| 30 | speed-contract | Public data without authLoading wait |
| 31 | uuid-not-email | UUID for references — email only for Auth |
| 32 | gstack-policy | Skills whitelist/blacklist enforced |
| 33 | railway-tooling-policy | Railway MCP read-only diagnostic |
| 34 | tech-debt-tracking | Every deferred decision tracked |
| 35 | peer-review-cross-agent | Author to reviewer matrix fixed |
| 36 | gates-enforcement | Gate 1 (cercles) + Gate 2 (PR review) |
| 37 | no-parallel-implementations | Refactor in place — never duplicate |
| 38 | test-worktree-hygiene | vitest no-file-parallelism + branch verify |
| 39 | pnpm-only | npm/yarn forbidden — pnpm via Corepack |
| 40 | synchro-work-coordination | /synchro claim at session start |

---

## Multi-agent coordination — The synchro-work primitive

When multiple agents (humans, Claude Code instances, Cowork sessions) operate on the same repo simultaneously, a lightweight coordination mechanism is mandatory to prevent silent overwrite.

The Codex retains a **minimum viable mechanism**: a markdown file (`docs/synchro-work.md`) versioned in git as the active sessions journal. Agents declare scope at session start, upgrade to PR-ready when opening a pull request, and detect conflicts by scope intersection before they become costly.

V1 ambitious design (locks, heartbeat, ML, dashboard) was rejected by senior CTO critique as cargo-cult distributed-systems theater. V2 minimum viable retained.

---

## Core skills

| Skill | Trigger | Effect |
|-------|---------|--------|
| /preflight | Before any heavy edit | Verifies clean worktree, no zombie vitest, correct branch |
| /refactor-wave | File > 800 LOC | Codifies the V5 to V16 pattern |
| /peer-review-checkpoint | Before merge | Generates structured CHECKPOINT |
| /synchro | Session start, PR open | Multi-agent coordination |
| /insights-review | Every 14 days | Reviews /insights report, proposes updates |

---

## Process discipline summary

### The 5 cercles (rule 20)

1. STOP — does the problem really exist?
2. RESEARCH — how do experts solve this?
3. GRID — falsifiable yes/no criteria
4. TRIBUNAL — every criterion = PASS/FAIL
5. AUTOMATION — agent to tribunal to correction loop until PASS

### Anti-soap code (rule 27)

10-criterion grid before commit: length, explicit names, zero magic, SOLID/SRP, DRY, OWASP, testable, comments WHY only, scale-ready, error handling.

### Local validation (rule 29)

Tribunal local with pnpm install frozen-lockfile, lint, build, test no-file-parallelism, plus ruff + pytest if backend touched. Push without local validation = forbidden by Husky pre-push hook.

---

## Decisions deliberately out of scope

The Codex made conscious choices to **not** include certain ambitious patterns:

- Kafka for cron jobs — overkill at current volume
- ML scope inference — pure theater, no value over plain glob intersection
- Real-time hooks dashboard — building a product inside the product
- Heartbeat for synchro-work — passive TTL is sufficient
- Cross-repo coordination — forced coupling rejected

Tracked as post-traction reactivation candidates.

---

## License

CC BY 4.0 — free reuse with attribution.

## Author

**Ivan Boole** — [@ivbconcept](https://github.com/ivbconcept)
Forged on Tolkerz, February to May 2026.

---

*The author remains non-technical. The system operates as if he were not.*
