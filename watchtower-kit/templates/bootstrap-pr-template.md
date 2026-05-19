# Bootstrap PR — Watchtower Claim

## Purpose

Create the Watchtower claim before implementation work begins.

This PR should contain only the claim artifact and any minimal metadata required by your repository policy.

## Watchtower

- agent: `<agent-name>`
- claim_id: `<generated-claim-id>`
- branch: `<agent/branch-name>`
- track: `<fast|strict>`
- scope:
  - `<path-or-glob>`
- intent: `<plain-language-intent>`
- expected window: `<optional-estimate>`

## Scope

Allowed:

```txt
<path-or-glob>
```

Forbidden:

```txt
<path-or-glob>
```

## Rules

- This PR does not contain implementation work.
- This PR does not change application code.
- This PR does not change workflow permissions unless explicitly scoped.
- This PR does not contain credentials or secrets.
- This PR does not bypass branch protection.

## Next step after merge

Open the work PR on the claimed branch and keep the diff inside the declared scope.
