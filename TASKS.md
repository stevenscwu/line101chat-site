# TASKS.md

## Project
Japanese after 50

## Build Strategy
Build only what is necessary for a single-user MVP.
Focus on daily usefulness, pronunciation practice, progress tracking, and low-effort content extraction.
Do not add auth, payments, multi-user support, or advanced AI features in the MVP.

---

## Phase 1 — Foundation and App Shell

### Task 1: Initialize Project
- Create a new Next.js project
- Set up Tailwind CSS
- Set up TypeScript
- Create a clean folder structure for app pages, components, lib, and data
- Add a simple README with run instructions

#### Acceptance Criteria
- Project runs locally without errors
- Tailwind styles work
- Folder structure is organized and easy to extend

---

### Task 2: Create Global Layout
- Build a shared app layout
- Add top navigation or sidebar navigation
- Include links for:
  - Home
  - Dashboard
  - Materials
  - Pronunciation Lab
  - Study Log
  - Weekly Review
  - Content Studio
- Make layout responsive
- Keep visual style clean, mature, and dashboard-like

#### Acceptance Criteria
- All pages render inside a consistent layout
- Navigation works
- Layout is readable on desktop and mobile

---

### Task 3: Create Placeholder Pages
Create initial pages for:
- `/`
- `/dashboard`
- `/materials`
- `/pronunciation-lab`
- `/study-log`
- `/weekly-review`
- `/content-studio`

Each page should contain:
- page title
- short description
- placeholder content block

#### Acceptance Criteria
- All routes work
- No broken links
- Pages are ready for later feature development

---

## Phase 2 — Public Home and Dashboard

### Task 4: Build Public Home Page
Add a public-facing homepage with:
- project title: 50+ Japanese
- one-sentence mission
- short intro paragraph
- current journey snapshot
- sections for:
  - why this project exists
  - what the dashboard does
  - current focus
  - recent weekly review preview
- call-to-action buttons to Dashboard and Weekly Review

#### Acceptance Criteria
- Homepage looks polished
- Mission is clear
- Public visitors can understand the project quickly

---

### Task 5: Build Dashboard MVP
Create a dashboard page with cards/widgets for:
- today’s study focus
- current streak
- minutes studied today
- quick links to current materials
- pronunciation practice shortcut
- latest study log
- latest weekly review
- today’s social content idea placeholder

Use static/mock data first.

#### Acceptance Criteria
- Dashboard visually resembles a study cockpit
- Information hierarchy is clear
- Mock data is easy to replace later

---

## Phase 3 — Materials System

### Task 6: Design Material Data Model
Create a simple local data structure for study materials.

Each material should support:
- id
- title
- type (`vocab`, `grammar`, `dialogue`, `listening`, `reading`, `other`)
- topic or lesson
- japanese text
- optional translation
- tags
- created date
- updated date

Store data in a simple local format first:
- JSON
or
- markdown frontmatter
or
- TypeScript mock data

#### Acceptance Criteria
- Data model is documented
- At least 3 sample materials exist
- Data is easy to read and edit manually

---

### Task 7: Build Materials Page
Create a materials page that:
- lists all study materials
- shows title, type, topic, tags, and updated date
- supports simple filtering by type
- supports clicking into one material detail page
- includes a button or section for “Add Material” placeholder

#### Acceptance Criteria
- Materials list renders from local data
- Filtering works
- Each material can be opened individually

---

### Task 8: Build Material Detail Page
Create a detail page for one material:
- show title and metadata
- display Japanese text clearly
- optionally show translation
- add a button linking to Pronunciation Lab with this material
- show tags and last updated info

#### Acceptance Criteria
- Material detail page is readable
- Navigation to pronunciation workflow is easy
- Text area supports multi-line study content cleanly

---

## Phase 4 — Pronunciation Lab

### Task 9: Build Pronunciation Lab Input Flow
Create a Pronunciation Lab page that can:
- load a selected material
- display its Japanese text
- split text into sentence-like units
- render each sentence as a separate practice card

Sentence cards should show:
- Japanese text
- optional translation toggle
- play button placeholder
- repeat button placeholder
- difficulty marker placeholder

#### Acceptance Criteria
- Text is split into manageable practice units
- Each sentence appears in a clean card layout
- Lab works with at least 3 sample materials

---

### Task 10: Add Browser Speech Playback
Implement browser-based pronunciation playback using the SpeechSynthesis API:
- play one sentence at a time
- support replay
- allow stopping current playback
- keep implementation simple and stable

#### Acceptance Criteria
- Clicking play reads the selected sentence aloud
- Replay works
- Basic playback works on supported browsers

---

### Task 11: Add Slow Playback Option
Add a simple slower playback control:
- normal speed
- slow speed

This may be implemented with adjustable speech rate.

#### Acceptance Criteria
- User can switch between normal and slow playback
- Slower mode is noticeably slower and useful for shadowing

---

### Task 12: Add Sentence Difficulty Marking
Allow each sentence to be marked as:
- difficult
- okay
- mastered

Store this locally for now.

#### Acceptance Criteria
- Difficulty state can be changed per sentence
- State persists at least during local session or via simple local storage

---

## Phase 5 — Study Log

### Task 13: Design Study Log Data Model
Create a local data structure for study sessions.

Each study log entry should include:
- id
- date
- minutes studied
- focus area
- related material ids
- notes
- reflection
- confidence score (optional)
- created date

#### Acceptance Criteria
- Data model is documented
- At least 5 sample study logs exist

