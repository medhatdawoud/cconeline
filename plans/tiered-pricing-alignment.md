# Plan: Align cost calculation with ccusage

## Context

Investigated discrepancy between cconeline's status line spending and ccusage.
Found that the pricing formulas already matched (ccusage default/online mode uses
flat rates from litellm, identical to cconeline's hardcoded rates). The tiered
pricing (above 200K tokens) only applies in ccusage's offline mode.

## Root Cause (investigated but not the fix)

ccusage has tiered pricing in its embedded data but the online litellm source
does NOT include tiered rates. Since ccusage defaults to online mode, flat
rates are used - matching cconeline.

## Actual Issues Found & Fixed

### 1. Zero session cost when running skills with subagents
Skills like `clean_gone` delegate work to subagents. The subagent JSONL files
live in `$CLAUDE_DIR/projects/<project>/<session_id>/subagents/`. The old code
only looked for `<session_id>.jsonl` (the main session file), which sometimes
doesn't exist when all work is delegated. Now scans both main JSONL and all
subagent JSOLNs.

### 2. Code duplication
The `cost()` awk function was duplicated 3 times (session, today, monthly).
Extracted into a shared `COST_AWK` bash variable.

### 3. Today cache TTL too long
Reduced from 60s to 15s to minimize lag vs ccusage's fresh calculation.

## File modified

`bin/cconeline`

## Verification

- Flat rate calculation matches ccusage online default ($39.51 vs $39.512)
- Session cost now includes subagent costs ($9.255 -> $9.598 for current session)
- Session without main JSONL: was $0.000, now $0.310 from subagent data
- bash -n syntax check passes
