# CONTENT_LANGUAGE_GUIDE.md

## Language System

### 1) Interface Layer (Primary: Traditional Chinese)
- Navigation, buttons, dashboard labels, upload messages, settings text
- Stored in `src/locales/zh-TW/ui.json` and `src/locales/zh-TW/pages.json`

### 2) Learning Layer (Primary: Japanese)
- Vocabulary, practice phrases, example sentences
- Japanese first, with kana and Traditional Chinese support
- Stored in `src/content/phrases/*` and `src/content/vocab/*`

### 3) Brand Layer (Mixed zh-TW + ja-JP)
- Hero slogans, emotional copy, philosophy snippets
- Stored in `src/locales/zh-TW/brand.json` and `src/locales/ja-JP/brand.json`

### 4) English Usage
- Only for code, config, and technical naming where needed
- Not used as visible UI primary language

## Display Mode Rules

### beginner
- show: Japanese + kana + Traditional Chinese
- use case: first pass and confidence-building

### study
- show: Japanese + Traditional Chinese
- kana: collapsible/optional
- use case: daily review and medium familiarity

### immersion
- show: Japanese first
- zh-TW hidden by default
- use case: output training and real-time comprehension pressure

## Implementation Files
- `lib/learning/types.ts`
- `lib/learning/display-mode.ts`
- `components/shared/LearningDisplayModeSwitch.tsx`

## Tone Guidelines
- Warm, motivating, mature
- Avoid childish over-cheerfulness
- Encourage consistency over perfection
Project: Japanese After 50
Audience: Primarily Taiwanese users learning Japanese
Primary content strategy: Traditional Chinese for interface, Japanese for learning content, mixed Chinese/Japanese for brand tone

---

## 1. Core language strategy

This product is for Taiwanese users learning Japanese.

Therefore:

- UI language should be primarily **Traditional Chinese**
- Learning content should be primarily **Japanese**
- Brand and emotional copy can use a **Chinese + Japanese mix**
- English should be minimized in the main user-facing interface

This is not a fully Japanese-native product.
This is a Japanese learning product for users who read Traditional Chinese and are familiar with Hanzi.

The goal is to reduce friction in navigation while keeping Japanese central to the learning experience.

---

## 2. Language roles by layer

### 2.1 Interface layer
Use **Traditional Chinese** for:
- navigation
- buttons
- settings
- upload instructions
- progress labels
- notifications
- helper text
- form labels
- system messages
- empty states
- error states

Examples:
- 今日任務
- 發音練習
- 單字複習
- 上傳教材
- 本週進度
- 連續學習天數
- 儲存
- 開始練習

Reason:
These elements are operational, not educational. They should feel effortless.

---

### 2.2 Learning layer
Use **Japanese as the primary language**, with Traditional Chinese support.

Applies to:
- vocabulary
- phrases
- dialogues
- sentence patterns
- pronunciation drills
- listening material
- example sentences

Preferred format:
- Japanese term or sentence first
- reading support if needed
- Traditional Chinese meaning/explanation below
- optional audio/playback

Example:
- 注文する
- ちゅうもんする
- 點餐、下單
- レストランで昼ご飯を注文します。
- 我在餐廳點午餐。

Reason:
Japanese must remain the focus of study, but Chinese support lowers cognitive load.

---

### 2.3 Brand layer
Use a **Chinese + Japanese mix**.

Applies to:
- homepage hero
- slogans
- banners
- encouragement messages
- section names with identity value
- social-facing copy

Examples:
- 50後學日語
- 今日も一歩ずつ
- 小小進步，也算進步
- 日本語修行中
- 從台灣出發，慢慢走進日文世界

Reason:
This gives the product identity, warmth, and memorability.

---

## 3. Recommended language proportion

Recommended overall ratio:

- Interface: 70–80% Traditional Chinese
- Learning content: 60–70% Japanese
- Brand copy: mixed Chinese/Japanese
- English: only for technical/admin/developer areas if necessary

This ratio helps the product feel:
- friendly
- clear
- authentic
- not intimidating
- culturally relevant for Taiwanese users

---

## 4. Page-level language policy

### 4.1 Homepage
Use:
- Traditional Chinese as primary headline language
- Japanese as supporting emotional/branding language

Reason:
Homepage is an onboarding space, not the main learning screen.

Recommended pattern:
- Main title in Traditional Chinese
- Supporting line in Japanese
- CTA in Traditional Chinese

Example:
- 50後學日語，不急，天天進步
- 今日も一歩ずつ、日本語を自分のものにする。
- 開始今天的任務

---

### 4.2 Dashboard
Use:
- Traditional Chinese for cards, labels, actions, progress
- Japanese selectively in “today’s phrase”, “mission phrase”, “example expression”

Reason:
Dashboard should feel clear and motivating.

---

### 4.3 Lesson pages
Use:
- Japanese as the main content
- Traditional Chinese as explanation/support
- furigana or kana where necessary

Reason:
This is the actual learning zone.

---

