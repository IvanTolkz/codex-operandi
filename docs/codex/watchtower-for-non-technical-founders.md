# Watchtower for Non-Technical Founders

> A plain-language guide to understanding and operating Watchtower without pretending to be a senior engineer.

---

## The strong definition

**Watchtower is a repo-level governance framework for AI coding agents.**

It helps a founder answer four questions before an agent changes code:

1. Who is working?
2. What files are they allowed to touch?
3. Why are they touching them?
4. When is that permission released?

Without those answers, several agents can produce good-looking work while the repository becomes unsafe.

---

## The meeting-room analogy

At the simplest level, Watchtower does for code what a reservation system does for meeting rooms.

Before modifying files, an agent must officially declare:

> “These files are mine for this task, for this estimated amount of time.”

In the analogy:

| Meeting-room world | Code world |
|---|---|
| Room | Files or folders |
| Meeting | Task |
| Person | AI coding agent |
| Reservation | Claim |
| Calendar | Watchtower state |
| Check-out | Pull request merge |
| Room released | Claim released |

But Watchtower is not only a booking system.

A booking system only says “this room is taken.” Watchtower also says:

- what the agent intends to do;
- which branch it must work on;
- which files are inside or outside scope;
- which checks must pass;
- who is allowed to merge;
- when the permission ends.

---

## Why AI agents need this

AI agents are fast, but they do not naturally coordinate.

If you ask one agent to change the login page and another agent to change the same authentication files, both can produce plausible work. Each agent can be locally right and globally dangerous.

The problem is not always code quality. The problem is repository trust.

A non-technical founder needs the repo to reveal conflicts early because the founder cannot manually inspect every file dependency, hidden coupling, or branch interaction.

Watchtower makes the invisible visible.

---

## Example without Watchtower

Agent A starts improving the signup flow.

Agent B starts fixing a bug in the same auth module.

Both agents work on separate branches. Both believe their work is valid. Both pass their own local checks.

At merge time:

- one branch renamed a function;
- the other branch still calls the old function;
- both diffs are large;
- nobody knows which agent owns the final decision;
- the founder becomes the conflict resolver.

This is how parallelism becomes expensive.

---

## Example with Watchtower

Agent A claims:

```txt
agent: signup-flow
scope: src/auth/**, src/signup/**
intent: improve signup flow and auth handoff
branch: agent/signup-flow
estimated window: 2 hours
```

Agent B tries to claim:

```txt
agent: auth-bugfix
scope: src/auth/**
intent: fix token refresh bug
branch: agent/auth-bugfix
estimated window: 45 minutes
```

Watchtower detects the overlap.

Now the system can decide before damage happens:

- Agent B waits.
- Agent B narrows the scope.
- The founder explicitly authorizes a coordinated plan.
- One agent becomes a read-only reviewer instead of a writer.

The conflict moves from merge time to planning time.

That is the point.

---

## The five words to remember

```txt
claim before code
```

This is the heart of Watchtower.

Before an agent changes files, it must declare its work. If the agent cannot explain the scope, intent, branch, and expected work window, it is not ready to edit.

---

## The basic Watchtower lifecycle

### 1. Claim

The agent declares what it wants to touch and why.

### 2. Bootstrap

The repo records that permission boundary before the real work begins.

### 3. Work

The agent works only inside the claimed scope.

### 4. Pull request

The agent opens a PR that references the claim and proves the work stayed in scope.

### 5. Founder merge

The founder or maintainer remains the merge gate.

### 6. Release

After merge, the claim is released so other agents can work in that area again.

---

## Fast Track vs Strict Track

Watchtower should not make every tiny solo task feel like airport security.

It needs two tracks.

### Fast Track

Fast Track is for one low-risk agent working alone.

It should still register the agent, scope, branch, and intent. It simply reduces ceremony when there is no parallel risk.

Fast Track is not a bypass.

### Strict Track

Strict Track is for:

- two or more active writer agents;
- sensitive files;
- broad scopes;
- overlapping scopes;
- workflow, security, auth, payment, or infrastructure changes.

Strict Track uses the full claim, bootstrap, scoped PR, CI, founder merge, and release process.

### The rule

```txt
First safe writer can be low-friction.
Second active writer triggers full governance.
```

When unsure, choose Strict Track.

---

## Sub-agents

A founder may ask one agent to launch or consult another agent.

Watchtower should not count how many chats exist. It should count who can write to the repository.

### Read-only sub-agent

No separate claim needed.

Examples:

- reviewer;
- researcher;
- security reader;
- architecture critic;
- test planner.

### Writer in the same scope

Can be treated as a delegated helper if it works on the same branch, same PR, and same claimed scope.

The parent agent remains responsible.

### Writer in a different scope

Needs its own claim.

If it can change different files, it is no longer just a helper. It is another writer.

---

## What the founder should check

Before letting an agent work, ask:

```txt
What files?
Why?
Which branch?
How long?
Is another agent already there?
Who merges?
What proves the work is safe?
```

If the agent cannot answer clearly, it is not ready.

---

## What Watchtower is not

Watchtower is not bureaucracy for its own sake.

It is not a replacement for engineering judgment.

It is not a coding agent.

It is not a promise that every change is correct.

It is a governance layer that forces agents to become visible, scoped, reviewable, and accountable before their work reaches `main`.

---

## Why this matters for non-technical founders

A technical founder often coordinates through intuition: they know which files are coupled, which branch is risky, and which change could break production.

A non-technical founder should not need that intuition to operate safely with agents.

Watchtower turns invisible engineering coordination into explicit repo process.

That is the leverage:

> The founder stays non-technical. The repository behaves as if a senior engineer is guarding the boundaries.
