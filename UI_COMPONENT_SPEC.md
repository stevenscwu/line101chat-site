# UI_COMPONENT_SPEC.md

## Shared Shell

### AppShell
- Responsibility: overall app frame, background atmosphere, mobile menu container
- Contains desktop sidebar + mobile drawer

### SidebarNav
- Responsibility: primary route navigation
- Behavior: highlights active route, short labels in compact mode

### PrimaryActionButton
- Responsibility: high-priority CTA with motion feedback
- Variants: `primary`, `secondary`, `ghost`

### StatChip
- Responsibility: compact stat display (streak, XP, weekly target, study count)

### ProgressRing
- Responsibility: circular progress visual with animated stroke

### EmptyStateCard
- Responsibility: graceful empty-state messaging

### LearningDisplayModeSwitch
- Responsibility: toggle between `beginner`, `study`, `immersion`

## Dashboard Components

### MissionHeroCard
- Inputs: mission title/support text/summary/actions
- Role: makes next action obvious

### StreakWidget
### XPWidget
### WeeklyGoalCard
- Role: immediate momentum indicators

### DailyQuestList
- Inputs: quest list with status and XP rewards

### LearningPathMap + LessonNode
- Inputs: path nodes with status (`completed/current/locked`)

### PronunciationPlayerCard
- Inputs: phrase item
- Behavior: play, slow replay, stop, record placeholder

### UploadStudyMaterialCard
- Role: upload flow entry point

### MaterialInsightCard
- Role: show extracted vocabulary / phrase / drills counts

### VocabularyReviewCard
- Inputs: vocab item + display mode visibility flags

### DailyJournalCard
- Behavior: quick reflection form with mood and confidence

### SocialClipIdeasCard
- Behavior: copyable caption ideas + record CTA

### BadgeShelf
- Role: visual achievement motivation wall

### EncouragementBanner
- Role: emotional reinforcement and consistency reminder

### ActivityFeed
- Role: recent timeline of meaningful study actions
Project: Japanese After 50

## 1. AppShell
Purpose:
Main frame for desktop and mobile layouts.

Contains:
- SidebarNav
- Top utility area (optional on desktop)
- Main content slot
- RightRail widgets on desktop
- Mobile nav treatment

Behavior:
- sticky sidebar on desktop
- responsive collapse on tablet/mobile
- maintain spacing hierarchy
- support keyboard navigation

Props:
- `children`
- `rightRail?: ReactNode`
- `showRightRail?: boolean`

---

## 2. SidebarNav
Purpose:
Primary navigation with expressive icons and active state.

Items:
- Dashboard
- Learn
- Pronunciation
- Vocabulary
- Materials
- Journal
- Social Ideas
- Achievements
- Settings

Behavior:
- active route highlight
- hover lift or glow
- icon + text
- optional compact mode

States:
- default
- hover
- active
- keyboard focus
- collapsed

---

## 3. MissionHeroCard
Purpose:
Show the single most important task of the day.

Content:
- section label
- main headline
- short supporting text
- CTA button
- optional progress chip
- optional mascot or illustration

Examples:
- “Today’s Mission”
- “Complete Unit 2 pronunciation practice”
- “You’re one lesson away from your weekly target”

Props:
- `title`
- `subtitle`
- `ctaLabel`
- `onCtaClick`
- `progressText?`
- `illustration?`

Behavior:
- strongest visual priority on page
- subtle animated entrance
- CTA visually dominant

---

## 4. StreakWidget
Purpose:
Show current learning streak.

Content:
- streak icon
- current day count
- small motivational line

Props:
- `days: number`
- `bestDays?: number`
- `status?: "active" | "risk" | "broken"`

Behavior:
- celebratory emphasis when streak is active
- warning state if no activity today
- compact enough for right rail or summary row

---

## 5. XPWidget
Purpose:
Show XP or progress points.

Content:
- total XP
- today’s XP
- short progress visualization

Props:
- `totalXp: number`
- `todayXp?: number`
- `nextLevelXp?: number`

Behavior:
- fill animation on update
- should look rewarding, not purely numeric

---

## 6. WeeklyGoalCard
Purpose:
Show completion progress for the week.

Content:
- target label
- completed amount
- progress bar / ring
- “X remaining” text

Props:
- `completed: number`
- `target: number`
- `label: string`

Behavior:
- animate progress changes
- always include numeric label

---

## 7. DailyQuestList
Purpose:
Display small actionable tasks for the day.

Each quest can be:
- complete 1 lesson
- review 10 vocab items
- record 1 clip
- upload 1 material
- write 1 reflection

Props:
- `items: Array<{ id, label, completed, reward? }>` 

Behavior:
- check off interaction
- quest completion feedback
- avoid overcomplication

---

## 8. LearningPathMap
Purpose:
Central visual roadmap for learning journey.

Content:
- connected nodes
- current node
- locked nodes
- completed nodes
- milestone chest/badge nodes

Props:
- `units: Array<{ id, title, status, type }>`
- `currentUnitId`
- `onSelectUnit?`

Statuses:
- locked
- available
- current
- completed

Types:
- lesson
- milestone
- challenge
- review

Behavior:
- visually dynamic, not rigid
- responsive vertical or adaptive layout
- hover/focus reveals details
- accessible labels required

---

## 9. LessonNode
Purpose:
Single node within learning path.

Props:
- `title`
- `status`
- `type`
- `icon?`
- `progress?`

Behavior:
- circular or rounded
- high visual distinction between states
- current state should be unmistakable
- locked state should still look intentional, not broken

