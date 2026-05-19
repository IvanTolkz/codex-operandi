#!/usr/bin/env node

/**
 * Watchtower example CLI.
 *
 * This is intentionally small and generic. It is a starter reference, not a
 * production-ready implementation. Adapt validation, glob matching, state
 * storage, permissions, and CI integration for your repository.
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = process.cwd();
const ACTIVE_DIR = path.join(ROOT, '.watchtower', 'active');
const COMPLETED_DIR = path.join(ROOT, '.watchtower', 'completed');

function ensureDirs() {
  fs.mkdirSync(ACTIVE_DIR, { recursive: true });
  fs.mkdirSync(COMPLETED_DIR, { recursive: true });
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith('--')) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else if (args[key]) {
      args[key] = Array.isArray(args[key]) ? [...args[key], next] : [args[key], next];
      i += 1;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._/-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function claimPath(branch) {
  return path.join(ACTIVE_DIR, `${slug(branch).replaceAll('/', '__')}.json`);
}

function readActiveClaims() {
  ensureDirs();
  return fs.readdirSync(ACTIVE_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const fullPath = path.join(ACTIVE_DIR, file);
      return { file, fullPath, claim: JSON.parse(fs.readFileSync(fullPath, 'utf8')) };
    });
}

function simpleGlobMatch(file, pattern) {
  if (pattern.endsWith('/**')) {
    return file.startsWith(pattern.slice(0, -3));
  }
  if (pattern.endsWith('*')) {
    return file.startsWith(pattern.slice(0, -1));
  }
  return file === pattern || file.startsWith(`${pattern}/`);
}

function assertRequired(args, names) {
  for (const name of names) {
    if (!args[name]) {
      console.error(`Missing required argument: --${name}`);
      process.exit(2);
    }
  }
}

function cmdClaim(args) {
  assertRequired(args, ['agent', 'branch', 'scope', 'intent', 'track']);
  ensureDirs();

  const include = Array.isArray(args.scope) ? args.scope : [args.scope];
  const claim = {
    schema_version: 1,
    claim_id: crypto.randomUUID(),
    agent: args.agent,
    branch: args.branch,
    track: args.track,
    scope: { include },
    intent: args.intent,
    expected_window: args.window || null,
    delegates: [],
    status: 'claimed',
    pr: null,
    claimed_at: new Date().toISOString(),
    released_at: null,
    release_reason: null
  };

  const file = claimPath(args.branch);
  if (fs.existsSync(file)) {
    console.error(`Claim already exists for branch: ${args.branch}`);
    process.exit(1);
  }

  fs.writeFileSync(file, `${JSON.stringify(claim, null, 2)}\n`);
  console.log(`Created Watchtower claim: ${file}`);
  console.log(JSON.stringify(claim, null, 2));
}

function cmdStatus() {
  const claims = readActiveClaims();
  if (claims.length === 0) {
    console.log('No active Watchtower claims.');
    return;
  }

  for (const { claim } of claims) {
    console.log(`${claim.branch} | ${claim.agent} | ${claim.track} | ${claim.scope.include.join(', ')}`);
  }
}

function cmdCheckScope(args) {
  assertRequired(args, ['branch', 'files']);
  const files = Array.isArray(args.files) ? args.files : [args.files];
  const active = readActiveClaims();
  const found = active.find(({ claim }) => claim.branch === args.branch);

  if (!found) {
    console.error(`No active Watchtower claim found for branch: ${args.branch}`);
    process.exit(1);
  }

  const include = found.claim.scope.include || [];
  const outside = files.filter((file) => !include.some((pattern) => simpleGlobMatch(file, pattern)));

  if (outside.length > 0) {
    console.error('Scope check failed. Files outside claim:');
    for (const file of outside) console.error(`- ${file}`);
    process.exit(1);
  }

  console.log('Watchtower scope check passed.');
}

function cmdRelease(args) {
  assertRequired(args, ['branch', 'pr']);
  ensureDirs();
  const file = claimPath(args.branch);
  if (!fs.existsSync(file)) {
    console.error(`No active Watchtower claim found for branch: ${args.branch}`);
    process.exit(1);
  }

  const claim = JSON.parse(fs.readFileSync(file, 'utf8'));
  claim.status = 'released';
  claim.pr = Number(args.pr);
  claim.released_at = new Date().toISOString();
  claim.release_reason = `merged PR #${args.pr}`;

  const completedName = `${slug(args.branch).replaceAll('/', '__')}-${claim.released_at.replace(/[:.]/g, '-')}.json`;
  const completedPath = path.join(COMPLETED_DIR, completedName);
  fs.writeFileSync(completedPath, `${JSON.stringify(claim, null, 2)}\n`);
  fs.unlinkSync(file);

  console.log(`Released Watchtower claim: ${completedPath}`);
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);

  if (cmd === 'claim') return cmdClaim(args);
  if (cmd === 'status') return cmdStatus(args);
  if (cmd === 'check-scope') return cmdCheckScope(args);
  if (cmd === 'release') return cmdRelease(args);

  console.log(`Watchtower example CLI\n\nUsage:\n  watchtower.example.js claim --agent <name> --branch <branch> --scope "docs/**" --intent "..." --track <fast|strict>\n  watchtower.example.js status\n  watchtower.example.js check-scope --branch <branch> --files <file> [--files <file>]\n  watchtower.example.js release --branch <branch> --pr <number>\n`);
}

main();
