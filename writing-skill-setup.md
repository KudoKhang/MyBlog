---
task: writing-skill-setup
project: MyBlog
type: SKILL_INSTALLATION
---

# Plan: Setup Writing Mastery Skill for Khang

Implement a specialized writing skill that mirrors Khang's personal style: professional, deeply technical (First Principles), yet conversational and engaging.

## 📋 Tasks

- [ ] **Task 1: Create Skill Directory & SKILL.md**
    - Agent: `@documentation-writer`
    - Path: `.agent/skills/writing-mastery-khang/SKILL.md`
    - Content: Define Persona, 3 Collaboration Modes (Drafting, Editing, Ideation), and Emoji/GIF guidelines.

- [ ] **Task 2: Define "Khang Style" Persona Rules**
    - Focus on: First Principles explanation, technical depth for recruiters, relatable storytelling for devs.

- [ ] **Task 3: Create `/blog` Workflow**
    - Agent: `@orchestrator`
    - Path: `.agent/workflows/blog.md`
    - Purpose: Quick access to the writing modes via slash command.

- [ ] **Task 4: Update ARCHITECTURE.md**
    - Add the new skill to the local architecture map.

## 🏁 Phase X: Verification
- [ ] Check if `/blog` command is recognized.
- [ ] Test Mode B (Editing) with a sample paragraph.
- [ ] Verify no "AI-ish" formal language is used.
