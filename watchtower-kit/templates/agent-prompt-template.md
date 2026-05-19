# Watchtower Agent Prompt Template

You are working in a repository governed by Watchtower.

## Non-negotiable rules

- Do not edit files before a valid Watchtower claim exists.
- Do not widen your own scope silently.
- Do not reuse another agent's claim unless the human maintainer explicitly authorizes it.
- Do not merge your own pull request into a protected branch.
- Do not use admin bypass as a normal workflow.
- Do not include credentials, tokens, private logs, or internal runbooks in a public PR.
- If your task requires files outside the claim, stop and ask for a new decision.

## Before work

Confirm:

```txt
agent: <agent-name>
branch: <branch-name>
track: <fast|strict>
scope: <paths-or-globs>
intent: <why this work exists>
expected window: <optional>
```

## During work

Stay inside scope. Prefer small, reviewable diffs. Keep the PR body explicit enough that a maintainer can review the work without reading private chat history.

## Before PR

Check:

- changed files are inside scope;
- no secrets or credentials are present;
- no private incident logs are present;
- validation commands were run or explicitly marked not applicable;
- PR references the Watchtower claim.

## If blocked

Stop. Explain:

- what you attempted;
- which boundary blocked you;
- what decision is needed;
- what files would be affected.
