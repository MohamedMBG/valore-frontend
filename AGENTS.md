<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# 16. FRONTEND DOCUMENTATION & AUDIT RULES (MANDATORY)

For EVERY frontend task, component, page, animation, API integration, state-management logic, UI refactor, optimization, or architectural change, the agent MUST:

* Add meaningful comments inside the code
* Explain complex animations
* Explain scroll logic
* Explain state logic
* Explain performance optimizations
* Explain API/frontend synchronization logic
* Explain responsive behavior decisions
* Explain accessibility decisions when relevant
* Explain rendering strategy decisions (SSR / CSR / lazy loading / dynamic imports)
* Explain why libraries or patterns were chosen

Comments MUST explain:

* WHY the implementation exists
* HOW the interaction works
* IMPORTANT UI/UX decisions
* Animation timing logic
* Non-obvious rendering behavior
* Performance tradeoffs
* Potential edge cases

Example:

```tsx
// Using requestAnimationFrame here instead of scroll events directly
// to avoid layout thrashing and improve scroll animation smoothness.
```

---

# 17. FRONTEND AUDIT FILES & DOCUMENTATION (STRICTLY REQUIRED)

For EVERY significant frontend modification, the agent MUST create or update documentation files inside:

```bash
/docs
```

The documentation is NOT optional.

The purpose is to maintain:

* Project memory
* Architecture traceability
* Easier onboarding
* Faster debugging
* Better collaboration between agents
* Historical understanding of decisions

---

# REQUIRED DOCUMENTATION FORMAT

For every completed task, create a markdown file inside `/docs`.

Naming format:

```bash
/docs/YYYY-MM-DD-task-name.md
```

Example:

```bash
/docs/2026-05-13-navbar-scroll-refactor.md
```

---

# EACH DOCUMENT MUST CONTAIN

## 1. TASK SUMMARY

Explain:

* What was implemented
* What feature/component/page was affected
* Why the change was necessary

---

## 2. PROBLEM

Clearly explain:

* What issue existed before
* UX problem
* Performance problem
* Architectural problem
* API issue
* Animation issue
* Responsiveness issue
* Technical limitation

---

## 3. SOLUTION IMPLEMENTED

Explain in detail:

* What was changed
* New architecture or logic
* State-management changes
* Animation changes
* Rendering changes
* API synchronization strategy
* Performance optimizations

---

## 4. FILES MODIFIED

List ALL modified files.

Example:

```md
## Files Modified

- app/page.tsx
- components/navbar/Navbar.tsx
- lib/scroll/useScrollProgress.ts
- styles/navbar.css
```

---

## 5. IMPORTANT TECHNICAL DECISIONS

Document:

* Why this approach was chosen
* Alternatives considered
* Tradeoffs
* Limitations
* Future scalability considerations

---

## 6. PERFORMANCE IMPACT

Explain:

* Re-render reduction
* Lazy loading
* Bundle optimization
* Animation optimization
* Memory usage improvements
* Network optimization

If no performance impact:

```md
No significant performance impact.
```

---

## 7. UI/UX IMPACT

Explain:

* Visual improvements
* Interaction improvements
* Mobile behavior improvements
* Accessibility improvements
* Animation experience improvements

---

## 8. KNOWN LIMITATIONS

Document:

* Remaining issues
* Technical debt
* Temporary solutions
* Future improvements needed

---

## 9. TESTING & VALIDATION

Document:

* Devices tested
* Screen sizes tested
* Browser testing
* Animation testing
* API testing
* Edge cases tested

---

## 10. BEFORE / AFTER BEHAVIOR

Explain:

* Previous behavior
* New behavior
* User-visible changes

---

# 18. DOCUMENTATION QUALITY RULES

The agent MUST NOT:

* Create empty documentation
* Write vague summaries
* Skip technical explanations
* Skip reasoning behind decisions
* Skip limitations
* Skip modified files

The agent MUST:

* Write clear engineering explanations
* Write maintainable documentation
* Write documentation understandable by future developers
* Treat `/docs` as an engineering audit trail

---

# 19. FRONTEND ENGINEERING PRINCIPLES

The agent should prioritize:

* Maintainability
* Scalability
* Performance
* Clean architecture
* Reusable components
* Minimal re-renders
* Animation smoothness
* Accessibility
* Mobile-first responsiveness
* Production-ready code quality

The agent MUST avoid:

* Unnecessary abstractions
* Overengineering
* Massive components
* Unoptimized animations
* Unnecessary client-side rendering
* Duplicate logic
* Dead code
* Magic numbers without explanation

---

# 20. ANIMATION & SCROLLING RULES

For advanced animations:

* Explain timing logic
* Explain interpolation logic
* Explain scroll synchronization
* Explain smoothing strategies
* Explain GPU optimization decisions
* Explain why a specific animation library was chosen

For scroll-based experiences:

* Prefer performant patterns
* Avoid excessive layout recalculations
* Use RAF-based updates when necessary
* Avoid blocking the main thread
* Document animation lifecycle behavior

---

# 21. API & STATE MANAGEMENT RULES

For every API integration:

* Document endpoint usage
* Document caching decisions
* Document loading/error strategies
* Document optimistic updates if used
* Document retry/fallback behavior

For every state-management change:

* Explain state ownership
* Explain state flow
* Explain re-render prevention strategies
* Explain synchronization logic

---

# 22. FINAL MANDATORY RULE

NO frontend implementation is considered complete unless:

* The code is documented
* The logic is commented
* The `/docs` audit file is created
* The reasoning behind changes is explained
* The implementation is maintainable by another engineer
