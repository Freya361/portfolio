# Case Studies & Project Details

## Project 1: AI-Powered ADHD App for Parents

**Role:** Solo Product Manager (Capstone Project @BrainStation)  
**Timeline:** 18-week roadmap  
**Year:** 2026

### Challenge
Parents raising children with ADHD carry an invisible daily load — tracking behavior with no system, arriving at medical appointments with only vague impressions, and cycling through guilt and exhaustion with no support built for them. Every existing ADHD tool targets the child or clinician, leaving the overwhelmed parent entirely unserved.

### Solution
I designed and built an 18-week roadmap for a parent-first ADHD app combining:
- Quick sub-30-second daily check-ins (behavior + mood tracking)
- Visual progress and trend visualization to share with clinicians
- AI companion providing emotional support with strict compliance guardrails
- Knowledge library for ADHD parenting education
- Crisis-detection flow routing to Canadian support resources

**Research & Strategy:**
- Designed and ran a 17-question user survey (19 respondents, 9 high-quality data entities)
- Built 5 customer personas through affinity mapping and thematic analysis
- Validated three core hypotheses: daily logging sustains, AI companion delivers support, knowledge library adds value
- Used MoSCoW prioritization to scope MVP (must-haves vs. later releases)
- Defined compliance guardrails: no clinical advice, crisis-resource fallback, PIPEDA-compliant consent

**Execution:**
- Built 18-week roadmap with parallel workstreams (strategy/approvals, design, dev, QA/safety, go-to-market)
- Authored 7 epics and 20+ user stories with Given/When/Then acceptance criteria in Jira
- Partnered on Figma clickable prototype covering check-in flow, progress visualization, and AI companion conversation
- Designed crisis-detection flow linking to real Canadian support resources

### Impact & Metrics
- Set two OKRs targeting riskiest assumptions: habit sustainability and emotional support delivery
- Launched MVP prototype with clinical compliance guardrails
- Defined measurable success metrics pre-launch (session frequency, mood trend capture accuracy, user retention)

### Key Learnings
- Parent empathy isn't a one-time discovery exercise—it shapes every product decision from MVP scope to help content
- Compliance requirements drive product design, not a checkbox at the end—build them in from the start
- Narrow your MVP ruthlessly; a sub-30-second check-in wins daily habit over a feature-complete app used once

---

## Project 2: Lenovo Pro Price Lock — SMB Contract Pricing

**Role:** Senior Product Owner  
**Timeline:** Full-stack delivery with cart and approval flows  
**Year:** 2023

### Challenge
Lenovo's SMB sales reps needed a way to offer negotiated, time-limited pricing on specific parts and configurations to business customers—locking in price and quantity for a set period like a contract. LenovoPRO had no mechanism for this; every customer saw the same tiered pricing.

### Solution
I drove requirements across the full agreement lifecycle:

**Cart & Creation Flow:**
- Reps flag line items in cart, set price and quantity limits per part
- Agreements expire after configurable period (default 60 days, capped at 365 days)
- Agreement submission goes to approval workflow

**Pricing Display Logic:**
- Approved agreement price surfaces everywhere SKU appears (search, PDP, cart, checkout) under "My Price" label
- Displays remaining quantity and expiration date
- Correctly reverts to standard pricing when quantity exhausted or agreement expires

**Approval Workflow:**
- Approver reviews entire agreement (not line-by-line)
- Full audit history of who requested and approved what
- State machine: Pending → Approved/Rejected → Expired/Cancelled

**Strategy:**
- Locked approved agreements from edits; any change requires new submission (keeps pricing audit trail clean)
- Enabled copying existing agreements to speed up repeat deals
- Delivered full-stack edge case handling: out-of-stock SKUs, zero-remaining-quantity agreements

### Impact & Metrics
- **$9M business value** projected for 6 months of use
- Scaled to **$13M at 9 months** of use
- Enabled 1:1 pricing negotiations at scale without manual workarounds
- Full state-machine lifecycle management (Pending → Approved → Expired → Cancelled)
- Real-time pricing display across all customer touchpoints
- Complete audit trail for compliance

### Key Learnings
- Building for B2B rep workflows requires obsessive edge-case thinking (What if quantity runs out mid-agreement? What if approval changes mid-month?)
- Audit trails aren't a compliance afterthought—they unlock business intelligence and customer trust
- The approval workflow matters as much as the creation flow; approval friction kills adoption

---

## Project 3: Mini Cart — Lenovo.com Checkout Experience

**Role:** Senior Product Owner  
**Timeline:** Desktop, tablet, and mobile delivery  
**Year:** 2023

### Challenge
Customers had to leave their current page and navigate to a full cart page just to check contents, adjust quantities, or see pricing. The site needed a persistent mini cart accessible from anywhere on the storefront.

### Solution
I owned the epic covering desktop, tablet, and mobile with these key requirements:

**Adaptive Display Logic:**
- Context-aware visibility (suppressed on checkout pages, configurable per country)
- Responsive design across breakpoints with consistent interaction patterns
- Reusable stepper for quantity, trash icon at zero quantity

**Real-Time Updates:**
- Cart updates without page reload
- Animated removal sequence for deleted items
- Saved-for-Later handling for unpurchaseable products

