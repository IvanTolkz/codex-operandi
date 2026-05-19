# Watchtower Operator Runbook Template

> Use this as a human-facing checklist for operating Watchtower safely.

## 1. Pre-flight

```bash
git status --short
```

Expected:

```txt
# no output
```

Check active claims:

```bash
node watchtower-kit/scripts/watchtower.example.js status
```

## 2. Decide track

Use Fast Track only when all are true:

- one writer;
- narrow scope;
- no active overlapping claim;
- no sensitive files;
- no workflow/security/infrastructure changes.

Use Strict Track when any risk exists.

## 3. Create claim

```bash
node watchtower-kit/scripts/watchtower.example.js claim \
  --agent <agent-name> \
  --branch <branch-name> \
  --scope "<path-or-glob>" \
  --intent "<intent>" \
  --track <fast|strict>
```

## 4. Open bootstrap PR

The bootstrap PR records the claim before implementation work begins.

It should not contain implementation work.

## 5. Open work PR

The work PR must:

- reference the claim;
- stay inside the declared scope;
- include validation notes;
- be merged by a human maintainer.

## 6. Release after merge

```bash
node watchtower-kit/scripts/watchtower.example.js release \
  --branch <branch-name> \
  --pr <merged-pr-number>
```

## 7. Post-flight

Check status again:

```bash
node watchtower-kit/scripts/watchtower.example.js status
```

Expected:

```txt
No active claims for the released branch.
```

## Stop conditions

Stop and ask for human decision if:

- scope expands;
- another active claim overlaps;
- an agent asks to reuse someone else's claim;
- a protected path is touched unexpectedly;
- a secret or private log appears in a diff;
- a bypass is suggested as routine.
