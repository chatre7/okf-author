---
name: okf-author
description: Create and manage OKF-compliant Markdown files for the Mike Team. Use this skill when requested to create new documentation nodes, projects, roadmaps, or guidelines to ensure they follow official Open Knowledge Format standards, including YAML frontmatter, automatic cross-linking, and link validation.
---

# OKF Author Skill

This skill ensures all documentation created for the Mike Team follows the **Open Knowledge Format (OKF)** specification.

## Core Responsibilities

1. **Enforce YAML Frontmatter**: Every file MUST start with a standardized metadata block.
2. **Path Management**: New files should be placed in `okf_data/` or its subdirectories (e.g., `okf_data/projects/`, `okf_data/guidelines/`).
3. **Link Validation**: Before saving, verify that any internal Markdown links point to existing files.
4. **Relationship Mapping**: Suggest and add links to related concepts based on tags or title matches.

## Standard Metadata (YAML Frontmatter)

Every OKF node must include:
- `title`: A clear, concise title.
- `description`: A 1-2 sentence overview.
- `type`: One of: `project`, `roadmap`, `concept`, `log`, `guideline`.
- `tags`: An array of relevant keywords.
- `timestamp`: The current ISO-8601 timestamp.

### Example Frontmatter
```yaml
---
title: System Architecture
description: Overview of the microservices architecture.
type: concept
tags: [architecture, backend, infra]
timestamp: 2024-06-17T12:00:00Z
---
```

## Workflow for Creating Nodes

### 1. Identify Target Path
- Projects -> `okf_data/projects/`
- Roadmaps -> `okf_data/projects/` or `okf_data/roadmaps/`
- Guidelines -> `okf_data/guidelines/`
- Infrastructure -> `okf_data/infra/`
- General Concepts -> `okf_data/`

### 2. Standard Content Structure
- Start with an `# H1` title matching the metadata.
- Use `## H2` for sub-sections.
- End with a `## Relationships` section for links to other nodes.

### 3. Automated Validation
- Use `list_directory` or `glob` to see existing files.
- If the user references another topic, find the corresponding `.md` file and link to it using a relative path.
- Warn if a link is broken before finalizing the file.

## Proactive Suggestions
When creating a node, search for existing files with similar tags.
- *Example:* "I see we have an existing `cloud-architecture.md` node. I've added a link to it in the Relationships section."
