# Watchtower Kit

> A generic starter kit for installing Watchtower-style governance in a repository.

Watchtower is a repo-level governance framework for AI coding agents. This kit gives you a neutral starting point: claim schema, policy example, PR templates, agent prompt, CI examples, and a minimal reference CLI.

This is **not** the private Tolkerz implementation. It contains no production credentials, no private runbooks, no real claim identifiers, and no internal incident logs.

---

## What this kit gives you

```txt
watchtower-kit/
  README.md
  claim.schema.json
  policy.example.json
  scripts/
    watchtower.example.js
  templates/
    adr-template.md
    agent-prompt-template.md
    bootstrap-pr-template.md
    work-pr-template.md
    operator-runbook-template.md
  github-actions/
    scope-check.example.yml
    release-on-merge.example.yml
```

Use it as a starting point, then adapt it to your repository, language, CI platform, branch protection rules, and agent environment.

---

## Core principle

```txt
claim before code
```

Before an AI coding agent changes files, it must declare:

- who is working;
- what files or folders it wants to touch;
- why it needs that scope;
- which branch it will use;
- whether the work is Fast Track or Strict Track;
- when the permission should be released.

A claim is not bureaucracy. It is the repo's memory of active write authority.

---

## Fast Track vs Strict Track

### Fast Track

Fast Track is the low-friction path for one safe writer working alone on a narrow, non-sensitive scope.

Fast Track is not a bypass. The work is still registered, scoped, reviewable, and releasable.

### Strict Track

Strict Track is the full governance path for:

- multiple active writer agents;
- overlapping scopes;
- broad claims;
- sensitive files;
- workflow, security, auth, billing, database, or infrastructure changes.

When unsure, choose Strict Track.

---

## 30-minute install path

### 1. Copy the kit

Copy `watchtower-kit/` into your repository.

### 2. Create state directories

```bash
mkdir -p .watchtower/active .watchtower/completed
```

### 3. Add a local policy

Copy:

```txt
watchtower-kit/policy.example.json
```

to:

```txt
.watchtower/policy.json
```

Then edit it for your repo.

Important: `policy.example.json` documents recommended policy boundaries. The minimal example CLI does not enforce every policy rule yet. Production adopters must wire policy enforcement into the CLI, CI, or both.

### 4. Try a claim

```bash
node watchtower-kit/scripts/watchtower.example.js claim \
  --agent docs-agent \
  --branch agent/docs-agent \
  --scope "docs/**" \
  --intent "Update public documentation" \
  --track fast
```

### 5. Check status

```bash
node watchtower-kit/scripts/watchtower.example.js status
```

### 6. Check a changed-file list

```bash
node watchtower-kit/scripts/watchtower.example.js check-scope \
  --branch agent/docs-agent \
  --files docs/README.md docs/guide.md
```

For CI, prefer a newline-delimited file list:

```bash
node watchtower-kit/scripts/watchtower.example.js check-scope \
  --branch agent/docs-agent \
  --files-from changed-files.txt
```

### 7. Release after merge

```bash
node watchtower-kit/scripts/watchtower.example.js release \
  --branch agent/docs-agent \
  --pr 123
```

The example release workflow must open a release PR. It must not push the release artifact directly to `main`.

---

## Recommended repository rules

Watchtower becomes real only when the repository enforces it.

Minimum setup:

- protect `main`;
- require pull requests;
- require CI checks;
- forbid direct pushes to protected branches;
- keep the human maintainer as merge gate;
- release claims only after merge;
- land release artifacts through a PR, not a direct push to `main`.

Local scripts are useful. CI and branch protection are the wall.

---

## Public security model

This kit intentionally avoids private implementation details.

Do:

- use least-privilege automation;
- keep state writes auditable;
- make failures loud;
- prevent agents from silently widening their own scope;
- review all workflow permissions before enabling automation;
- create a release PR for Watchtower state changes instead of pushing to `main`.

Do not:

- copy production credentials into this kit;
- publish internal incident logs;
- use real claim IDs in examples;
- let agents merge their own work into `main`;
- let automation push directly to protected branches;
- treat Fast Track as a bypass;
- rely only on local hooks.

---

## Maturity path

### Level 0 — Manual discipline

The founder asks agents to declare scope in the PR body. Useful, but not enforceable.

### Level 1 — File-based claims

Claims exist in `.watchtower/active/`. Agents are visible. Status can be queried.

### Level 2 — Scope checks

CI compares PR changed files against the claim. Scope drift becomes visible.

### Level 3 — Release automation through PR

Claims move from active to completed after merge, and the release artifact lands through a dedicated release PR.

### Level 4 — State branch

Runtime coordination state moves out of the code branch into a dedicated state-protected branch.

### Level 5 — Fast Track gate

The system can safely decide between Fast Track and Strict Track before work begins.

---

## What this kit is not

- It is not a managed service.
- It is not a complete production implementation.
- It is not a substitute for branch protection.
- It is not a reason to trust agents blindly.
- It is not a way to bypass human review.

It is a starting point for building repo-level governance around AI coding agents.
