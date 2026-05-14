# Chapter — Control Tower

> The discipline of letting many agents work in parallel without stepping on each other — through declared scopes, isolated work-trees, and a single coordination layer that knows who is doing what.

---

## The problem this solves

In 2026, the non-technical founder who wants to scale shipping faces a parallelism paradox: AI agents are cheap and abundant, but coordinating them is harder than coordinating humans.

- Spawn one agent and it works. Spawn four agents and they step on each other within minutes.
- Two agents editing the same working directory create phantom modifications, lost stashes, and silent overwrites.
- One agent renames a function in `lib/auth.ts`; another agent calls that function from `pages/login.tsx`. Each branch compiles independently, but the merge breaks production.
- A force-push by an agent erases the commit another agent just made.
- The founder ends up as the human bus that carries context between agents — answering the same questions five times an hour.

The classical solutions don't work:

- **Trust** — every agent operates under the assumption that other agents respect the same rules, but agents drift, hallucinate, or skip steps under load.
- **Naming conventions alone** — a branch called `claude/feature-X` doesn't prevent another agent from also touching the same files; conventions describe intent, not enforcement.
- **Manual review at merge time** — by the time a conflict surfaces in a pull request, both agents have already invested an hour, the diff is large, and rolling back costs trust.
- **Locking the codebase to one agent at a time** — solves the conflict but kills the leverage; the whole point of AI agents is parallelism.

The result: a founder who could in principle orchestrate ten agents in parallel ends up using one agent serially, because the cost of coordination exceeds the benefit of leverage.

---

## The pattern — Control Tower

A discipline named after aviation: a control tower does not fly the planes — it ensures none of them lands on the same runway. The Tower owns no aircraft, owns no destination, and writes no code. Its only authority is over **who occupies what airspace and when**.

In a multi-agent codebase, the Tower is a coordination layer — a stateful, queryable, append-only source of truth that answers three questions at any moment:

1. *Which agents are currently active, and on which scope?*
2. *Does this new claim conflict with any active claim, or with any open pull request?*
3. *Which dependencies cross between active scopes that the agents themselves may not see?*

### Three principles

1. **No shared working directory.** Each agent operates inside its own physically isolated work-tree, linked to the same repository but on a separate branch. Agents cannot see one another's uncommitted modifications. Conflicts surface at merge time, not as silent overwrites mid-session.

2. **Declared scope precedes any edit.** An agent must register its intended scope with the Tower before touching the codebase. The Tower either approves the claim, refuses it for overlap with an active claim, or escalates the decision to the founder.

3. **The Tower never codes.** The Tower has read-only authority over scope declarations and the right to veto. It never proposes diffs, never resolves conflicts itself, never opens pull requests. Its neutrality is the source of its trust.

### The five-step protocol

| Step | Actor | Action |
|---|---|---|
| 1. **Claim** | Agent | Declares scope (file globs, intent, branch name) to the Tower |
| 2. **Work** | Agent | Codes inside isolated work-tree on its dedicated branch |
| 3. **PR** | Agent | Opens pull request targeting `main` with claim identifier auto-injected |
| 4. **Approve** | Founder | Reviews the pull request notified by the Tower, validates, and merges |
| 5. **Release** | Tower | Frees the scope, auto-deletes the branch, archives the claim record |

A step skipped breaks the chain: an agent that codes without claiming, or merges without founder approval, falls outside the Tower's authority and reintroduces the chaos the discipline exists to prevent.

---

## The four enforcement layers

A coordination layer that lives only inside the founder's machine is bypassable; agents can edit local hooks, use the `--no-verify` flag, or simply ignore the protocol. The Tower must be enforced at four independent layers, each catching what the layers above it miss.

### Layer 1 — Agent harness (per-agent setup)

The configuration that defines what each agent is allowed to do at spawn time. Deny lists prevent the agent from running destructive commands. Tool restrictions scope the agent to its own work-tree. A pre-task script enforces the call to the Tower before any edit is permitted.

- **What it catches**: agents that would skip the claim step by inattention
- **What it misses**: a deliberately malicious or hallucinating agent that bypasses its harness
- **Trust level**: configurable, not enforceable

### Layer 2 — Local Git hooks (Husky pre-commit, pre-push)

Hooks that fire on the agent's machine before any commit or push is sent to the server. They verify the staged diff is inside the declared scope, run linting and type-checking, and refuse pushes to protected branches.

- **What it catches**: scope drift in good-faith agents
- **What it misses**: an agent that runs `git commit --no-verify` or edits the hook file itself
- **Trust level**: easily bypassed in principle; useful as a soft fence

### Layer 3 — Continuous integration (server-side checks on pull request)

GitHub Actions, GitLab pipelines, or any equivalent system runs on the platform, not on the agent's machine. The CI verifies the pull request targets the correct base, references a valid Tower claim, contains a proof-of-discipline artifact (such as a stratigraphy entry), and passes all tests on a virtual merge with the latest target branch.

- **What it catches**: missing artifacts, drift between claim and diff, semantic conflicts surfaced by type-checking on the virtual merge
- **What it misses**: nothing the agent can produce locally; CI is the first line the agent cannot rewrite
- **Trust level**: high — runs in an environment the agent does not control

### Layer 4 — Server-side branch protection (the wall)

The repository's own rules: required status checks, required reviews, restricted push permissions, linear history, merge queue. These rules are configured once, by the founder, on the platform itself, and cannot be bypassed by any agent regardless of its capabilities.

- **What it catches**: every attempt to push directly to `main`, force-push history, merge without checks, or skip the founder approval
- **What it misses**: nothing within the platform's enforcement model
- **Trust level**: absolute — the final boundary

