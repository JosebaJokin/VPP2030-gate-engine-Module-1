# ⚠️ Definition of Done (DoD) & Engineering Rules

All commits, issues, and Pull Requests (PRs) must meet the following criteria before merging into `main`:

1. **No Raw Code in Jira:** Jira is strictly for task status tracking (`To Do`, `In Progress`, `Done`). All code, schemas, and markdown files must be committed directly to GitHub.
2. **Sub-500ms Latency Requirement:** All logic paths evaluated in `backend-engine/sandbox` must process multi-sensor payloads and output pass/shunt decisions in `<500ms`.
3. **Stateless Security Boundary:** Sandbox scripts must operate without persistent database writes to guarantee complete security isolation during shadow testing.
4. **Figma Integration:** Design updates must be exported as `.png` images to `frontend-ui/scada-wireframes/assets` and linked in `figma-links.md`.
