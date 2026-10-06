# PowerBuddy: project understanding and design decisions

This brief explains the decisions behind `PowerBuddy-Codex-Prompt.md`. The prompt is self-contained and can be used without attaching the original PDFs. It requests a working simulation; no application has been built as part of preparing the prompt.

## What the supplied material establishes

| Source | Relevant pages | What it contributes |
| --- | --- | --- |
| `Group_16___SWE (4).pdf` — Product Description | 2–3 | PowerBuddy is a mobile app for Danish households. Its four pillars are consumption/profile, personalised guidance, progress, and rewards/challenges. Monthly bills and household characteristics inform the profile. Smart-meter integration is excluded. |
| `Group_16___SWE (5).pdf` — Technical Overview | 2–5 | Usability, security, and functional suitability are the initial quality priorities. Requirements include manual electricity/water input, calculations, time-of-day comparison, and potential savings. The initial model is User → Household → MonthlyConsumption. Personas include a solo novice and a family managing expenses. |
| `Group_16___SWE (6).pdf` — Process Overview | Whole document reviewed; 11–12 most relevant | The academic exercise originally planned Figma prototypes rather than actual development. Definition of Done includes acceptance criteria, documentation, and peer review. Scrum calendars and collaboration tools describe team process, not product scope. |
| `Intro and motivation - Tollgate 2.pdf` | 1 | Emphasises translating information into durable everyday habits. Discusses promising but limited gamification evidence and the risk that shopping incentives increase consumption. These are the document's literature summaries; the underlying studies were not independently reviewed for this prompt. |

The user's request takes precedence over implementation plans in the attached documents. Consequently, the prompt calls for an interactive HTML simulation even though the Process Overview envisages Figma. It does not instruct Codex to alter project-management tools, contact teammates, or use real personal data.

## Product interpretation

PowerBuddy's distinguishing feature should be the connection between a reading and a practical choice. A technically elaborate chart is insufficient if a household still cannot decide what to do next. The main experience therefore moves from understandable consumption, to one relevant action, to progress that is easy to interpret.

Water deserves equal status with electricity. Electricity has a natural time-of-use planning demonstration; water can demonstrate habit guidance, volume interpretation, and consumption goals. Neither resource should become a decorative secondary tile.

The prompt preserves rewards but changes their emphasis toward repair, reuse, community participation, and recognition. The exact reward catalogue and challenge rules are proposed design choices, not requirements stated by the team.

## Research informing the design approach

OpenAI recommends establishing typography, colour, layout constraints, and visual references upfront, then inspecting the rendered result. This supports a concrete visual brief and screenshot-based refinement rather than relying on adjectives such as “stunning”. [Designing delightful frontends](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4).

