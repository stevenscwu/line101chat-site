# DESIGN.md

## Visual Direction
- Dark immersive base
- Vivid cyan / blue / violet accents
- Large rounded cards with layered depth
- Game-inspired hierarchy, mature execution
- Motion polish with reduced-motion fallback

## Brand Feel
- lively
- encouraging
- premium
- warm
- motivating

## Layout System
- Desktop: fixed left sidebar + main content canvas
- Tablet: responsive two-column sections where possible
- Mobile: stacked cards + slide-out navigation

## Core Patterns
1. `surface-card`: main panel style for content blocks
2. `pill`: rounded action button style for quick controls
3. Gradient hero blocks for mission and emotional identity
4. Progress visuals: rings, bars, streak and XP chips

## Typography
- Display: Archivo
- Body/UI: Noto Sans TC + Noto Sans JP
- Japanese learning copy stays readable with balanced spacing

## Motion
- Framer Motion for:
  - mission card reveal
  - mobile nav drawer
  - lesson node reveal
  - progress ring animation
  - button hover/tap feedback

## Accessibility
- Focus-visible rings on interactive elements
- Minimum touch target sizing on key controls
- Dark theme contrast tuned for readability
- Prefers-reduced-motion respected globally
Project: Japanese After 50
Product type: Personal learning dashboard + creator journey tracker
Primary goal: Make Japanese study feel exciting, visible, and rewarding every day

## 1. Product vision

This website should feel like a living learning journey, not a static blog or a boring SaaS dashboard.

The user should feel:
- encouraged to come back daily
- proud of visible progress
- emotionally rewarded for small wins
- excited to record and share the journey

The visual feeling should be:
- lively
- playful but premium
- motivating
- clean
- modern
- memorable

This is **not** a generic landing page.
This is **not** a corporate admin dashboard.
This is **not** a copy of Duolingo.

It should take inspiration from game-like learning products:
- bold shapes
- bright accents
- clear progression
- strong visual hierarchy
- achievement/reward loops
- subtle motion
- emotionally warm interface

---

## 2. Brand positioning

Brand concept:
**Japanese After 50**

Narrative:
A mature learner rebuilding identity through daily Japanese practice, visible progress, and public accountability.

Tone:
- encouraging
- human
- optimistic
- slightly playful
- never childish
- never corporate
- never cold

Keywords:
- journey
- progress
- streak
- voice
- confidence
- practice
- reflection
- persistence
- reinvention

---

## 3. Core design principles

### 3.1 Progress must always be visible
Every major screen should show progress in some form:
- streak
- XP
- current lesson
- completed lessons
- weekly study count
- pronunciation minutes
- content posted
- uploaded materials reviewed

### 3.2 One dominant action per screen
Each screen should clearly tell the user what to do next:
- Start today’s lesson
- Record pronunciation
- Review vocabulary
- Upload study material
- Write journal
- Plan social post

### 3.3 Reward small actions
Even small actions should feel meaningful:
- hover reactions
- progress fill
- badge unlock
- celebratory microcopy
- subtle motion feedback

### 3.4 Mature playfulness
Use energy and game mechanics, but keep the site appropriate for an adult learner and potential public audience.

### 3.5 Dynamic composition
Avoid rigid same-size grids everywhere.
Use:
- large hero card
- medium side widgets
- floating circular progress nodes
- mixed card sizes
- asymmetrical spacing

### 3.6 Accessibility is required
Motion, focus states, hover states, and color choices must remain accessible.
Support:
- keyboard navigation
- visible focus
- reduced motion
- good contrast
- comfortable target sizes

---

## 4. Experience goals

The interface should communicate these feelings:

### First impression
“Wow, this is alive.”

### After 10 seconds
“I instantly know what I should do today.”

### After 30 seconds
“My progress is visible and motivating.”

### After one week of use
“This helps me stay disciplined and consistent.”

---

## 5. Visual direction

## 5.1 Overall look
A dark, immersive background with vivid accent colors and highly legible content blocks.

Suggested vibe:
- dark navy / deep blue base
- neon green or lime as motivational accent
- sky blue for secondary calls to action
- warm yellow/orange for streak/reward moments
- coral/red for alerts or challenge markers

The site should feel layered:
- background
- panels
- elevated cards
- floating badges/nodes
- subtle glow or gradient highlights

## 5.2 Shapes
Use expressive rounded geometry:
- large rounded cards
- pill buttons
- circular progress nodes
- rounded side panels
- soft corners almost everywhere

Avoid sharp enterprise-style rectangles.

## 5.3 Typography
Typography should be bold and easy to scan.

Use:
- large headlines
- short labels
- compact supporting text
- minimal long paragraphs on dashboard screens

Tone of text:
- “Start today”
- “You’re on a 6-day streak”
- “One more lesson to hit your weekly target”
- “Record today’s 20-second clip”

Avoid:
- dense explanation blocks
- academic homepage text
- corporate marketing copy

## 5.4 Iconography and illustration
Use simple bold icons plus one friendly mascot or guide character.
Mascot use should be light:
- welcome states
- encouragement banners
- achievements
- empty states

Do not overuse cartoon elements.

---

## 6. Motion guidelines

Motion should make the interface feel rewarding and alive, not busy.

Use motion for:
- hover lift
- button bounce/tension
- progress bar fill
- card reveal
- streak count emphasis
- badge unlock
- path node pulse
- tab transitions