The four layers compose by redundancy. An agent that bypasses Layer 1 still hits Layer 2; one that disables Layer 2 still faces Layer 3; one that somehow defeats Layer 3 cannot reach beyond Layer 4. Coordination is the product of all four, not the strongest of them.

---

## Cross-references with other Codex disciplines

Control Tower does not replace existing disciplines — it composes with them and feeds them.

| Discipline | Relationship to Control Tower |
|---|---|
| **Technical Stratigraphy** | Every Tower-released merge auto-emits a stratigraphy entry on the topic file matching the claim scope. Coordination produces memory as a by-product. |
| **The five circles** | Circle 4 (validation gate) is the moment the Tower hands control to the founder; circles 1 to 3 happen inside the agent's scope before the claim is even released. |
| **Tech debt registry** | A scope conflict that cannot be resolved becomes a `LATER` entry — the deferred reconciliation is logged, dated, and assigned a trigger. |
| **Veto** | The Tower is the operational instrument of veto: a claim refused, a scope adjusted, a pull request held back. Veto without Tower is opinion; Tower without veto is paperwork. |
| **Anti-soap code** | The Tower can refuse a claim whose scope is too broad for a single coherent unit of change, enforcing single-responsibility at the planning step rather than at review. |

---

## Why this pattern matters for the non-technical founder

A technical co-founder coordinates through code review, architectural discussion, and shared intuition built over years. A non-technical founder using AI agents has access to none of these channels by default. The founder cannot read every diff, cannot intuit which files are coupled, cannot predict which two agents will collide.

Without a Tower, the founder becomes the coordination layer: interrupting work to ask each agent what it is doing, repeating context between sessions, resolving conflicts manually at every merge. The founder's day is consumed by what a senior engineer would handle silently.

With a Tower, the founder reviews a single dashboard. The dashboard shows who is working on what, which pull requests are ready for approval, which scopes overlap. The founder is escalated only when a decision is required — a conflict to arbitrate, a pull request to validate, a scope to redefine. The rest is invisible.

This is the discipline that lets a non-technical founder run a team of agents as if they were a team of engineers — without becoming one.

---

## Implementation checklist

To adopt Control Tower in a project:

1. **Adopt the work-tree-per-agent rule.** No two agents may operate in the same directory under any circumstance. Each agent receives its own work-tree, its own branch, its own commit history.

2. **Install a file-based state directory.** A single folder (such as `.controltower/active/`) holds one JSON file per active claim. Claims contain scope globs, branch name, start time, and dependent files computed from the import graph.

3. **Build the claim CLI.** A small executable (`bin/controltower` or equivalent) exposes four verbs: `claim`, `check-scope`, `status`, `release`. Every agent and every hook calls this CLI; nothing else writes to the state directory.

4. **Wire the four enforcement layers in order.** Start with Layer 4 (branch protection on the platform — ten minutes of configuration). Add Layer 3 (CI checks on pull request). Then Layer 2 (local hooks). Layer 1 (agent harness) is the last because it is the most cosmetic and the most situational.

5. **Define the cross-file detection level.** A minimum viable Tower greps for imports; a richer Tower uses a dependency graph or language-service queries to detect symbol-level coupling between active scopes. Start with grep; iterate later.

6. **Optional: spawn a Tower agent.** A read-only AI agent whose only role is to read the state directory, list open pull requests, and surface conflicts or stale work as a dashboard for the founder. This agent does not code, does not merge, does not advise on technique. It reports.

A criterion to validate adoption: **no two agents ever work on the same file without one of them knowing the other exists**. If that property fails once, the Tower failed; the discipline must be reinforced before the next parallel session.

---

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Two agents in the same working directory | Stashes collide, modifications interleave, edits are lost without warning |
| Claiming after coding | The conflict is discovered when the agent attempts to push — already an hour of wasted work |
| Tower agent that also writes code | The Tower loses neutrality and becomes a fifth competitor stepping on the others |
| Trusting local hooks alone | Bypassable with one flag; the Tower must reach the server to be real |
| Scopes defined as file paths only | Misses cross-file dependencies and symbol-level coupling; the Tower must understand imports, not just folders |
| Founder approving every claim by hand | The Tower exists to escalate only when needed; if the founder is the bottleneck, parallelism is lost |
| Releasing the scope before the merge | The branch may still hold uncommitted state or trigger CI failures; release follows merge, never precedes it |

---

## The metaphor in one line

> *A control tower does not fly the planes — it ensures none of them lands on the same runway.*

---

## Status

Pattern defined 2026-05-14, forged from a documented multi-agent incident: two Claude Code sessions operating on the same working directory, leading to a corrupted git index, dozens of stale lock files, and a forced reclone of the repository. The pattern is the discipline; the instruments are still in design.

The pattern is candidate for inclusion in the public Codex Operandi as a chapter under *Multi-agent coordination*, sibling to Technical Stratigraphy.

Planned instruments — **none operational yet** unless noted:

- `.controltower/active/` — proposed state directory, one JSON file per active claim
- `bin/controltower` — proposed claim CLI, four verbs only (`claim`, `check-scope`, `status`, `release`)
- `.husky/pre-commit` — existing hook to be extended to call `controltower check-scope`
- `.github/workflows/enforce-rules.yml` — proposed Layer 3 CI workflow
- Branch protection rules on the platform — **already operational** for the reference Tolkerz repository (Layer 4 is the only enforcement layer live today)
- Optional Tower agent prompt configuration for the read-only dashboard — to be drafted

First implementation milestone: ship `bin/controltower claim` + minimal `.controltower/active/` directory schema, then layer the hook and CI on top.

---

*The founder remains non-technical. The agents work as if a senior engineer were in the room.*