OpenAI also stresses tailoring interfaces to their audience and domain, building the usable experience first, and completing expected controls and states. For PowerBuddy, this means mobile navigation, readable usage, and working plans instead of a promotional website. [Frontend prompt instructions](https://developers.openai.com/api/docs/guides/frontend-prompt).

Recent OpenAI guidance cautions that overly elaborate instruction recipes can hinder capable agents. The prompt focuses on the product, design boundaries, state relationships, and observable acceptance conditions while leaving routine implementation decisions to Codex. [Rethinking skills and prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra).

Tibber's official product page provides a relevant Nordic utility-app reference: consumption over time, detailed inspection, and connecting price information to activity timing. PowerBuddy can learn from those functions while retaining its separate identity and manual-input scope. The page was read; its linked screenshot assets could not be fetched through the research tool, so the prompt does not claim a detailed visual analysis of those screens. [Tibber app](https://tibber.com/no/tibber-appen).

The proposed warm Scandinavian palette, typography, navigation structure, specific motion timings, phone dimensions, demo scenarios, and component treatments are design judgments tailored to this project. They are not copied specifications or guarantees of aesthetic quality. The prompt requires visual inspection because a written brief alone cannot guarantee the result.

## Community skills added to the workflow

The user requested additional community design skills. After reviewing the current repositories and relevant instructions, two skill packages were installed: [Impeccable](https://github.com/pbakaus/impeccable) for the main design, critique, animation, and polish workflow; and [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) for focused mobile usability, interaction, and chart guidance. The prompt gives them separate responsibilities and retains PowerBuddy's brief as the authority.

Installation details, evidence, alternatives considered, and a repeatable kickoff are recorded in `PowerBuddy-Design-Skills.md`. These skills have substantial adoption and maintained source code, but this review did not establish independent controlled evidence that either reliably produces designer-quality results. Rendered-screen review remains essential.

## Technical decisions and limits

| Decision | Reason |
| --- | --- |
| Single HTML with embedded CSS/JavaScript/data/assets | Directly supports a portable simulation. No production services are needed. |
| Free choice of implementation language, framework, and build tools | The user has authorised Codex to choose the stack. TypeScript or JavaScript with CSS is the suggested browser implementation; frameworks and build tools are allowed if the final HTML embeds all runtime dependencies and assets. There is no Java requirement. |
| Responsive app with a desktop phone shell | Makes the same artifact convincing during desktop presentation and usable at mobile viewport sizes. |
| Simulated home screen, lock screen, and notification centre | Provides the requested experience beyond the app screen without depending on real OS integration. |
| Deterministic data and scenario clock | Presenters can reproduce the same journey, trigger events immediately, and compare calculations reliably. |
| Explainable recommendation rules | Enough to demonstrate genuine personalisation without a live AI service or unsupported claims. |
| Local persistence plus state export/import | Useful continuity with a portable fallback when file-origin storage is restricted. |

Real web notifications are a different implementation path. Notification permission is required, secure-context restrictions apply, and mobile browsers generally require service-worker notification handling. The single-file prototype should therefore implement its own system simulation rather than imply it can control a real phone's lock screen or deliver notifications after closure. [MDN: Using the Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API).

MDN states that localStorage behaviour for `file:` URLs is undefined and varies by browser. That is why the prompt asks for storage detection, a usable session fallback, and portable state export/import rather than promising persistence everywhere. [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## Important coherence issues the prompt resolves

1. **Monthly bills versus hourly charts:** an entered monthly total cannot reveal observed hourly activity. Detailed charts are explicitly modelled samples, reconciled to the totals.
2. **A cheaper time versus less consumption:** shifting laundry can reduce estimated cost without reducing energy used. Price alone also does not establish carbon impact.
3. **Potential versus demonstrated improvement:** scheduling an action or tapping completion does not prove that a household consumed less. Later readings remain the basis for consumption comparisons.
4. **Incomplete versus complete periods:** October-to-date must not be treated as a reduction against a full September. Comparisons use like periods or labelled forecasts.
5. **Variable costs versus a utility bill:** mock calculations exclude fixed charges and say so. The sample rates are not researched Danish tariffs.
6. **Mock rewards versus real partners:** catalogue names and vouchers are fictional; points and redemption still behave consistently and prevent duplicate actions.
7. **Prototype security versus production security:** privacy controls and local-only data demonstrate appropriate behaviour, but local storage and a simulated unlock are not authentication or encrypted infrastructure.

## How to use the prompt

Copy the full contents of `PowerBuddy-Codex-Prompt.md` into a Codex build chat, or attach it and ask Codex to implement it. The four source PDFs are optional because the relevant context is already included. An existing project can be supplied if the prototype must live alongside team work.

Suggested kickoff:

> Implement the attached PowerBuddy prompt completely. Treat it as the product and design brief. Build the interactive simulation, inspect the rendered interface, fix problems you find, and deliver the standalone HTML and README. Use the provided product context and clearly labelled synthetic data.

Judge the result by running the reading-entry journey, planning laundry, locking the simulated phone, triggering its reminder, opening the notification, completing a challenge, and claiming/redeeming a mock reward. A beautiful first screen alone does not complete the brief.
