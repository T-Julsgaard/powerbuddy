# PowerBuddy: community design skills

Reviewed and installed on 6 October 2026. The PowerBuddy build prompt now explicitly incorporates the two selected skills. They are available to Codex from the next turn; this work prepared the design workflow rather than building the application.

## Selected skills

| Skill | Role in PowerBuddy | Why it fits |
| --- | --- | --- |
| [Impeccable — Paul Bakaus](https://github.com/pbakaus/impeccable) | Primary visual design, UX critique, purposeful motion, final polish | Its current guidance distinguishes operational app interfaces from marketing surfaces. Its references cover full interaction paths, typography, spacing, responsive behaviour, and consistent design systems. |
| [UI/UX Pro Max — NextLevelBuilder](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Focused checks for mobile usability, forms, charts, accessibility, and navigation | Provides a searchable local catalogue with implementation guidance. Use specific searches and assess the relevance of their results before applying them. |

Impeccable is the main design authority within the user-approved brief. UI/UX Pro Max supplies supporting guidance. They should not independently generate competing visual identities. The implementation is a web app presented as a mobile simulation, so web validation applies alongside mobile usability principles.

## Evidence and limits

The live GitHub API reported the following repository-level adoption and activity at review time. Stars apply to the whole repository, not a measured outcome for an individual skill.

| Repository | Stars at review | Latest reviewed commit date | Licence |
| --- | ---: | --- | --- |
| `pbakaus/impeccable` | 77,233 | 6 October 2026 | Apache-2.0 |
| `nextlevelbuilder/ui-ux-pro-max-skill` | 133,442 | 3 October 2026 | MIT |

These are substantial adoption signals. They do not prove that either skill produces excellent UI consistently. This research found source documentation and maintainer-produced demonstrations, not an independent controlled benchmark of designer-quality mobile app output.

Impeccable publishes a [Neo Mirai case study](https://impeccable.style/cases/neo-mirai/) describing a reference-to-working-site workflow and browser refinement. It is a useful concrete demonstration, but the example is a conference website and the evidence comes from the maintainer. PowerBuddy needs the app-focused guidance rather than that site's promotional composition.

OpenAI's [frontend design guidance](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4) also recommends visual constraints, references, and rendered inspection. The skills supplement those practices; the finished screens and interactions remain the evidence that matters.

## What was checked

- Read the Impeccable entry instructions, audit and polish playbooks, and Windows launcher source; checked the available animation reference and app-oriented mode.
- Read the UI/UX Pro Max entry instructions and inspected the local search scripts' imports and relevant execution paths.
- Installed complete skill folders, including their references and supporting data, at pinned commits using the Codex skill-installer helper.
- Confirmed required entry files and references exist after installation.
- Ran local UI/UX Pro Max searches for back/navigation behaviour and chart selection. The first chart query returned unsuitable radar/map recommendations; a narrower time-series query returned relevant trend-chart guidance. This is why the prompt requires relevance checking rather than accepting the highest-ranked result blindly.

The Impeccable engine and automatic detector have not been exercised against a PowerBuddy app: no app has been built yet. Its launcher may initialise a checksum-verified engine download on first use. The package also documents a fallback to direct context/reference reading if the launcher fails. Installation here added the skill packages; automated project hooks and browser extensions were not installed.

## Pinned installation record

| Skill | Installed folder | Reviewed commit |
| --- | --- | --- |
| `impeccable` | `C:/Users/thoma/.codex/skills/impeccable` | `4e8504f10106a1cd7a99e37a401aa368d1d55576` |
| `ui-ux-pro-max` | `C:/Users/thoma/.codex/skills/ui-ux-pro-max` | `477bcb28c9812b385cb51a4605ddf30d7b2266e2` |

Sources copied from `.agents/skills/impeccable` and `.claude/skills/ui-ux-pro-max` respectively. The latter package has self-contained scripts and data; run its scripts from the installed folder rather than relying on its example Claude-specific environment variable. Existing bundled Python is sufficient for the tested searches.

## Alternatives considered

| Candidate | Assessment for this project |
| --- | --- |
| [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | A credible, concise foundation for intentional visual decisions. Impeccable already builds on this lineage and offers a fuller app-review workflow, so a second overlapping design lead adds little here. |
| [Taste Skill](https://github.com/Leonxlnx/taste-skill) | Popular and active, but the current main skill explicitly scopes itself to landing pages, portfolios, and redesigns, excluding dashboards, data tables, and multistep product UI. That is a poor match for PowerBuddy's core journeys. Other skills in that repository were not exhaustively evaluated. |
| [OpenAI Playwright skill](https://github.com/openai/skills/tree/main/skills/.curated/playwright) | Useful complementary browser automation guidance. It was inspected but not added as another installation; the prompt already requires available browser tools to inspect screenshots and exercise flows. |

## Use in the build

Suggested kickoff after attaching the updated PowerBuddy prompt:

> Implement the complete PowerBuddy prompt. Use $impeccable in Operate mode as the primary design skill, and $ui-ux-pro-max for targeted mobile usability and chart checks. Keep the PowerBuddy brief authoritative. Build the actual mobile simulation, inspect the rendered screens, fix verified issues, and deliver the single offline HTML file with its README.

Apply the skills within the prompt's existing passes: establish the visual system, complete the journeys, then perform a bounded critique/audit/fix/polish cycle. Avoid repeatedly running overlapping audits or treating a numerical score as a substitute for viewing the interface.
