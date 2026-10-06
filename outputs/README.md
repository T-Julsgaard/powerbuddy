# PowerBuddy

A complete offline mobile-app simulation by GreenBuddies. Electricity and water belong in the same household picture, with useful plans, modest recognition, and repair/reuse rewards.

## Open and share

Open **powerbuddy.html** directly in a modern desktop browser. Double-click it, drag it into Chrome/Edge, or use the browser’s **Open file** command. No installation, server, account, internet connection, API key or supporting asset is needed. Share that single HTML file; this README is optional supporting documentation.

On a phone, the recipient needs a browser/file-opening workflow that executes local HTML. Some mobile file viewers only show a static preview. Alternatively, open the **identical file** at the [GitHub Pages live demo](https://t-julsgaard.github.io/powerbuddy/). The repository's deployment workflow publishes the standalone output; local use remains fully offline.

The desktop presentation contains a 393 × 852 CSS-pixel phone screen, shortened when the window is short. On narrow viewports the frame and simulated app status bar disappear. The app scrolls internally; Home, Usage, Plan and Rewards stay available in the bottom bar. Profile and Settings open from the household header. Close sheets with **×** or **Escape**. Multi-step sheets also provide explicit return actions.

## A five-minute walkthrough

1. **Start on Home.** September is a complete month: 210 kWh, 7 m³ and a combined electricity-plus-water variable-cost estimate of **889 DKK**. August was 240 kWh and 8 m³, so the combined estimated saving is **127 DKK**. Open the information button beside the month for the calculation.
2. **Explore Usage.** Switch between electricity and water. Inspect a bar or use the labelled slider with arrow keys; the data table supplies exact values. Choose Days/Hours to see explicitly modelled detail. October is a partial October 1–5 sample, compared with the same elapsed days of September’s model.
3. **Add a reading.** Empty, negative and nonnumeric values give specific errors. Zero is allowed. The September sample bill fills an editable form with fictional data. Review the period and values before confirming a replacement. The history and all estimates update together.
4. **Plan a cycle.** Choose an appliance, date, duration, earliest start, latest finish and acceptable hours. Compare the first feasible start with the cheapest whole-cycle window. Inspect the separate price chart, save a reminder, and try rescheduling or cancelling. A narrow window produces a useful explanation and an Adjust action.
5. **Report a habit and claim recognition.** Plan → Three loads, all full starts with one example load reported. Report two genuinely completed example loads, confirming each, to earn 60 points once. The 40 demo welcome points make a repair-workshop claim possible. Open its visible mock voucher and mark it redeemed. Repeated clicks or reloads do not duplicate awards, deductions or redemptions. The reuse event demonstrates insufficient points.

To show onboarding, choose **New household** in Simulation controls. Solo apartment and family home fill profile details; creating the household starts with **no readings**. Profile changes preserve entered history and adjust per-person figures and guidance. Shorter-shower and standby habits stay visible in Plan when chosen.

## The lock-screen demonstration

Simulation controls sit beside the phone on desktop. On mobile, open the **Simulation controls** drawer from the reserved top strip; the trigger is hidden while an app sheet has focus.

For a repeatable demonstration:

1. **Reset demo**, then **Lock**.
2. Select **Cheaper laundry window** and **Run scenario**. This visibly prepares an 18:00 washing-machine activity, sets its acceptable hours, and lowers the synthetic midday prices through the domain model. A notification appears on the simulated lock screen.
3. Tap the notification. The simulated unlock opens that exact activity. **Move to this cheaper window** changes its schedule and reminder.
4. Use **Planned activity due** to advance the controllable clock to a scheduled reminder. **Remind me in 30 min** changes its reminder time. **Screen off** demonstrates waking to a relevant event; **Home screen** demonstrates the shared unread badge, banner and working consumption widget.
5. In Settings, enable **Hide details while locked** and repeat a reading-review event. The household/activity details stay hidden until the simulated unlock. Tap-to-unlock and keyboard activation supplement the upward pointer swipe.

The required scenarios are **Cheaper laundry window, Reading needs review, Challenge complete, Quiet hours**. Two extra scenarios demonstrate an activity due and a monthly reading-based goal. Scenarios call the same domain transitions used by normal flows, establish their prerequisites, and explain what changed beneath the controls.

**Quiet hours** sets 23:00 and enters a higher fictional September reading. Its review event remains queued without waking a screen-off display. Set the clock to the following 07:00, or use Set clock → Advance to next 07:00, to release it. Category preferences still apply. Repeating the same event is suppressed; reset before replaying an already-read or dismissed demonstration. Reset clears the simulation’s reminders, notification records, toast timer and other application state.

## Data and calculations

The fixed start is **6 October 2026, 10:24 Europe/Copenhagen**. Six complete months, April–September, plus the October 1–5 partial sample are bundled. The synthetic model uses fixed seed **260106** and is deterministic, with no random runtime data or real tariffs. Daily distributions vary deterministically; hourly inspection shows an average modelled day. Daily values sum to the period total, and 24 average hourly values × elapsed days reproduce it. Editing a total regenerates its modelled breakdown. A new household has no inferred or silently filled history.

Editable assumptions live in one domain configuration object and in the collapsed **Illustrative assumptions** section of Settings:

| Assumption | Starting fixture |
|---|---:|
| Electricity flat rate | 2.40 DKK/kWh |
| Water rate | 55 DKK/m³ |
| Electricity emissions factor | 0.12 kg CO₂e/kWh |
| Washing-machine cycle energy | 0.8 kWh |
| Dishwasher cycle energy | 1.375 × laundry fixture |
| Shower-flow example | 8 litres/minute |
| Standby-load example | 10 W, for 16 hours/day |

These are **illustrative fixtures**, not current Danish tariffs or researched household benchmarks. No external price service is consulted.

- Litres = m³ × 1,000.
- Combined variable-cost estimate = electricity kWh × flat electricity rate + water m³ × water rate. Fixed charges are excluded.
- Reduction = (baseline usage − current usage) ÷ baseline usage × 100. Missing or zero baselines make the percentage unavailable. Cost differences use the same currently configured flat rate for both periods. Increases are labelled as increases.
- Electricity emissions = kWh × the mock electricity factor. There is no water emissions model.
- Partial periods compare equal elapsed durations using the labelled model, rather than a partial October with all September.
- Cycle cost sums each affected hour’s price × the energy allocated to that interval, including fractional-hour overlaps. Energy is distributed evenly over the chosen duration. The hourly price series is separate from the monthly flat-rate estimate. Planning searches 15-minute starts within one Copenhagen calendar day and respects the chosen time constraints, including their minutes. No overnight cycle is proposed.
- A saved cycle retains its energy assumption. Changing the default in Settings affects new or explicitly rescheduled cycles; it does not create phantom price savings for existing activities.
- Shorter-showers guidance assumes one minute less per resident per day for 30 days; standby guidance assumes the configured watts for 16 hours daily. Both show possibilities, rather than verified changes.

The reference comparison is **240 → 210 kWh: 12.5%, 72 DKK, 3.6 kg CO₂e difference**; **8 → 7 m³: 1,000 litres, 55 DKK**. Combined estimated cost difference: **127 DKK**.

Creating a plan does not complete a load. Self-reported completions advance only the action challenge. The 5% electricity goal is assessed against its chosen nonzero complete baseline when a subsequent complete period is entered. At the starting clock October is incomplete; advance to November before entering a full October reading, or use the monthly-goal scenario. Awards use persistent stable ledger keys. Reward claims have stable IDs and corresponding deductions; each catalogue reward can be claimed once. Redemption is a simulated one-time status change. The visible code is the actual mock voucher ID; no decorative QR code is used.

## Persistence and portable backups

When supported, browser localStorage saves the household, configuration, readings, plans, challenges, ledger, vouchers, notifications, preferences, device state and controllable clock. File-URL storage varies by browser and profile. It is **not authentication, encrypted cloud storage or a production security implementation**.

Settings explains unavailable storage and keeps the session usable. Unreadable existing data is preserved and ordinary edits do not overwrite it. Download the preserved save if needed, then explicitly reset or restore a valid backup.

**Export JSON backup** downloads the simulation state. **Import JSON backup** validates its version, data types, limits, IDs, references, duplicate keys, balance and ledger relationships before showing a review. Restoration requires an explicit confirmation. Invalid files leave the current session intact. IDs use restricted syntax and dynamic content is escaped. Backups are portable convenience files, not cryptographically signed proof of activity or awards.

No bill contents, passwords, remote tracking, uploads, utility connections or OCR are implemented. The fictional bill is a bundled fixture. Notifications and unlocking belong exclusively to the HTML simulation. They do not affect the actual device, request notification permission, or keep running after the browser closes. All partners and benefits are fictional.

## Implementation and verification

The stack is dependency-free JavaScript and CSS in the browser. This keeps the deliverable small, offline and shareable while allowing native inputs, semantic buttons, focus handling and restrained motion. `src/domain.js` owns the model and calculations; `src/app.js` owns rendering. `build.cjs` embeds the shell, CSS, model, UI and a local Lucide icon subset. Rebuild with **`node build.cjs`**; the build itself needs only Node and the committed source files. No runtime or build tool is needed to open the resulting HTML.

The bundled Lucide/Feather licensing is embedded in the HTML and preserved in `src/ICON-LICENSE.txt`. The font is a tuned native sans stack; no remote or unlicensed font asset is required. The home/pulse mark and geometric wallpaper are original.

The recorded verification is in `outputs/verification/browser-report.json`; screenshots and the review notes are in the same directory. Tests exercise direct `file://` opening in installed Chrome through Playwright with network access disabled, the requested three phone sizes, desktop and short/intermediate windows, and reduced motion. Domain tests cover the exact reference figures, partial/zero/missing baselines, model reconciliation, cycle weighting, minute constraints, idempotence, notifications and validated backups. The browser test script also covers intentionally unavailable storage and preservation of unreadable saves.

The automated Impeccable launcher/detector could not initialise on this Windows environment (`cache_directory_failed` batch-label error). Its documented fallback, independent design/technical reviews, real screenshots and browser checks were used. No design score is treated as proof. Physical phones, real touch swipes, browser-specific mobile file viewers, assistive-technology sessions and non-Chrome engines have not been certified by these tests.

Reference pages reviewed: [Tibber’s official app](https://tibber.com/no/tibber-appen), [OpenAI frontend design guidance](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4), and [frontend prompt instructions](https://developers.openai.com/api/docs/guides/frontend-prompt). They informed inspectable units, concrete constraints and render-based verification. Tibber’s linked app image could not be fetched; the implementation follows the supplied PowerBuddy art direction rather than claiming a screenshot-derived design.
