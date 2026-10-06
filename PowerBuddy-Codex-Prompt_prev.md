# PowerBuddy: build the complete mobile app simulation

Build a beautiful, fully interactive mobile app prototype called **PowerBuddy**, created by the student team GreenBuddies. Act as a product designer and frontend engineer. Deliver the working experience, not just a design proposal or screenshots.

This is a simulation for a software engineering project. Use fictional households, synthetic consumption histories, simulated electricity prices, and mock rewards. Visual quality is the highest priority, supported by coherent, working interactions. Aim for the care and finish of a professionally designed consumer app.

## 1. Understand the product

PowerBuddy helps ordinary households in Denmark understand and reduce **both electricity and water consumption**. Many people can see their utility readings but struggle to translate them into everyday decisions. The app should answer three questions quickly: how are we doing, what can we change, and what difference could that make?

The audience includes someone living alone with little knowledge of utilities and families actively managing expenses. Make the interface approachable for nontechnical users. Use plain language, clear units, and useful explanations rather than a dense engineering dashboard.

The intended loop is:

1. Create a household profile and enter monthly consumption.
2. Understand patterns and estimated costs.
3. Choose a relevant, achievable habit or a better time for an activity.
4. Track progress over time.
5. Earn modest recognition and sustainability-aligned rewards.

The project documents establish household profiles, manual electricity and water input, consumption overviews, personalised recommendations, progress, goals, and rewards. They explicitly exclude smart-meter and utility-provider integration. Earlier documents discuss Figma as a presentation tool; for this request, implement an executable HTML simulation instead. Team schedules, course paperwork, collaboration tools, and team members' contact details are background, not app features.

The later Tollgate 2 motivation emphasises long-term habits and cautions that shopping incentives can undermine sustainability. Reflect this in the product: useful encouragement, repair/reuse experiences, badges, and community participation. Avoid shopping-led rewards, manipulative streaks, guilt, competitive rankings, and unsupported promises of environmental benefits.

Use English interface copy for this prototype, Danish kroner, metric units, 24-hour time, and the Europe/Copenhagen simulation timezone. Keep copy easy to localise. These are implementation defaults, not requirements from the source documents.

## 2. Delivery and technical constraints

The required shareable deliverable is **`outputs/powerbuddy.html`**, a single self-contained file with all HTML, CSS, JavaScript, data, icons, and necessary assets embedded. It must open directly in a modern desktop browser and work offline without installation, a server, accounts, API keys, CDN scripts, remote fonts, or external requests. Keep it reasonably small.

You have full freedom to choose the implementation language, framework, and build tools that best support the design and simulation. Prefer TypeScript or JavaScript for browser behaviour and CSS for styling; use a framework or animation library when it materially helps. There is no Java requirement. Choose the stack autonomously and briefly document your decision in the README.

Development may use source modules, packages, and a build process, but bundle and embed everything needed into the final standalone HTML. Recipients must not need a runtime, package manager, build tools, or separate asset files. Keep domain logic separate from rendering, and preserve offline operation regardless of the chosen stack.

Provide `outputs/README.md` with opening/sharing instructions, simulation assumptions, calculation rules, limitations, and a short demo walkthrough. Actual mobile file handling varies: document that mobile recipients need a browser that executes local HTML, or an optional static web host for the identical file. Do not deploy or add a hosting dependency to the core deliverable.

Use browser localStorage when available for household settings, readings, plans, challenges, points, redemptions, and notification preferences. Detect unavailable storage and keep the session usable with a clear explanation in Settings. File-URL storage is browser-dependent. Include validated JSON export/import of simulation state as a portable backup. Never silently overwrite unreadable saved data.

Use a fictional demo identity; no real sign-in or password collection. Local storage is not secure authentication or encrypted cloud storage. Do not imply that the prototype implements the production security requirements. Avoid external tracking and uploads. Do not persist real bill contents.

## 3. Art direction: warm Scandinavian utility

Create an original, calm, confident visual identity that fits a Danish household companion. Make the product feel considered and useful, with enough character to be memorable. Every view, sheet, form, notification, empty state, and success state needs the same level of finish.

### Use the design skills with clear responsibilities

Two community skills have been installed for this workflow: **`impeccable`** from [Paul Bakaus's repository](https://github.com/pbakaus/impeccable), and **`ui-ux-pro-max`** from [NextLevelBuilder's repository](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). Read their applicable instructions and references when using them. This PowerBuddy brief and the user's instructions take priority over skill defaults.