---

## 10. PronunciationPlayerCard
Purpose:
Support repeat-after-me study.

Content:
- phrase
- kana/kanji line
- translation
- play audio button
- slow playback option
- record/repeat CTA

Props:
- `phrase`
- `reading?`
- `translation`
- `audioUrl?`
- `difficulty?: "easy" | "medium" | "hard"`

Behavior:
- large play button
- mobile-friendly controls
- clean waveform or simple audio UI optional
- reduced-motion compatible

---

## 11. UploadStudyMaterialCard
Purpose:
Allow the user to add current learning materials.

Content:
- upload CTA
- supported file types
- recent uploads list
- extraction status
- “generate pronunciation practice” CTA

Props:
- `acceptedTypes`
- `recentFiles`
- `onUpload`

Behavior:
- drag-and-drop on desktop
- simple tap upload on mobile
- show success/loading/error states clearly

---

## 12. MaterialInsightCard
Purpose:
Show processed outputs from uploaded study materials.

Content examples:
- extracted vocabulary
- key phrases
- pronunciation segments
- summary
- review queue entry points

Props:
- `title`
- `items`
- `sourceName`

Behavior:
- compact preview
- links into deeper study workflow

---

## 13. VocabularyReviewCard
Purpose:
Encourage fast daily review.

Content:
- due words count
- weak words count
- CTA to review
- optional preview chips

Props:
- `dueCount`
- `weakCount`
- `previewWords?: string[]`

Behavior:
- should feel lightweight and inviting
- not like a full flashcard app on dashboard

---

## 14. DailyJournalCard
Purpose:
Record reflection and consistency.

Content:
- quick textarea
- mood/confidence selector
- studied minutes
- save button

Props:
- `date`
- `initialText?`
- `confidence?: number`
- `studiedMinutes?: number`

Behavior:
- friction should be low
- allow very short entry
- optional autosave

---

## 15. SocialClipIdeasCard
Purpose:
Help generate fast, low-effort social content ideas.

Content:
- 3 short content prompts
- record now button
- copy caption button
- “today’s angle” suggestions

Example prompts:
- “Say 3 phrases you learned today”
- “Record your pronunciation before/after”
- “Share one hard word and how you remember it”

Props:
- `ideas: Array<{ id, title, description }>`
- `onRefreshIdeas?`

Behavior:
- should feel easy and energizing
- geared toward short-form content creation

---

## 16. BadgeShelf
Purpose:
Display earned achievements.

Content:
- badge icons
- locked/unlocked state
- hover/focus details

Props:
- `badges: Array<{ id, name, unlocked, description, icon }>` 

Behavior:
- horizontal shelf or compact grid
- tooltips or modal details
- do not overcrowd

---

## 17. EncouragementBanner
Purpose:
Give emotional support and continuity.

Content examples:
- “Tiny progress still counts.”
- “You showed up today. That matters.”
- “Consistency beats intensity.”

Props:
- `message`
- `variant?: "default" | "reward" | "recovery"`

Behavior:
- lightweight
- optional mascot/illustration
- can rotate messages

---

## 18. ActivityFeed
Purpose:
Show recent actions for continuity.

Items:
- completed lesson
- recorded clip
- uploaded material
- wrote journal entry
- unlocked badge

Props:
- `items: Array<{ id, type, label, timestamp }>` 

Behavior:
- compact
- scannable
- not overly dominant

---

## 19. StatChip
Purpose:
Small metric display.

Examples:
- 6-day streak
- 120 XP today
- 14 words reviewed
- 20 min speaking

Props:
- `label`
- `value`
- `icon?`
- `variant?`

Behavior:
- compact and reusable
- suitable in hero headers or summary rows

---

## 20. ProgressRing
Purpose:
Circular progress display for goals or completion.

Props:
- `value`
- `max`
- `label`
- `size?: "sm" | "md" | "lg"`

Behavior:
- animation on mount/update
- accessible text alternative required

---

## 21. PrimaryActionButton
Purpose:
Main CTA style.

Usage:
- Start lesson
- Record now
- Review vocab
- Upload material

Behavior:
- pill shape
- strong visual emphasis
- hover lift
- active press feedback
- visible focus ring

Variants:
- primary
- secondary
- reward
- ghost

---

## 22. EmptyStateCard
Purpose:
Prevent dead-looking sections.

Examples:
- no journal entry yet
- no uploaded materials
- no badges earned
- no pronunciation history

Content:
- friendly icon or mascot
- one-line explanation
- one clear CTA

Behavior:
- always motivating
- never sterile

---

## 23. Responsive behavior rules

Desktop:
- full sidebar
- main content centered
- right rail visible

Tablet:
- narrower sidebar or icon-only mode
- right rail may collapse below main content

Mobile:
- stacked cards
- simplified roadmap
- sticky bottom nav or compact top nav
- largest CTA kept above the fold

---

## 24. Accessibility rules for all components

All components must:
- be keyboard reachable
- have visible focus state
- not rely only on color to show status
- support screen-reader naming
- respect reduced motion
- keep tap targets comfortable on mobile
- avoid hover-only critical content

---

## 25. Implementation notes

Recommended stack:
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons or similarly clean icon set

Suggested structure:
- `components/shared/`
- `components/dashboard/`
- `components/learn/`
- `components/pronunciation/`
- `components/materials/`
- `components/social/`

State approach:
- mock data first
- component props remain data-driven
- avoid hardcoded text in component internals where possible
