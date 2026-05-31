---
name: stochastic-consensus
description: Ensemble strategy — multiple agents independently solve the SAME problem, then a judge extracts consensus to reduce hallucination and increase confidence. Use for high-stakes decisions, bug diagnosis, code review, or any task where a wrong answer is costly.
disable-model-invocation: true
allowed-tools: Agent
---

# Stochastic Consensus

Multiple agents independently solve the same problem, then a judge finds agreement. The diversity comes from LLM stochastic sampling, not from different prompts.

## How It Differs from Fan-In Fan-Out

| | Stochastic Consensus | Fan-In Fan-Out |
|---|---|---|
| Input | **Same prompt** to all agents | **Different angles** per agent |
| Diversity source | Temperature / stochastic sampling | Task decomposition |
| Goal | Reduce hallucination via agreement | Broad investigation, complementary perspectives |
| Synthesis | Judge picks best or counts votes | Synthesizer integrates findings into unified plan |

## Pattern

```
User prompt
    |
    |-- Agent 1 (sonnet) -- Same task --\
    |-- Agent 2 (sonnet) -- Same task --|
    |-- Agent 3 (sonnet) -- Same task --|-- Judge (opus) -- Consensus result
    |-- Agent 4 (sonnet) -- Same task --|
    \-- Agent 5 (sonnet) -- Same task --/
```

## Inputs

`$ARGUMENTS` — the problem to get consensus on.

If no arguments are given, ask the user what problem they want consensus on.

## Execution

### Step 1: Formulate the prompt

Write a single, clear prompt that all agents will receive identically. Include:

- The problem statement
- Any relevant context (files to read, constraints)
- The desired output format
- Read-only constraint if appropriate: "Do NOT make any changes"

The key insight: identical prompts still produce different outputs because LLMs sample stochastically. Where multiple independent runs converge, you can trust the answer. Where they diverge, you've found genuine ambiguity worth surfacing.

### Step 2: Fan-Out (identical prompts)

Launch 3–5 agents **in a single message** (parallel) using `model: sonnet`. Every agent gets the **exact same prompt**. Do not assign different angles — that's fan-in-fan-out.

End each agent prompt with: "Produce your answer independently. Do not hedge — commit to a specific recommendation."

Hedging defeats the purpose. If an agent is uncertain, you want to see *which direction* it leans, not a "it depends" that hides the signal.

### Step 3: Judge (find consensus)

Once all agents return, launch **one** judge agent using `model: opus`. Provide all outputs labeled by agent number. The judge must:

1. **Identify agreement** — what do most or all agents converge on?
2. **Flag divergence** — where do agents disagree, and why might that be?
3. **Assess confidence** — 5/5 agreement = high confidence, 3/5 = moderate, no majority = low
4. **Produce the final answer** using the appropriate strategy:

| Output Type | Aggregation Strategy |
|---|---|
| Yes/No or classification | Majority vote |
| Code solution | Pick best, verified by agreement on approach |
| Architecture recommendation | Extract shared reasoning, resolve conflicts |
| Root cause analysis | Consensus on cause, union of evidence |
| Creative/open-ended | Judge ranks by quality, picks best |

### Step 4: Present with confidence

Present the judge's output to the user. Include:

- The consensus answer
- Confidence level (N/M agents agreed)
- Any notable dissent worth flagging

## Agent Configuration

| Role | Model | Count | Instructions |
|------|-------|-------|-------------|
| Solver | sonnet | 3–5 | Same prompt, independent answers |
| Judge | opus | 1 | Find consensus, resolve conflicts, produce final answer |

## When to Use

- **High-stakes decisions** where a wrong answer is costly (security, data migration, breaking changes)
- **Reducing hallucination** on factual questions about the codebase
- **Bug diagnosis** where multiple independent theories converge on the real cause
- **Code review** where multiple agents independently review the same code
- **Classification or triage** where confidence matters

## When NOT to Use

- Trivial tasks with obvious answers — consensus adds latency for no benefit
- Tasks requiring broad exploration of different angles — use fan-in-fan-out instead
- Real-time responses where latency of multiple agents is unacceptable
- Creative tasks where you want one bold take, not safe consensus