Use **`$impeccable` as the primary design skill**, selecting its **Operate** mode for this mobile product UI. The implementation platform is web, even though the experience resembles a phone app. Use its shaping guidance to establish the design system, its critique to evaluate hierarchy and task clarity, its animation guidance for purposeful interaction feedback, and its polish pass to finish the whole journey. Preserve this brief's product facts, resource balance, palette direction, app navigation, and offline HTML constraints. Record product context and design decisions from the supplied brief; resolve routine choices autonomously.

Use **`$ui-ux-pro-max` as a targeted reference**, especially for touch targets, back navigation, form validation, chart readability, focus handling, and motion accessibility. Search one concern at a time, check that the result actually fits PowerBuddy, and retry once with narrower terms if it does not. Its database suggestions are advisory; do not let an automatically suggested landing-page layout or generic palette replace the chosen mobile app design. Resolve scripts relative to the actual installed skill folder rather than assuming a Claude-specific environment variable.

During the existing verification pass, combine an Impeccable design critique and technical audit, fix verified findings, then finish with polish. A clean detector or a self-assigned score is not proof of good visual design. Inspect real screenshots of Home, Usage, the reading form, Plan, Rewards, and the lock screen, including error and success states. Keep reviews bounded and avoid duplicating the same checks across skills. Use available browser tools to exercise the journeys as well as inspect their appearance.

If these skills are unavailable in the build environment, retain the complete design and verification requirements in this brief and report their absence. If Impeccable's launcher cannot initialise, use its documented fallback and the available browser tools; its runtime is not a dependency of the delivered HTML.

Establish a small design system before expanding the screens:

- Warm porcelain background, deep ink text, forest-green primary actions, and muted blue for water. Suggested starting tokens: background `#F6F5F0`, surface `#FFFFFF`, ink `#172720`, muted text `#56635C`, green `#215B43`, water `#376C91`, divider `#DDE2D9`. Use amber sparingly for timing cautions. Validate contrast rather than assuming these tokens work everywhere.
- One excellent sans-serif family with clear numbers. Prefer an embedded, licensed Manrope font if available; otherwise use a carefully tuned native stack. Use weight, scale, spacing, and tabular numerals deliberately. Typical body text 15–17 px, section titles 20–24 px, important figures 32–40 px, secondary labels at least 12 px.
- A consistent 4/8 px spacing rhythm, about 20–24 px horizontal screen padding, and comfortable tap targets. Use restrained radii around 10–16 px for interactive surfaces, larger radii for sheets and the device frame. Avoid giving every item the same container treatment.
- Consistent bundled icons from one established icon set, such as Lucide. Use labels for navigation and ambiguous actions. No emoji used as the primary icon system.
- A small original PowerBuddy mark that reads well at app-icon size. Avoid the generic leaf-inside-a-circle sustainability logo. A simple geometric connection between a home and a pulse could work; keep it restrained.

Compose the Home screen as a purposeful mobile screen: compact household header; a prominent, clearly labelled monthly status; a paired electricity/water summary; one useful next action; and a glimpse of progress. Use open space, dividers, rows, and chart areas. A card is appropriate for an actionable recommendation or challenge, not as the default wrapper for every number and paragraph. Make both resources visible near the top.

Charts should be beautiful because they are readable: clear axes, visible units, thoughtful scales, simple comparisons, and a selected-value callout. Use tappable or draggable inspection with a keyboard alternative. Avoid decorative chart curves and gratuitous area fills. Separate consumption and price when their units differ.

Reject these outcomes during review:

- A marketing landing page, desktop SaaS template, sidebar dashboard, or website squeezed into a phone.
- Purple gradients, glowing glass panels, oversized hero slogans, excessive pills, repeated identical cards, stock eco illustrations, or decorative charts with no meaning.
- Tiny grey labels, cramped forms, excessive shadows, competing primary actions, arbitrary icons, filler copy, and empty controls.
- Childish gamification, an omnipresent mascot, confetti on routine taps, or animation that obstructs reading.

Research context: OpenAI's frontend guidance recommends explicit design constraints, references, domain-appropriate interfaces, and visual inspection. Use those principles with judgment for a mobile utility app; landing-page hero rules do not belong here. Tibber's official app is a useful reference for consumption inspection and price-related decisions. Learn from its clarity without copying branding, layouts, or implying its smart-meter capabilities exist in PowerBuddy. Relevant references:

