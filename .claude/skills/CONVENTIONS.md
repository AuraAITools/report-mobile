# Skill Authoring Convention

Skills live in `.claude/skills/<skill-name>/SKILL.md`. When creating new skills, follow this structure:

## Frontmatter (required)

```yaml
---
name: skill-name
description: One-line description of what the skill does and when to use it (max 250 chars, front-load the key use case).
disable-model-invocation: true    # true for skills with side effects or explicit invocation
allowed-tools: Agent              # comma-separated tools the skill may use without asking
---
```

## Body Structure

Follow this section order:

1. **Title** (`# Skill Name`) — followed by a one-sentence summary of when to use it
2. **Pattern** — ASCII diagram showing the agent orchestration flow (if applicable)
3. **Inputs** — what the user provides; use `$ARGUMENTS` for slash command args
4. **Execution** — numbered steps with `### Step N: Name` subheadings. Each step should be concrete and actionable.
5. **Agent Configuration** — table with columns: Role, Model, Count, Instructions
6. **When to Use** — bulleted list of good use cases
7. **When NOT to Use** — bulleted list of anti-patterns

## Style Rules

- Keep SKILL.md under 500 lines
- Use tables for structured comparisons (e.g., agent config, aggregation strategies)
- Use bold for key terms on first mention
- Step instructions should be imperative ("Launch all agents", not "You should launch all agents")
- If the skill relates to another skill, include a comparison table (see stochastic-consensus)
- Move detailed reference material to separate files in the skill folder if needed