### 4.4 Pronunciation pages
Use:
- Japanese phrase prominently
- Traditional Chinese meaning below
- controls in Traditional Chinese

Reason:
The user acts through the UI, but practices through Japanese.

---

### 4.5 Journal / reflection pages
Use:
- Traditional Chinese as default writing prompt language
- allow optional Japanese writing mode later

Reason:
Reflection should be easy and low-friction.

---

### 4.6 Social content pages
Use:
- mostly Traditional Chinese for creation prompts
- Japanese inserted into sample captions and talking points

Reason:
Users create content faster in Chinese, but their content should still reflect Japanese learning.

---

## 5. Bilingual display rules

Do not mix languages randomly.

Use these stable patterns:

### Pattern A: Chinese primary, Japanese secondary
Use for:
- homepage
- dashboard section headers
- emotional banners
- branded modules

Example:
- 今日任務
- 今日のミッション

### Pattern B: Japanese primary, Chinese secondary
Use for:
- vocabulary
- phrases
- sentence practice
- listening and pronunciation cards

Example:
- 今日は何を食べますか。
- 今天要吃什麼？

### Pattern C: Japanese + kana + Chinese
Use for:
- new vocabulary
- beginner/intermediate support
- kanji-heavy material

Example:
- 勉強（べんきょう）
- 學習、讀書

Do not:
- give equal visual weight to both languages everywhere
- repeat every phrase in two languages at identical size
- create cluttered bilingual blocks

There must always be a visual hierarchy.

---

## 6. Script usage rules

### 6.1 Traditional Chinese only
Do not use Simplified Chinese in the user-facing interface.

### 6.2 Japanese script handling
Japanese content may include:
- kanji
- hiragana
- katakana
- furigana/kana support when needed

For beginner-friendly content, provide reading support for difficult kanji.

---

## 7. Tone guidelines

### Traditional Chinese tone
Should be:
- friendly
- encouraging
- clear
- natural
- not too formal
- not too childish

Good examples:
- 今天先完成一小步就很好
- 先跟讀一次，再聽一次
- 你已經連續學習 6 天了

Avoid:
- 官腔
- 過度勵志雞湯
- 太可愛幼稚的語氣
- 太像企業後台

### Japanese tone
Should be:
- practical
- natural
- learning-oriented
- short
- easy to scan

Good examples:
- 今日の表現
- まずは声に出してみよう
- もう一回聞いてみよう
- よくできました

Avoid:
- overly literary Japanese
- difficult native-only expressions in core beginner UI
- long, dense Japanese instructions

---

## 8. Content formatting rules

### 8.1 Vocabulary card
Preferred order:
1. Japanese word
2. reading (if needed)
3. Traditional Chinese meaning
4. Japanese example sentence
5. Traditional Chinese translation
6. play audio CTA

### 8.2 Phrase card
Preferred order:
1. Japanese phrase
2. Traditional Chinese meaning
3. optional reading support
4. pronunciation action

### 8.3 Hero copy
Preferred order:
1. Traditional Chinese headline
2. Japanese supporting line
3. Traditional Chinese CTA

### 8.4 Progress widgets
Prefer Traditional Chinese only.

Reason:
Progress tracking is operational information.

---

## 9. Language modes

The product should support three future-facing language modes.

### Mode 1: 入門模式
- interface in Traditional Chinese
- Japanese content with visible Chinese explanation
- kana/furigana support shown by default

### Mode 2: 學習模式
- interface in Traditional Chinese
- Japanese content primary
- Chinese explanation collapsible or secondary

### Mode 3: 沉浸模式
- some interface areas can become Japanese-first
- Chinese support hidden by default
- suitable for advanced users

Default recommendation:
Use 入門模式 or 學習模式 as default.

---

## 10. Accessibility and readability

Because the audience may include 50+ learners:

- keep font sizes comfortable
- avoid dense bilingual blocks
- ensure adequate line spacing
- keep button labels short
- make pronunciation controls obvious
- never rely on Japanese-only labels for core operations
- avoid low-contrast text

---

## 11. SEO/content publishing guidance

For public-facing pages:
- homepage titles can be mostly Traditional Chinese
- include Japanese terms naturally where brand identity benefits
- article pages can use Chinese titles with Japanese keywords
- avoid English-heavy page titles unless technically required

Examples:
- 50後學日語：每天一點點，也能慢慢進步
- 今日の表現：點餐時常用的日文句子
- 日本語修行中：我的發音練習記錄

---

## 12. Anti-patterns to avoid

Do not:
- make the whole interface fully Japanese
- make the whole product fully Chinese with Japanese only as decoration
- over-translate everything into duplicate blocks
- use English as the default visual language
- mix Chinese/Japanese inconsistently across similar components
- treat kanji familiarity as full comprehension

---

## 13. Success criteria

The language system is successful if:
- Taiwanese users can navigate the product effortlessly
- Japanese remains central in the actual learning flow
- the product feels culturally aligned with Taiwanese learners
- the homepage feels distinctive and brandable
- users feel supported, not overwhelmed
