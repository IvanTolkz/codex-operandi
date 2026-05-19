# Work PR — Watchtower Scoped Change

## Summary

- `<what changed>`
- `<why it changed>`
- `<how it was validated>`

## Watchtower

- agent: `<agent-name>`
- claim_id: `<claim-id-from-bootstrap>`
- branch: `<agent/branch-name>`
- track: `<fast|strict>`

## Claimed scope

```txt
<path-or-glob>
```

## Changed files reviewed

```txt
<list changed files here>
```

## Scope proof

- [ ] Every changed file is inside the claim scope.
- [ ] No protected path was touched outside the claim.
- [ ] If the scope changed, work stopped and a new decision was requested.
- [ ] No credentials, secrets, or private runbooks are included.

## Validation

- [ ] Lint / formatting, if applicable
- [ ] Tests, if applicable
- [ ] Type-check / build, if applicable
- [ ] Manual review of docs or generated artifacts, if applicable

## Merge rules

- The agent does not merge this PR.
- The founder or maintainer remains the merge gate.
- Release happens only after merge.
