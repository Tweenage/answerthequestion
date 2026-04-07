# Tweenage Product Architecture — April 2026

## Vision

An ecosystem of tools for parents of 7-11 year olds, with 11+ preparation as the hero use case but designed to serve broader needs (SATs, general schoolwork, homework help).

**Parent brand:** Tweenage (TBC — Rebecca considering)
**Core insight:** Parents buy materials and tools but struggle with consistency, understanding, and emotional management. The platform solves all three.

---

## Products

### 1. Answer The Question (ATQ)
- **For:** Child (ages 8-11)
- **Purpose:** Exam technique training using the CLEAR Method
- **Status:** Built, live, in beta
- **Market:** 11+ only
- **Domain:** answerthequestion.co.uk
- **Price:** Part of suite (currently £29.99 standalone)

### 2. Spelling Bee
- **For:** Child (ages 7-11)
- **Purpose:** Vocabulary and spelling mastery (statutory + 11+ words)
- **Status:** Built, deploying
- **Market:** 11+, SATs, general school
- **Domain:** TBD (needs own clean domain, not a subdomain)
- **Price:** Part of suite (currently £19.99 standalone)
- **Visual identity:** Amber/yellow theme, BeeChar mascot — distinct from ATQ purple

### 3. Parent Hub
- **For:** Parent
- **Purpose:** Everything the parent needs to support their child
- **Status:** Not yet built
- **Market:** Primarily 11+, but modules like Explainer and Emotional Coach are broadly relevant
- **Domain:** Inside parent brand site (e.g. tweenage.co.uk/hub)
- **Price:** Part of suite

#### Parent Hub Modules:

**A. Project Planner**
- Calendar view (month/week)
- Input tutor sessions (days, times, subjects)
- Input homework tasks with deadlines
- Auto-schedule practice around tutoring and rest days
- Nudges: homework due, daily ATQ practice, spelling tests
- Consistency tracking (streaks, missed days)
- Rest day protection (don't let it become relentless)

**B. Score Tracker & Focus Finder**
- Input mock test scores (by subject/paper)
- Input homework scores
- Input tutor feedback
- Trend charts — is maths improving? Is reasoning dropping?
- AI-powered recommendation: "Focus 60% on reasoning this month"
- Links back to ATQ/Spelling Bee for targeted practice
- **Real-world activity suggestions** — not just academic recommendations:
  - Board games (Monopoly for maths, Scrabble for spelling)
  - Cooking together (fractions, doubling recipes)
  - Puzzles and Lego (spatial reasoning)
  - Reading and discussing books (comprehension)
  - Word games in the car (verbal reasoning)
  - Chess (pattern recognition)
- Nudges for real-world activities at parent-chosen times
- Framed as: "not everything has to be a worksheet"

**C. The Explainer (Chatbot)**
- Photo a question → AI tells you the answer AND how to explain it to a child simply
- "How do I explain long division to a 9-year-old?"
- "My child doesn't understand what 'infer' means"
- Uses Claude API with system prompt tuned for parent-to-child explanation
- **Highest viral potential** — useful for ANY parent, not just 11+
- Could break out as standalone product later if it takes off
- **Must consider API costs** — per-query charges (Claude API ~£0.01-0.05/question)

**D. Resource Library**
- **Core insight:** Parents buy books, flashcards, workbooks — then never use them consistently
- Parent photographs their materials (30 min setup)
- AI indexes and tags: subject, topic, difficulty, type (flashcard, worksheet, explanation page)
- App builds a rotation schedule from the photographed materials
- Nudges at parent-chosen times: "Show 3 maths cards today" / "Do page 14 of Bond book"
- Parent marks done or skips
- Tracks what's been used and what's gathering dust
- Searchable: "show me all the fractions pages I've photographed"
- Add custom spellings from homework → feeds into Spelling Bee app
- The photo/indexing feature is the ENTRY POINT for this module — without it, nudges have nothing to work with

**E. Emotional Coaching**
- How to encourage without pressuring
- Common traps to avoid (making it feel like pass/fail defines them)
- Expectation management — preparing for all outcomes
- Contingency planning module:
  - Research alternative schools
  - Plan what to say to your child if they don't get in
  - Frame it as "we have a plan either way"
  - Age-appropriate scripts for different scenarios
- Calm check-ins for the parent: "How are YOU feeling about this?"
- Could be partly curated content, partly chatbot
- Relevant beyond 11+ (any high-stakes school situation)

---

## Brand Architecture

### Recommended Structure
```
tweenage.co.uk (or TBD parent brand)
├── Marketing/sales hub — "Smart tools for parents of 7-11 year olds"
├── One checkout: £49.99 for everything
│
├── answerthequestion.co.uk → ATQ (child, 11+ specific)
├── [clean domain TBD]      → Spelling Bee (child, broader appeal)
└── tweenage.co.uk/hub      → Parent Hub (parent)
```

### Market Positioning
- **Lead with 11+** — sharpest market, highest urgency, highest willingness to pay
- **But don't lock yourself in** — Spelling Bee, Explainer, and Emotional Coach work for any parent
- Landing page: "Preparing for the 11+? We've got you covered. But Tweenage tools work for any family with children aged 7-11."

### Product-Market Fit by Segment
| Product | 11+ Parents | SATs Parents | General Parents |
|---|---|---|---|
| ATQ (exam technique) | Core | Some value | Not relevant |
| Spelling Bee | Core | High value | High value |
| Explainer Chatbot | Core | High value | **Highest value** |
| Planner/Tracker | Core | Some value | Overkill |
| Emotional Coach | Core | Some value | Relevant |
| Activity Recommender | Core | High value | High value |
| Resource Library | Core | High value | High value |

---

## Pricing Strategy

### Recommended: Suite Model (simplest)
- **£49.99 one-time** — unlocks everything (ATQ + Spelling + Parent Hub)
- Single `has_paid` boolean in database — no per-product flags
- As new features/apps are added, value grows without price change
- **Exception:** Explainer chatbot may need usage-based pricing or soft cap due to API costs

### Alternative: Individual + Bundle (more complex)
- ATQ: £29.99
- Spelling: £19.99
- Parent Hub: £29.99
- Everything: £49.99
- Cross-sell via email after purchasing one product

### Decision: TBC (Rebecca considering)

---

## Technical Architecture

### Monorepo Structure
```
apps/
  atq/            → answerthequestion.co.uk (Vercel)
  spelling/       → spelling domain TBD (Vercel)
  hub/            → parent hub (Vercel)
  marketing/      → tweenage.co.uk sales site (Vercel)
  [other apps]/   → future products

packages/
  shared/         → @atq/shared (auth, Supabase, layout primitives, shared components)

supabase/
  functions/      → Edge Functions (checkout, webhooks, etc.)
  migrations/     → Database schema
```

### Shared Infrastructure
- **Supabase:** Single project for all apps (shared auth, shared database)
- **Auth:** One account works across all apps
- **Vercel:** Separate deployment per app (each has own domain)
- **LemonSqueezy:** Payment processing

### Data Flow Between Apps
| Data | From | To |
|---|---|---|
| ATQ daily practice completed | ATQ app | Parent Hub (calendar, nudges) |
| Spelling test scores | Spelling Bee | Parent Hub (score tracker) |
| Mock test scores | Parent (manual input) | Parent Hub (focus finder) |
| Custom spelling words | Parent Hub | Spelling Bee |
| Tutor schedule | Parent Hub | Parent Hub (calendar) |
| Homework tasks | Parent Hub | Parent Hub (nudges) |
| Photographed materials | Parent Hub | Parent Hub (resource library, nudges) |

All data flows through shared Supabase database — apps don't talk to each other directly.

### API Cost Considerations
| Feature | Cost Per Use | Notes |
|---|---|---|
| Explainer chatbot | ~£0.01-0.05/question | Claude API |
| Photo indexing | ~£0.01-0.03/photo | Claude Vision API |
| Custom word definitions | Free | Free dictionary APIs |
| Custom word TTS | Free | Browser TTS |
| Custom word images | ~£0.02-0.05/image | AI image generation (consider if needed) |

---

## Build Order (Recommended)

| Priority | What | Why |
|---|---|---|
| 1 | Fix + polish ATQ and Spelling Bee | Must work flawlessly before adding more |
| 2 | Decide brand name + buy domains | Foundation for everything else |
| 3 | Build marketing/sales site | One place to sell everything |
| 4 | The Explainer chatbot | Smallest build, highest wow factor, most viral potential |
| 5 | Score Tracker + Planner | High value, straightforward build |
| 6 | Resource Library (photo scanning) | Needs AI vision API, more complex |
| 7 | Emotional Coaching | Content-heavy, can start as curated articles + chatbot |
| 8 | Activity Recommender | Builds on Score Tracker data |

---

## Open Decisions

- [ ] Parent brand name (Tweenage? Other?)
- [ ] Pricing model (suite vs individual)
- [ ] Spelling Bee domain name
- [ ] Whether Explainer starts inside Hub or as own app
- [ ] Whether to serve non-11+ market at launch or expand later
- [ ] Other apps Rebecca wants to build (mentioned "a couple of other apps which aren't 11+")
- [ ] API cost model for chatbot/photo features (included in price? Usage cap? Subscription?)

---

*Captured from strategy session, 6 April 2026*
