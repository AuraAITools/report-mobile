---
name: fan-in-fan-out
description: Parallel research strategy — multiple sonnet subagents explore different angles of a problem, then one opus agent synthesizes findings into an actionable plan. Use for architecture decisions, migration planning, or any complex investigation.
disable-model-invocation: true
allowed-tools: Agent
---

# Fan-In Fan-Out

Parallel research strategy for problems that benefit from multiple perspectives before converging on a plan.

## Pattern

```
User prompt
    |
    |-- Agent 1 (sonnet) -- Angle A --\
    |-- Agent 2 (sonnet) -- Angle B --|-- Synthesizer (opus) -- Final plan
    |-- Agent 3 (sonnet) -- Angle C --|
    \-- Agent 4 (sonnet) -- Angle D --/
```

## Inputs

`$ARGUMENTS` — the problem to research.

If no arguments are given, ask the user what problem they want to research.

## Execution

### Step 1: Decompose the problem

Break the user's problem into 3–5 independent research angles. Each angle should:

- Be self-contained — no agent needs another's output to do its work
- Cover the problem space with minimal overlap
- Produce findings the synthesizer will need to form a recommendation

Think about it like assembling a team of specialists: if you were staffing a war room, who would you bring and what would you ask each person to look into?

### Step 2: Fan-Out

Launch all research agents **in a single message** (parallel) using `model: sonnet`. Each agent prompt must include:

- **Scope**: "You are researching X" — clear boundaries so agents don't duplicate effort
- **Targets**: specific files, directories, or areas to examine
- **Output format**: "Produce a report covering…" — structured findings the synthesizer can parse
- **Read-only constraint**: "Do NOT make any changes — only read and research"

### Step 3: Fan-In (Synthesize)

Once all agents return, launch **one** synthesizer agent using `model: opus`. Provide:

- All findings, labeled by agent ("Agent 1 researched X and found…")
- The synthesis task: "Produce an actionable implementation plan"
- Decision criteria if trade-offs exist (e.g., "Prefer solutions that minimize migration risk")

The synthesizer exists because individual agents only see their slice. Its job is to resolve contradictions, identify consensus across findings, and produce a single phased plan that accounts for all perspectives.

### Step 4: Present

Present the synthesizer's output directly to the user. Do not re-summarize — the synthesizer's output is the deliverable.

## Agent Configuration

| Role | Model | Count | Instructions |
|------|-------|-------|-------------|
| Researcher | sonnet | 3–5 | Research only, no edits |
| Synthesizer | opus | 1 | Synthesize, decide, plan |

## When to Use

- Architecture decisions with multiple viable approaches
- Migration planning (current state, target state, dependencies, risks)
- Complex investigations spanning auth, data model, routing, and external best practices
- Technology evaluation across multiple options

## When NOT to Use

- Simple tasks where the answer is obvious — just do the work
- Sequential tasks where step 2 depends on step 1 — use a linear approach
- Small codebases a single agent can cover quickly — an agent per file is overkill
- Tasks requiring consensus/confidence — use stochastic-consensus instead