- [OpenAI: Designing delightful frontends](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4)
- [OpenAI: Frontend prompt instructions](https://developers.openai.com/api/docs/guides/frontend-prompt)
- [Tibber: The app](https://tibber.com/no/tibber-appen)

If browsing and image viewing are available, examine a small number of actual mobile app references and record the specific qualities informing your design. If reference images are inaccessible, proceed with this art direction and describe that limitation. Do not replace product design with a collage of references or pause the build for routine aesthetic approval.

## 4. Make it feel like an app on a phone

On desktop, show a convincing but restrained generic phone frame, approximately 393 × 852 CSS px for its screen, on a quiet presentation background. Include simulated status information, rounded screen corners, and a home indicator. Make the screen scroll internally with a stable bottom tab bar. Accommodate short browser windows without clipping content or making controls unreachable.

At mobile widths, remove the redundant device frame and let the app occupy the available viewport. Handle `100dvh`, safe-area insets, and browser chrome. Do not duplicate a real phone's status bar or camera cutout in the full-screen app view. Provide access to the simulated system screens through a compact presenter drawer.

Use four main tabs: **Home, Usage, Plan, Rewards**. Open Profile and Settings from the header. Preserve sensible back navigation, selected tabs, and scroll positions. Sheets need visible close/cancel actions and escape-key support. Avoid nested modal stacks.

Outside the app's product UI, provide unobtrusive presenter controls for **Lock, Home screen, Open app, Notification Centre, Scenarios, and Reset demo**. On desktop these sit beside the phone; on mobile they live in the presenter drawer. Label this area “Simulation controls”. Keep technical explanations and demo switches out of the user's everyday app screens.

## 5. Complete the core journeys

### Household setup and Settings

Open initially in a populated, polished demo Home screen. Make “Start a new household” available through presenter controls to demonstrate onboarding without forcing every viewer through setup.

Use a brief setup flow: household nickname, city/region, resident count, housing type, and optional relevant routine/appliance information. Ask only what influences a feature. Include two example personas: a solo apartment resident and a family household. Let editing resident count or routines visibly change suitable recommendations and per-person interpretation, while preserving previously entered usage readings.

Settings include editable simulation rates, notification categories, quiet hours, preview privacy, reduced motion, state export/import, and reset. Use friendly, specific copy. Mark the simulation once in an unobtrusive place and identify synthetic/estimated views where they could otherwise mislead.

### Home and Usage

Show electricity in kWh, water in m³ with an optional litre explanation, estimated variable cost in DKK, and change against a clearly identified comparison period. Clearly label any combined monetary figure as the combined electricity-plus-water estimate.

Offer electricity/water switching, month selection, and a monthly history chart. Include separate detailed synthetic day/hour views for demonstrating time-of-day patterns. Those views must be explicitly labelled as modelled demo data; monthly bill entry does not measure real hourly activity. Comparisons against similar households, if included, must also be labelled synthetic.

“Add reading” opens a carefully designed form for the billing period, electricity consumption, and water consumption. Collect usage during the period, not an unexplained cumulative meter number. Validate missing, negative, nonnumeric, and duplicate-period entries. Zero is a valid possible usage value. Warn about unusually high values without declaring a genuine bill impossible. Let users review before confirming replacement of an existing period. Saved or edited readings update all dependent views.

Support a clearly labelled **sample bill import** using fictional bundled bill data, followed by an editable confirmation step. Do not silently pretend to have extracted values from an arbitrary PDF. Real OCR and utility integration are outside scope.

### Plan and personalised guidance

Recommendations must connect a pattern to an achievable action and an explained estimate. Examples: run a full laundry load in a cheaper available window, shorten showers, or reduce standby use. Filter and rank guidance using household details, selected habits, consumption trends, and simulated prices. Use simple explainable rules; no AI service is required.

The signature interaction is **Plan a laundry cycle**: choose the appliance, duration, earliest start, latest finish, and acceptable hours; compare a convenient initial time with a cheaper feasible window; inspect the price chart; save the plan; and schedule a reminder. Estimate cost from the energy used across each hour of the cycle, not just the start-hour price. Never suggest a window outside the household's constraints. If none is feasible, explain this and let the user adjust the constraints. Offer reschedule and cancel.

Clearly distinguish “could save” estimates from reductions demonstrated by later entered readings. Moving a cycle to a cheaper time does not reduce its kWh. A lower price does not automatically mean lower emissions. Marking a habit complete can advance a self-reported challenge; it must not rewrite measured monthly readings or claim verified savings.

### Progress, challenges, and rewards

Include readable monthly progress within Usage, alongside challenge progress in Plan/Rewards. Demonstrate both an action-based challenge, such as self-reporting three completed full laundry loads, and a consumption goal assessed when a subsequent full period is recorded. Distinguish self-reported actions from reading-based comparisons. Merely creating a plan does not complete the activity.

Let users join a challenge, inspect its criteria, make legitimate progress, and see completion. Grant points once per eligible completion using a persistent ledger. Opening the same view, reloading, or double-clicking must not grant points again. Show a small, elegant achievement response.

Provide a curated fictional reward catalogue with point costs, detail views, and claimed-reward history. Prefer repair-workshop places, reuse events, community recognition, and digital badges. Mark partner names and benefits as fictional. A claim checks the balance, deducts points once, records an ID, and creates a mock voucher with a visible code. If you display a QR code, it must actually encode the mock voucher ID; otherwise use the visible code alone. A simulated “Mark redeemed” action changes its status once and prevents repeat redemption. Include an insufficient-points state and an already-redeemed state.

## 6. Simulate the experience outside the app

Implement a small **phone system simulation** within the same document, with these device states: app foreground, simulated home screen/app background, locked, and screen off. Retain app state while switching between them. The home screen only needs a PowerBuddy icon, unread badge, tasteful wallpaper, and one useful PowerBuddy widget with a working deep link.

Make the lock screen visually excellent: a large clock and date, a subtle wallpaper, believable notification surfaces, and clear unlock behaviour. Support pointer/touch swipe-to-unlock if feasible, plus a visible tap and keyboard alternative. Unlocking is a simulated action, not authentication.

Notifications come from shared application events, not disconnected sample cards. Support:

- A cheaper feasible electricity window for a saved activity.
- A reminder that a planned activity is due.
- A newly entered usage reading that warrants a gentle review.
- A challenge completed or a reward available.

When the app is foregrounded, use a restrained in-app update. When on the simulated home screen, display a short banner and badge. When locked, add the notification to the lock-screen stack. When screen-off, record it and wake the simulated display when appropriate. Notification Centre retains unread/read/dismissed state consistently. Clicking a notification unlocks through the simulated transition if needed, marks it read, and opens the exact relevant plan, reading, or challenge.

Provide contextual actions such as “Remind me later” for a due plan; actions must change the schedule/state. Support category preferences, quiet hours, duplicate suppression, and “Hide previews while locked”. With hidden previews, conceal household usage, cost, and activity detail until the simulated unlock. Keep copy brief and helpful, without alarmism or repeated nudges.

The simulator must use a controllable clock and deterministic scenario triggers so a presenter can demonstrate an event immediately. Include **Cheaper laundry window, Reading needs review, Challenge complete, and Quiet hours** scenarios. Trigger events through the same business logic used by normal flows, not arbitrary DOM changes. If a scenario needs prerequisite state, establish it visibly and predictably. Reset restores a known starting state and clears pending timers.

All of this runs inside the HTML document. It does not modify the real device lock screen, deliver real OS push messages, or continue running after the browser is closed. Real web notifications require platform permissions and, for mobile, service-worker infrastructure; they are outside this single-file prototype. Do not request actual browser notification permission. The simulated lock-screen journey is mandatory and must work offline.

## 7. Coherent simulation and calculation rules

Use a fixed seed and a fixed starting demo date, **6 October 2026**. Load six complete previous months plus a clearly identified October-to-date sample. Keep daily/hourly synthetic samples reconciled to their corresponding period totals. When a monthly total is edited, update any corresponding modelled breakdown consistently without implying the breakdown was observed. Preserve missing data as missing; do not silently fill a new household's records.

Do not compare October-to-date directly with a full September. Compare equal elapsed durations using explicitly modelled data, or show a clearly labelled forecast. Monthly reduction challenges use complete comparable periods.

Put mock assumptions in one configuration object and expose them through Settings. Example fixtures, explicitly **not current Danish tariffs or researched benchmarks**:

- Flat illustrative electricity rate: 2.40 DKK/kWh.
- Water rate: 55 DKK/m³.
- Electricity emissions factor: 0.12 kg CO₂e/kWh.
- Demo laundry cycle energy: 0.8 kWh, distributed across the chosen duration.
- Separate synthetic hourly electricity-price series for activity planning.

Use the flat rate for monthly variable-cost comparisons and the hourly series for cycle estimates; identify the basis in the estimate details so the two views do not falsely claim to be the same full-bill calculation. Exclude fixed charges unless you explicitly model and label them.

Required relationships:

- Water litres = m³ × 1,000.
- Monthly variable-cost estimate = electricity kWh × configured flat rate + water m³ × configured water rate.
- Usage reduction percentage = (baseline usage − current usage) / baseline usage × 100, with an unavailable state for a zero/missing baseline.
- Estimated saving from a usage reduction = usage difference × the same chosen rate for both periods. Negative savings indicate an increase; do not disguise them as progress.
- Electricity emissions estimate = kWh × configured mock factor. Avoid claims about water-related emissions unless you define a separate justified model.
- Planned cycle cost = sum of energy allocated to each affected hourly interval × its simulated price.

For a reference case, electricity falling from 240 to 210 kWh is a 12.5% reduction and 72 DKK of estimated variable-cost saving at the mock rate. Water falling from 8 to 7 m³ saves 1,000 litres and an estimated 55 DKK. Combined estimated cost saving is 127 DKK. Electricity emissions difference is 3.6 kg CO₂e using the mock factor. These values should agree wherever this fixture is displayed.

Use stable IDs and a shared state model for household, readings, simulated prices, recommendations, plans, challenges, points, redemptions, notifications, device mode, and simulation time. Format at display time; calculate using unrounded values. Simulated events should be repeatable and should not depend on waiting through real days.

## 8. Motion, accessibility, and verification

Define a coherent motion language: crisp button press feedback around 100–160 ms; navigation and chart changes around 200–300 ms; sheets and notification entrances around 280–380 ms. These are starting ranges, not excuses to animate every component. Use opacity and transforms where appropriate. Keep transitions interruptible; rapid taps must not corrupt state.

Include tactile visual feedback for clicks/taps, smooth sheet opening/closing, a clear selected-tab transition, chart transitions that preserve context, notification arrival, and a refined lock/unlock transition. A completed challenge may have a brief celebratory flourish. Avoid endless pulsing, bouncing numbers, theatrical page entrances, long fake loading screens, and blocking animation.

Respect `prefers-reduced-motion` and the app setting. Keep text readable, normal-text contrast at least 4.5:1, essential controls at least about 44 × 44 CSS px, visible focus, semantic buttons and labels, and accessible chart summaries. Never rely solely on colour, hover, drag, or a hidden gesture. Announce validation and relevant state changes without repeatedly reading the entire screen.

Develop in three passes without stopping for routine approval:

1. Establish tokens and build the actual Home screen, reading sheet, and lock screen. Render and inspect them early; refine typography, hierarchy, and spacing before spreading the design.
2. Complete the remaining journeys using that visual system and shared state.
3. Inspect rendered screenshots and exercise interactions at desktop size and 393 × 852, 360 × 800, and 430 × 932 mobile viewports, including reduced motion. Fix discovered problems and rerun the affected checks.

Use the available browser automation tools, such as Playwright, to verify user journeys and capture screenshots. Read local browser-tool instructions when applicable. Verify direct file opening and offline operation, not just the development-server version. If browser tools are unavailable, complete the deliverable and clearly state which visual or behavioural checks remain unverified; do not claim inspections you did not perform.

Acceptance checks must demonstrate:

- All four tabs, onboarding, profile editing, sheets, and back navigation work.
- Both resources are visible and understandable; all charts have correct units and meaningful interactions.
- Valid input updates dependent figures; invalid and duplicate entries have useful handling.
- The numeric reference case above is correct; missing/zero baselines and partial periods do not produce misleading comparisons.
- Household constraints change recommendations and feasible cycle plans; reschedule/cancel affect reminders.
- Challenge points, reward claims, and redemptions cannot be duplicated by repeated clicks or reloads.
- Lock/home/foreground/screen-off notification presentation, deep links, quiet hours, privacy, and badges agree with shared state.
- Normal local persistence works where supported; unavailable storage, state import/export, and reset behave correctly.
- The offline HTML makes no required network requests and has no JavaScript errors, broken assets, horizontal overflow, clipped text, or unreachable controls in the checked viewports.
- Every visible action has a meaningful result; intentionally decorative system indicators are not styled as buttons.

In the final response, link the HTML and README, briefly describe the completed demo, report what you actually verified, and identify material limitations. The finish line is a beautiful app people can explore and a compelling, repeatable lock-screen notification demonstration.