Avoid:
- constant looping animations everywhere
- distracting motion during reading
- large moving backgrounds
- flashy effects that reduce clarity

Accessibility:
- support `prefers-reduced-motion`
- motion should degrade gracefully
- essential information must not depend on animation

Recommended approach:
- Framer Motion
- short durations
- spring-based motion for playful interactions
- reduced-motion fallback

---

## 7. Layout system

## 7.1 Desktop layout
Three-zone layout:

### Left sidebar
Persistent navigation with icon + label.
Examples:
- Dashboard
- Learn
- Pronunciation
- Vocabulary
- Materials
- Journal
- Social Ideas
- Achievements
- Settings

### Center content area
Main focus area with:
- mission hero
- learning path / roadmap
- lesson nodes
- current progress
- key daily tasks

### Right motivation panel
Secondary widgets:
- streak
- XP
- weekly goal
- daily quests
- badge shelf
- encouragement
- recent activity

## 7.2 Mobile layout
Stack intelligently:
1. top mission card
2. progress summary
3. lesson path
4. quick action cards
5. motivation widgets
6. bottom nav or compact nav drawer

Do not merely shrink the desktop layout.

---

## 8. Information architecture

Primary sections:
- Dashboard
- Learn
- Pronunciation
- Vocabulary
- Study Materials
- Journal
- Social Content
- Achievements
- Settings

### Dashboard
Main daily home.
Purpose:
- show today’s mission
- show progress
- show next action
- make return visits rewarding

### Learn
Structured lesson path or roadmap.

### Pronunciation
Playback, repeat-after-me, clips, speaking logs.

### Vocabulary
Review cards, saved words, weak words, recent words.

### Study Materials
Uploaded files, extracted phrases, pronunciation support.

### Journal
Daily reflection, what was studied, what felt hard, confidence level.

### Social Content
Quick ideas for:
- daily short video
- screenshot post
- one-sentence reflection
- before/after pronunciation logs

### Achievements
Badges, streak milestones, cumulative effort.

---

## 9. Gamification model

Gamification should support learning, not distract from it.

Use:
- streak
- XP
- lesson completion
- weekly target
- badges
- milestones
- daily quests

Examples:
- Complete 1 lesson
- Review 10 vocab items
- Record 1 pronunciation clip
- Upload 1 study resource
- Write 1 journal reflection

Avoid:
- gambling-like randomness
- manipulative urgency
- excessive notifications

---

## 10. Content style

Microcopy should feel supportive and direct.

Examples:
- Today’s mission
- Ready for your next step?
- Keep the streak alive
- Tiny progress still counts
- One recording today is enough
- Review five words and move forward

Avoid:
- overly formal language
- generic startup slogans
- fake hype
- overly cute phrasing

---

## 11. Color system

Use semantic roles, not hardcoded random colors.

Suggested token roles:
- `bg-base`
- `bg-elevated`
- `bg-panel`
- `text-primary`
- `text-secondary`
- `accent-primary`
- `accent-secondary`
- `accent-reward`
- `accent-warning`
- `accent-danger`
- `border-soft`
- `shadow-strong`

Suggested emotional mapping:
- primary accent = progress / action
- secondary accent = navigation / alternate actions
- reward accent = streaks / achievements
- warning accent = missed tasks / needs review
- danger accent = destructive actions only

---

## 12. Component behavior rules

All interactive elements should have:
- hover state
- focus state
- active state
- disabled state

Buttons:
- primary buttons should feel bold and rewarding
- secondary buttons should still feel expressive
- small text links should be minimized on main screens

Cards:
- cards should vary in prominence
- hero cards should dominate visually
- widgets should not compete equally with core tasks

Progress elements:
- always label what progress means
- use both shape and text, not color alone

---

## 13. Accessibility requirements

Must support:
- keyboard navigation
- visible focus states
- readable text contrast
- sufficient non-text contrast for controls
- reduced-motion preference
- large enough targets for touch/mobile
- hover/focus content that is usable without trapping users

Do not hide critical information behind hover only.

---

## 14. Technical implementation requirements

Framework:
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

Implementation standards:
- reusable components
- data-driven UI
- clean file structure
- design tokens for colors/spacing/radius/shadows
- responsive by default
- realistic sample content immediately visible

Suggested folders:
- `app/`
- `components/`
- `components/dashboard/`
- `components/learn/`
- `components/shared/`
- `lib/`
- `data/`
- `styles/`

---

## 15. Sample homepage structure

1. App shell with sidebar
2. Top mission hero
3. Current streak + XP row
4. Learning roadmap section
5. Pronunciation practice card
6. Study materials card
7. Daily journal card
8. Social clip ideas card
9. Weekly progress panel
10. Achievement shelf
11. Encouragement footer banner

---

## 16. Anti-patterns to avoid

Do not build:
- a white-background corporate landing page
- an all-cards-in-equal-grid dashboard
- a text-heavy homepage
- a generic SaaS analytics interface
- overly childish cartoon UI
- overly minimal flat UI with no emotional reward
- excessive motion that hurts readability

Avoid:
- tiny buttons
- pale low-contrast text
- too many identical sections
- cluttered top navigation
- dead empty states
- long paragraphs on primary screens

---

## 17. Definition of success

The design is successful if:
- it feels immediately alive
- the user instantly sees what to do next
- progress is visible everywhere
- returning daily feels rewarding
- the site is playful without looking unserious
- the UI is memorable enough to support a public-facing personal brand
