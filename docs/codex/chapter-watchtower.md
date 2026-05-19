# Chapter — Watchtower

> A repo-level governance framework for AI coding agents: claim before code, scoped work, founder merge authority, and release only after the repository is safe.

---

## Former name

Watchtower was originally drafted as **Control Tower**.

The old name described the metaphor: a tower coordinating traffic so that no two agents land on the same runway. The final name is **Watchtower** because the discipline is broader than traffic control. It watches the repository, records who is allowed to change what, enforces the scope, and preserves the audit trail.

---

## The problem this solves

AI coding agents make parallel work cheap. Coordination does not become cheap automatically.

A founder can run several agents at once, but the repository can become untrustworthy if those agents do not coordinate:

- two agents edit the same file in incompatible directions;
- one agent expands scope silently;
- a branch compiles alone but breaks when merged with another branch;
- local hooks are skipped or bypassed;
- the founder becomes the human bus carrying context between agents;
- plausible code is produced while the repository state becomes unsafe.

The failure mode is not only “bad code.” The deeper failure is **unreliable repo state**.

A non-technical founder cannot be expected to detect every hidden file conflict, dependency edge, or scope drift by intuition. The repo itself must expose the conflict before the work reaches `main`.

---

## Definition

**Watchtower is a repo-level governance framework for AI coding agents.**

It defines who may change what, on which branch, under which intent, with which proof path, and when that permission is released.

A simple analogy helps at the first layer: a meeting-room booking system. Nobody should walk into the same room at the same time without knowing who reserved it and why.

But Watchtower is not only a booking system. It is also:

- the audit trail;
- the scope contract;
- the branch discipline;
- the CI gate;
- the founder merge boundary;
- the release protocol.

---

## The agent experience that forced V2

The first version of this discipline was enough to describe the problem. It was not enough to make the workflow smooth under real agent pressure.

A real multi-agent session exposed the gap. The agent produced useful work, but the coordination layer created visible friction: claims, branch state, required proof artifacts, merge rules, and release timing all mattered more than expected.

The lesson was precise:

> The incident was not that the agent wrote bad code. The incident was that an agent could write plausible code while the repository state became untrustworthy.

That session forced the move from a pattern to a protocol.

V1 was coordination by intention:

- agents were expected to declare scope;
- agents were expected to respect branch discipline;
- humans were expected to notice when the process drifted.

V2 is coordination by enforcement:

- claim before code;
- bootstrap before work;
- work must stay inside the claim;
- CI is authority, not local optimism;
- branch protection is the wall;
- release happens after merge, never before;
- admin bypass is not a normal workflow.

This is the core lesson of Watchtower: **trust the agent less; verify the repository more.**

---

## Useful friction vs accidental friction

Watchtower deliberately keeps some friction.

Useful friction protects the repo:

- declaring scope before editing;
- refusing overlapping claims;
- keeping claims immutable after bootstrap;
- requiring a PR body to reference the claim;
- blocking work outside the declared scope;
- releasing a claim only after merge.

Accidental friction does not protect anything:

- unclear CLI errors;
- missing help output;
- required artifacts that are not mentioned at claim time;
- checks that fail late when they could fail early;
- local duplicate artifacts after a server-side release.

The design goal is not “remove friction.” The design goal is:

> Remove accidental friction while defending useful friction.

---

## The Watchtower protocol

### 1. Claim

Before changing files, the agent declares:

- agent name;
- branch name;
- scope of files or directories;
- intent;
- estimated work window.

The claim is a contract. It answers: who is working, where, why, and for how long.

### 2. Bootstrap

The permission boundary is established before the real work begins.

A bootstrap step prevents self-permission escalation: the agent cannot simply grant itself a broader scope inside the same work PR that depends on that scope.

### 3. Work

The agent works on its own branch or worktree. The work PR must stay inside the declared scope.

If the required scope changes, the agent must stop and request a new decision. It does not silently expand the claim.

### 4. Validate

The repository validates the work, not the agent’s confidence.

CI and branch protection are the authority. Local hooks are helpful feedback, but they are not the wall.

### 5. Merge

The founder remains the merge gate. An AI agent may prepare work, but it does not merge itself into `main`.

### 6. Release

The claim is released after merge. Releasing before merge reopens the scope while unmerged work still exists, which creates a dangerous window.

---

