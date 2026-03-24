# PROJECT_BRIEF.md

## Project Name
Japanese after 50

## One-Sentence Summary
A personal Japanese study dashboard for a Taiwanese learner over 50, designed to support daily study, speaking practice, pronunciation repetition, progress tracking, and lightweight social media documentation.

## Mission
I am a Taiwanese learner over 50, building Japanese fluency in public over 2 years through daily study, speaking practice, and honest progress tracking.

## Primary Goal
Build a digital interface that helps me study Japanese consistently, record my progress, and turn my real learning process into simple, low-effort social media content.

## Product Vision
This project starts as a personal study operating system for one serious learner.
Later, it may become a reusable template so that other learners can have their own study dashboard, progress record, and pronunciation practice workflow.

## Target User
Me first.

### Target User Profile
- Taiwanese
- age 50+
- serious about Japanese improvement
- wants daily structure
- wants speaking progress, not only passive study
- wants to document the process publicly without spending too much time editing content

## Problem Statement
Most language learning systems are either:
1. generic consumer apps with weak personalization,
2. scattered tools with no unified workflow,
3. or content-heavy systems that are hard to maintain consistently.

I need a single dashboard that helps me:
- know what to study today,
- upload and organize current study materials,
- practice pronunciation sentence by sentence,
- log what I studied,
- and quickly extract useful content for social media.

## Core Product Principles
1. Personal usefulness comes first.
2. Daily use matters more than feature richness.
3. Speaking and pronunciation must be central.
4. Social media content should come from real study, not separate production.
5. Keep the workflow simple enough to sustain for 2 years.
6. Design for future reuse, but do not build multi-user complexity yet.

## Core Pages

### 1. Home
Purpose:
- introduce the project publicly
- explain the mission
- show current progress snapshot
- link to recent weekly reviews and speaking clips

### 2. Dashboard
Purpose:
- private or semi-private study cockpit
- show today’s learning focus
- quick access to materials
- quick logging
- progress widgets
- shortcuts to pronunciation practice and content ideas

### 3. Materials
Purpose:
- upload or paste current study materials
- organize by lesson, topic, and type
- support text-based pronunciation practice

### 4. Pronunciation Lab
Purpose:
- display Japanese text sentence by sentence
- play pronunciation line by line
- support slow playback and repeat-after-me practice
- optionally show translation
- mark difficult lines

### 5. Study Log
Purpose:
- record daily study sessions
- store date, time, materials, notes, and reflections
- create an archive of consistency and progress

### 6. Weekly Review
Purpose:
- summarize weekly progress
- track what improved
- identify what remains difficult
- create a long-term narrative of growth

### 7. Content Studio
Purpose:
- turn real study records into lightweight social media ideas
- generate “sentence of the day,” “mistake of the day,” weekly recap snippets, and short speaking prompts

## MVP Features

### Must-Have for V1
- dashboard page with today’s study focus
- materials page with text input or simple material entries
- pronunciation lab with sentence splitting and browser speech playback
- daily study log entry form
- weekly review page
- public homepage introducing the project

### Nice-to-Have for V1.5
- slow playback mode
- difficulty tagging for sentences
- streak counter
- weekly progress widgets
- copyable social content cards

### Later Features
- browser voice recording
- pronunciation scoring
- PDF/image upload with parsing
- multi-user accounts
- exportable study templates for others
- analytics for multiple learners

## User Workflow

### Daily Workflow
1. Open dashboard
2. Review today’s focus
3. Open current material
4. Practice pronunciation in the lab
5. Log study session
6. Save one reflection or useful sentence
7. Generate one possible social media idea
8. Mark day complete

### Weekly Workflow
1. Review study logs
2. Identify strongest improvement
3. Identify hardest challenge
4. Write weekly summary
5. Publish selected public update
6. Prepare next week’s focus

## Content Strategy Principles
- Keep content short
- Keep editing minimal
- Build from real study moments
- Prioritize repeatable formats
- Make progress visible
- Keep tone honest, warm, disciplined, and slightly playful

## Recommended Social Content Types
- one sentence a day
- repeat-after-me clip
- mistake of the day
- honest 50+ learner reflection
- one-minute weekly progress recap
- before/after speaking comparison

## Style Direction

### Product Feel
- calm
- focused
- mature
- clean
- encouraging
- practical

### Visual Direction
- dashboard-like, not flashy
- modern and minimal
- readable typography
- soft contrast
- clear section cards
- mobile-friendly but desktop-first for study

### Emotional Tone
The interface should feel like:
- a personal study cockpit
- a quiet companion
- a disciplined but friendly environment
- not childish and not overly gamified

## Tech Stack

### Initial Stack
- Next.js
- React
- Tailwind CSS
- local JSON / markdown / simple file-based content storage
- browser SpeechSynthesis API for pronunciation playback

### Later Stack Options
- database if needed
- cloud storage for uploads
- MediaRecorder for voice recording
- OCR or parsing for uploaded study materials
- auth only after the single-user workflow is proven

## Non-Goals
This project is not initially:
- a full Japanese course platform
- a monetized product
- a multi-user SaaS
- a heavily edited media brand
- a gamified app competing with Duolingo
- a complex AI tutoring product
- an all-in-one language-learning marketplace

## Success Criteria for V1
The MVP is successful if:
- I can use it daily for real study
- I can upload or enter current study material easily
- I can practice pronunciation sentence by sentence
- I can log study sessions without friction
- I can produce simple weekly records
- I can get at least one low-effort social content idea from real study activity

## Build Priorities
1. dashboard shell
2. materials page
3. pronunciation lab
4. study log
5. weekly review
6. content studio
7. polish and refactor

## Final Rule
If a feature does not clearly improve daily learning consistency, pronunciation practice, or progress recording, it should not be in the MVP.