**Edge Cases:**
- Paginated carts (10,000+ items)
- Bundles and add-ons
- Configure-to-order items with dynamic pricing
- Full WCAG 2.1 AA accessibility compliance

**Analytics Instrumentation:**
- Partnered with analytics to define tracking for every interaction
- Open/close, quantity changes, navigation, errors all tracked
- Enabled measurement of component-level usage post-launch

### Impact & Metrics
- Shipped to production across all devices with full analytics instrumentation
- Persistent mini cart accessible from any page (no navigation friction)
- Real-time updates without page reload (faster, more intuitive)
- WCAG 2.1 AA accessibility compliance
- Comprehensive analytics: every interaction tracked for post-launch measurement
- Handles edge cases: paginated carts, bundles, configure-to-order items

### Key Learnings
- Persistent UI components live in many contexts—each one has different constraints (checkout suppression, country variation, device breakpoints). Build flexibility into architecture from day one
- Analytics isn't a post-launch afterthought; define tracking during requirements so you can actually measure what matters
- Small UX wins (real-time updates, persistent access) compound into big retention improvements

---

## Project 4: B2C BestBuy Instore Pickup Integration

**Role:** Senior Product Owner on cross-functional initiative  
**Timeline:** Cart and checkout scope for U.S. launch  
**Year:** 2023

### Challenge
Lenovo needed to let customers buy online at Lenovo.com but pick up in-store at Best Buy locations (BOPIS partnership). This required new cart and checkout logic layered onto the existing shopping flow, coordinated across product, UX, IT, and Best Buy's technical team.

### Solution
I owned all requirements for the cart and checkout journey covering delivery-method selection, mixed-cart logic, tax calculation, and order submission:

**Delivery Method Selection:**
- Line-item-level switching between ship vs. pickup (not cart-wide)
- Real-time Best Buy inventory checks flowing from product page into cart
- Stock reservation at checkout with configurable release timing

**Mixed-Cart Scenarios:**
- Some items shipping, others picking up in same order
- Phased MVP approach: all-pickup, all-shipping, mixed-cart by launch sequence
- Deferred edge cases to post-launch gap stories

**Tax & Financial Logic:**
- Location-based tax calculation split across pickup and shipping addresses
- Credit card payment only at launch (deferred alternative payment methods)

**Best Buy Integration:**
- Order-submission payload to Best Buy API: SKU, quantity, fulfillment mode, pickup-person details, promise date
- Coordinated with Best Buy's technical team on API contracts and timing

### Impact & Metrics
- **$20M in annual business value** per business case
- Cart and checkout scope shipped to production for U.S. customers
- Enabled Buy Online, Pick Up In Store (BOPIS) fulfillment option
- Handled line-item-level delivery-method flexibility
- Real-time inventory coordination with Best Buy
- Remaining gap stories tracked separately post-launch

### Key Learnings
- B2B partnerships (with another company's tech) require ruthless MVP scope—don't block launch on every integration edge case. Ship what works, plan gaps
- Line-item-level fulfillment logic seems simple; tax calculation and reserve timing are where complexity lives
- Phased rollout (all-pickup, then all-shipping, then mixed) reduces risk more than sequential features

---

## Project 5: Data-Driven Decisions to Improve Debt Program Success

**Role:** Co-lead on graduate Marketing Analytics team  
**Timeline:** 16-week capstone project  
**Year:** 2025

### Challenge
Credit Canada's Debt Consolidation Program (DCP) helps clients repay debt at low or no interest, but only ~50% of the ~2,200 annual enrollees complete the program. Credit Canada had rich client data but no model connecting it to success—they couldn't identify who would succeed or design interventions for who wouldn't.

### Analysis & Approach
I led data work across the full pipeline:

**Data Preparation:**
- Cleaned and engineered dataset of ~3,500 historical DCP records
- Feature engineering: debt balance, program duration, income/expenses, payment consistency, age, employment status

**Model Selection & Validation:**
- Tested four modeling approaches
- Selected XGBoost as production model
- Achieved F1 score 0.80/0.85, ROC-AUC 0.89

**Feature Importance:**
- Used SHAP analysis to rank top 10 drivers of success
- Debt balance, program duration, income/expenses, payment consistency emerged as key levers

**Segmentation Strategy:**
- Segmented clients into three response tiers:
  - Rewards for clients on track
  - Proactive intervention (consultations, flexible payment plans) triggered by early warning signs
  - Targeted support for structurally vulnerable segments (unemployed, low-income)

**Measurement Framework:**
- Proposed four measurable KPIs: satisfaction, engagement, retention, behavioral change
- Tied success measurement to funding model and revenue impact

### Impact & Recommendations
- Validated predictive model with 0.89 ROC-AUC (production-ready accuracy)
- Identified top 10 success drivers through explainable AI (SHAP)
- Designed three-tier intervention strategy with actionable levers
- Created four measurable KPIs for program tracking and evaluation
- Built revenue-impact business case showing intervention ROI

### Key Learnings
- Predictive models need explainability (SHAP, feature importance) to drive action—a black box model doesn't change behavior
- Segmentation without intervention is just labeling; tie success tiers to concrete actions (rewards, outreach, support) so insights drive decisions
- The nonprofit context changes what success looks like: retention and behavioral change matter more than financial metrics alone