## Fast Track and Strict Track

Watchtower should support two tracks.

### Fast Track

Fast Track is for a single low-risk writer working alone.

Fast Track does not mean “no Watchtower.” It means registered low-friction governance: the agent is still visible, scoped, and accountable, but the ceremony is reduced.

Fast Track is appropriate when:

- there are no other active writer claims;
- there are no open Watchtower work PRs touching the same area;
- the scope is narrow;
- the files are not sensitive;
- the repo is clean.

### Strict Track

Strict Track is for parallel agents, sensitive files, broad scopes, or any overlapping work.

Strict Track uses the full protocol: explicit claim, bootstrap, scoped work PR, CI enforcement, founder merge gate, and release after merge.

### Current posture

When in doubt, choose Strict Track.

Fast Track is a design target for reducing solo-agent friction safely. It must never become a hidden bypass.

---

## Sub-agents and write authority

Watchtower should not count conversations. It should count write authority.

A read-only sub-agent does not need a separate claim. Examples:

- reviewer;
- researcher;
- architecture critic;
- security reader;
- test planner.

A writing helper inside the same branch, same PR, and same claimed scope can be treated as a delegated helper. The parent agent remains responsible.

A writing sub-agent touching a different scope needs its own claim and should use Strict Track.

Rule:

> Watchtower governs repository writes, not chat sessions.

---

## The four enforcement layers

### Layer 1 — Agent harness

The agent starts with instructions, deny lists, and task boundaries.

Useful, but not enough. Prompts can be forgotten, misread, or bypassed.

### Layer 2 — Local hooks

Local hooks catch mistakes early before commit or push.

Useful, but still not enough. Local hooks are feedback, not authority.

### Layer 3 — CI

CI runs outside the agent’s machine. It checks that the PR targets the correct base, references a valid claim, stays in scope, and passes validation on the repository’s current state.

CI is where Watchtower becomes enforceable.

### Layer 4 — Branch protection

Branch protection is the wall.

It prevents direct pushes to `main`, requires checks, protects history, and keeps the founder in the merge loop.

---

## Cross-references with other Codex disciplines

| Discipline | Relationship to Watchtower |
|---|---|
| Technical Stratigraphy | Watchtower creates traceable change history by forcing intent, scope, branch, PR, and release to be explicit. |
| The five cercles | Watchtower strengthens the validation gate: the agent cannot skip from idea to merge without proof. |
| Tech-debt registry | A blocked or conflicting scope can become a deferred decision with owner and trigger. |
| Veto | Watchtower operationalizes veto: a claim refused, narrowed, or held back becomes an enforceable decision. |
| Anti-soap code | Watchtower can reject broad claims that invite shapeless, multi-purpose changes. |

---

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Two agents in the same working directory | Stashes collide, edits interleave, and state becomes untrustworthy. |
| Claiming after coding | Conflict is discovered after time has already been spent. |
| Letting agents widen their own scope | The agent becomes its own permission authority. |
| Reusing another agent’s claim without human approval | Traceability between agent, intent, branch, and PR breaks. |
| Trusting local hooks alone | Local hooks can be bypassed; CI and branch protection must remain authoritative. |
| Releasing before merge | Another agent may claim the same scope while unmerged work still exists. |
| Treating admin bypass as routine | The exception becomes the process and destroys the wall. |

---

## Implementation checklist

To adopt Watchtower in a repository:

1. Require a dedicated branch or worktree per agent.
2. Add a claim schema with agent, branch, scope, intent, timestamp, status, PR, and claim id.
3. Add a command or script that can claim, check scope, show status, and release.
4. Add a bootstrap step so agents cannot grant themselves scope inside the work PR.
5. Add CI that validates PR scope against the authoritative claim.
6. Protect `main` with required checks and review.
7. Release claims only after merge.
8. Document Fast Track vs Strict Track before enabling low-friction solo paths.
9. Document sub-agent write authority.
10. Run one full cycle before trusting parallel agents.

---

## Status

Watchtower was forged from real multi-agent coordination failures and hardened through the Tolkerz reference implementation.

The public Codex chapter describes the discipline and the generalized framework. Implementation kits should be adapted to each repository and must not copy private production credentials, tokens, or internal runbooks.

---

*The founder remains non-technical. The repository behaves as if a senior engineer is enforcing the boundaries.*
