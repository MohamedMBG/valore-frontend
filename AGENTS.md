<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
---

# 16. FRONTEND DOCUMENTATION & AUDIT RULES (MANDATORY)

For EVERY frontend task, component, page, animation, API integration, state-management logic, or UI refactor, the agent MUST:

- Add meaningful comments inside the code
- Explain complex animations
- Explain scroll logic
- Explain state logic
- Explain performance optimizations
- Explain API/frontend synchronization logic
- Explain responsive behavior decisions

Comments MUST explain:
- WHY the implementation exists
- HOW the interaction works
- IMPORTANT UI/UX decisions
- Animation timing logic
- Non-obvious rendering behavior

Example:

```tsx
// Using requestAnimationFrame here instead of scroll events directly
// to avoid layout thrashing and improve scroll animation smoothness.