---

### Task 14: Build Study Log Page
Create a page that:
- lists past study sessions
- shows date, minutes, focus, and short reflection
- supports viewing details of an entry
- sorts with newest first

#### Acceptance Criteria
- Study logs render from local data
- Entries are readable and organized
- User can inspect prior study records easily

---

### Task 15: Build Add Study Log Form
Add a form to create a new study log entry with fields for:
- date
- minutes studied
- focus area
- related material
- notes
- reflection

For MVP, storing in client state or a simple temporary local mechanism is acceptable.

#### Acceptance Criteria
- User can add a new study log entry
- New entry appears in the log list
- Form is easy and fast to use

---

## Phase 6 — Weekly Review

### Task 16: Design Weekly Review Data Model
Create a local data structure for weekly reviews.

Each review should include:
- id
- week label
- start date
- end date
- highlights
- biggest challenge
- sentence or phrase of the week
- next week focus
- optional public summary

#### Acceptance Criteria
- Data model is documented
- At least 2 sample weekly reviews exist

---

### Task 17: Build Weekly Review Page
Create a page that:
- lists weekly reviews
- shows date range
- summary preview
- allows viewing full review content

#### Acceptance Criteria
- Reviews render clearly
- Timeline of weekly progress is easy to understand
- Page supports both overview and detail reading

---

### Task 18: Build Weekly Review Editor
Add a simple form or editable section for entering:
- highlights
- biggest challenge
- phrase of the week
- next week focus
- public summary

#### Acceptance Criteria
- New weekly review can be added
- It appears in the review list
- Form supports practical weekly reflection

---

## Phase 7 — Content Studio

### Task 19: Build Content Studio Page
Create a page that gathers content ideas from:
- recent study logs
- recent materials
- recent weekly reviews

Display cards for:
- sentence of the day
- mistake of the day
- speaking prompt
- weekly recap snippet
- honest 50+ reflection prompt

#### Acceptance Criteria
- Content Studio feels like a useful planning board
- At least 5 content card types are shown
- Inputs come from real study data where possible

---

### Task 20: Add Copyable Content Cards
Each content card should include:
- title
- short text
- copy button

Possible cards:
- “Today’s one sentence”
- “What I learned today”
- “This was hard for me”
- “Repeat after me”
- “Weekly progress recap”

#### Acceptance Criteria
- Copy button works
- Cards are concise and social-media-friendly
- User can quickly extract posting ideas

---

## Phase 8 — Dashboard Integration

### Task 21: Connect Dashboard Widgets to Real Local Data
Replace mock data on the dashboard with real local data sources:
- materials
- study logs
- weekly reviews
- pronunciation states if available

#### Acceptance Criteria
- Dashboard reflects actual current project data
- Cards update as data changes
- Dashboard becomes practically usable

---

### Task 22: Add Streak and Progress Widgets
Add widgets for:
- study streak
- total study sessions
- total minutes studied
- most recent material
- most difficult sentence count if available

#### Acceptance Criteria
- Metrics are calculated from local data
- Widgets are readable and motivating but not childish

---

## Phase 9 — Polish and Refactor

### Task 23: Improve Visual Consistency
Refine spacing, card design, typography, and section hierarchy across all pages.

Goals:
- calm
- mature
- clean
- readable
- dashboard-like

#### Acceptance Criteria
- Pages feel visually coherent
- Typography is easy to read
- UI supports long-term daily use

---

### Task 24: Refactor Component Structure
Refactor reusable pieces such as:
- page headers
- card components
- filter controls
- form fields
- navigation items
- content cards
- sentence practice cards

#### Acceptance Criteria
- Repetition is reduced
- Components are easier to maintain
- Folder structure is clearer

---

### Task 25: Add Seed Data and Demo Flow
Provide enough sample data so the project feels complete when first run:
- 3–5 materials
- 5–10 study logs
- 2–4 weekly reviews
- sample content studio cards

#### Acceptance Criteria
- Fresh install shows a realistic working demo
- User can understand how the app is meant to be used immediately

---

## Explicit Non-Tasks for MVP
Do not build these yet:
- authentication
- database backend
- payment system
- multi-user support
- admin roles
- OCR
- PDF parsing
- AI tutor chat
- pronunciation scoring
- advanced analytics
- social media auto-posting
- cloud sync
- native mobile app

---

## Suggested Implementation Order
1. Initialize project
2. Global layout
3. Placeholder pages
4. Home page
5. Dashboard MVP
6. Material data model
7. Materials page
8. Material detail page
9. Pronunciation Lab input flow
10. Speech playback
11. Slow playback
12. Difficulty marking
13. Study log model
14. Study log page
15. Study log form
16. Weekly review model
17. Weekly review page
18. Weekly review editor
19. Content Studio
20. Copyable content cards
21. Connect real data to dashboard
22. Progress widgets
23. Visual polish
24. Refactor components
25. Seed/demo data

---

## Definition of MVP Success
The MVP is successful if:
- I can open the dashboard every day and know what to study
- I can view or enter current study materials
- I can practice sentence-level pronunciation with playback
- I can log my study quickly
- I can review my weekly progress
- I can extract at least one simple social-media-ready content idea from the system
- The interface is calm and useful enough that I actually want to use it

---

## Final Rule
Whenever a new feature is proposed, ask:
Does this clearly improve daily study consistency, pronunciation practice, progress recording, or low-effort content creation?

If not, it should wait until after MVP.