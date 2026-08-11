# ROLE

Act as a Senior Frontend Engineer and UI/UX Engineer.

Build the frontend for the existing AI Flashcards Generator application. Inspect the existing codebase first and understand its current structure before making changes.

Do not generate or redesign the backend.

---

# PROJECT CONTEXT

This is an AI flashcard generator application.

Authenticated users can:

1. Enter a topic.
2. Select how many flashcards to generate, from 1–6.
3. Generate flashcards using the existing backend.
4. View their generated/saved flashcards.
5. Delete individual saved flashcards.

The approved application architecture is:

```text
User
  ↓
React Frontend
  ↓
Express Backend
  ├── Clerk authentication
  ├── Groq AI
  └── MongoDB
```

The frontend must integrate with the existing backend APIs:

```text
POST   /generate
GET    /getcards
DELETE /deletecard/:id
```

Authentication is handled by Clerk.

---

# OBJECTIVE

Build a polished, modern React frontend for the flashcard application.

The UI should use the **visual and interaction language of the supplied 21st.dev reference**, while remaining completely specific to this flashcard product.

The result should feel like a refined modern AI productivity/learning application—not a copy of the reference website.

---

# DESIGN DIRECTION

Use the reference component as visual inspiration.

Carry over these principles:

- Clean card-based interface.
- Rounded `xl` surfaces.
- Subtle borders.
- Neutral/semantic Tailwind color system.
- Clear typography hierarchy.
- Spacious but efficient layouts.
- Minimal visual clutter.
- Compact controls.
- Smooth hover and transition states.
- Subtle spring-style motion where it improves usability.
- Responsive card layouts.
- Strong visual hierarchy between primary actions and secondary actions.

Do not blindly reproduce the reference component.

The flashcard itself is the primary visual element of the application.

---

# PAGES

## 1. HOME PAGE

Purpose:

Introduce the flashcard generator and provide authentication entry points.

Include:

- Application name/brand.
- Short description explaining that users can generate AI-powered flashcards from any topic.
- Primary CTA for Sign Up.
- Secondary CTA for Login.
- Clean, minimal hero section.
- A small visual preview of the flashcard experience may be used if useful, but do not invent product functionality.

The page must remain visually simple.

---

## 2. GENERATE FLASHCARDS PAGE

This is a protected page.

Unauthenticated users must not be able to use the generation functionality.

Structure:

```text
Page Header
    ↓
Topic Input
    ↓
Number of Cards Selector (1–6)
    ↓
Generate Button
    ↓
Generated Flashcards
```

### Topic Input

Provide a clear text input or textarea for entering the topic.

Example placeholder:

`What would you like to learn?`

Do not hard-code example content as actual application data.

### Card Count

Provide a compact selector/dropdown containing:

```text
1
2
3
4
5
6
```

Default to a sensible value such as 3 unless the existing application already defines another default.

### Generate Button

Primary visual action.

The button should:

- Clearly communicate generation.
- Become disabled while generation is running.
- Show an appropriate loading state.
- Prevent accidental duplicate submissions.

### Generated Flashcards

Display generated cards using the reference's card-centric visual language.

Each flashcard should clearly distinguish:

```text
Question
────────
Answer
```

Use strong hierarchy and readable spacing.

If appropriate, use subtle motion when cards appear.

Do not make animations interfere with reading or interaction.

---

# 3. MY CARDS PAGE

This is a protected page.

Display the authenticated user's saved flashcards retrieved from:

```text
GET /getcards
```

Use a responsive card layout.

Desktop:

- Multi-column layout where appropriate.

Tablet:

- Reduced number of columns.

Mobile:

- Single-column cards.

Each card should display:

- Question
- Answer
- Delete action

The delete action should be visually secondary to the card content but still easy to find.

Before deleting, use an appropriate confirmation interaction if the existing application does not already provide one.

After successful deletion, update the UI without unnecessarily reloading the entire application.

---

# REUSABLE COMPONENTS

Create reusable components where appropriate.

At minimum consider:

- `Navbar`
- `PageContainer`
- `Button`
- `TopicInput`
- `CardCountSelector`
- `Flashcard`
- `FlashcardGrid`
- `DeleteCardButton`
- `LoadingState`
- `EmptyState`
- `ErrorState`

Do not create abstractions merely for the sake of abstraction.

Reuse existing project components if they already exist.

---

# NAVIGATION

Provide a simple navigation experience appropriate for the application.

Authenticated users should have clear access to:

- Generate
- My Cards
- Authentication/account controls

Unauthenticated users should see:

- Home
- Login
- Sign Up

Use Clerk's existing authentication functionality rather than implementing custom authentication UI logic unless the current project already has a specific pattern.

---

# FLASHCARD INTERACTION

The supplied reference uses a morphing card stack with layout changes and drag interactions.

Do not copy that behavior blindly.

For this application, prioritize:

1. Reading the question and answer easily.
2. Clear distinction between question and answer.
3. Comfortable interaction on mobile.
4. Fast navigation between generated cards.
5. Accessibility.

A stack/swipe presentation may be used for generated cards if it improves the experience, but a standard responsive grid is preferable for the saved "My Cards" collection if that makes browsing easier.

Animations must remain subtle and purposeful.

---

# TYPOGRAPHY

Use a modern sans-serif typography system.

Prioritize:

- Large, clear page headings.
- Medium/semibold card questions.
- Highly readable answer text.
- Smaller muted supporting text.
- Strong contrast between primary and secondary information.

Avoid excessive font sizes or overly dense text.

---

# COLORS

Follow the reference's semantic design approach.

Use roles such as:

- Background
- Foreground
- Card
- Card foreground
- Primary
- Primary foreground
- Secondary
- Muted
- Muted foreground
- Border
- Destructive

Prefer the project's existing Tailwind/shadcn color system if available.

Do not introduce an unrelated color palette.

Destructive styling should be reserved for delete/error actions.

---

# SPACING AND VISUAL DENSITY

Use consistent spacing throughout the application.

Prefer:

- Spacious page-level layouts.
- Comfortable card padding.
- Clear separation between form controls.
- Consistent gaps between cards.
- Responsive container widths.

Avoid excessive empty space that pushes important actions below the fold.

---

# RESPONSIVE BEHAVIOR

The application must work properly across:

### Desktop

- Comfortable centered content area.
- Multi-column flashcard layouts where appropriate.
- Full navigation.

### Tablet

- Reduced grid columns.
- Maintain comfortable card sizes.
- Preserve readable form widths.

### Mobile

- Single-column content.
- Full-width or nearly full-width inputs.
- Touch-friendly controls.
- No horizontal overflow.
- Navigation should collapse/adapt appropriately.
- Flashcards must remain easy to read.

Do not simply shrink the desktop UI.

Adapt layouts intentionally for smaller screens.

---

# API INTEGRATION

Use the existing backend contracts.

### Generate

```text
POST /generate
```

Send the required topic and card count according to the existing backend contract.

On success:

- Display the generated flashcards.
- Reflect the newly generated cards in the UI.
- Do not invent another persistence API.

### Get Cards

```text
GET /getcards
```

Retrieve the authenticated user's saved cards.

Do not request or display another user's cards.

### Delete Card

```text
DELETE /deletecard/:id
```

Delete only the selected card.

After successful deletion:

- Remove the card from the current UI.
- Avoid unnecessary full-page refreshes.

Do not modify these backend endpoints.

---

# AUTHENTICATION

Use Clerk for authentication.

Protected application pages:

```text
/generate
/my-cards
```

Unauthenticated users should be redirected to or prompted to authenticate according to the existing application's routing conventions.

The frontend must obtain authentication credentials through Clerk's supported mechanisms.

Never expose private backend/API secrets in React client code.

Do not implement custom password authentication.

---

# UI STATES

Implement clear states for all important asynchronous operations.

## Generate

Support:

- Idle
- Loading
- Success
- Error
- Invalid/empty topic

## My Cards

Support:

- Loading
- Cards available
- Empty collection
- Fetch error

## Delete

Support:

- Normal
- Deleting
- Success
- Error

The interface should always communicate what is happening.

---

# EMPTY STATE

When the user has no saved cards, show a useful but minimal empty state.

Example concept:

```text
No flashcards yet.

Generate your first set of flashcards to start learning.
```

Provide a clear CTA to the Generate page.

Do not invent additional features.

---

# ERROR HANDLING

Handle API failures gracefully.

Do not expose raw backend errors or stack traces to users.

Display concise, understandable messages.

If Groq generation fails, allow the user to retry.

If deleting a card fails, keep the card visible and communicate that deletion did not succeed.

---

# ACCESSIBILITY

Ensure:

- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus states.
- Appropriate button labels.
- Accessible form labels.
- Sufficient text contrast.
- Delete actions are clearly identifiable.
- Interactive flashcard behavior does not depend exclusively on dragging.
- Loading states are understandable to assistive technologies where appropriate.

Do not use animation as the only way to communicate state.

---

# CODE QUALITY

Before implementing anything:

1. Inspect the existing React project.
2. Identify the current routing setup.
3. Identify existing UI components.
4. Identify existing styling/Tailwind/shadcn configuration.
5. Identify existing Clerk integration.
6. Identify existing API utilities.
7. Reuse existing dependencies and conventions.

Then make focused changes.

Prefer:

- Reusable components.
- Clear component responsibilities.
- Existing project utilities.
- Existing design tokens.
- Minimal dependencies.
- Maintainable React patterns.

Do not rewrite unrelated parts of the application.

---

# DEPENDENCIES

The 21st.dev reference uses:

- `framer-motion`
- `lucide-react`

Use these only if they are appropriate for the existing project.

Do not install them automatically if equivalent functionality already exists.

If animation is implemented, keep it subtle and purposeful.

Use Lucide icons where icons are needed rather than manually creating SVG icons.

---

# DO NOT

- Do not copy the reference website's content.
- Do not copy its branding.
- Do not copy its product concept.
- Do not copy its demo data.
- Do not copy unrelated functionality.
- Do not invent new product features.
- Do not change backend behavior.
- Do not change the approved API architecture.
- Do not change Clerk authentication.
- Do not change MongoDB responsibilities.
- Do not move Groq integration into the frontend.
- Do not expose private API keys or secrets.
- Do not rewrite unrelated existing code.
- Do not introduce another frontend framework.
- Do not add unnecessary dependencies.
- Do not sacrifice usability to imitate the reference.
- Do not make animations excessive.
- Do not make flashcards difficult to read.
- Do not assume the reference component's exact layout is mandatory.

---

# ACCEPTANCE CRITERIA

The implementation is complete when:

1. The application has a polished Home page with Login and Sign Up actions.
2. Generate and My Cards are protected by Clerk authentication.
3. The Generate page allows the user to enter a topic.
4. The user can select between 1 and 6 cards.
5. The frontend calls the existing `/generate` API correctly.
6. Generated flashcards are displayed in a polished, readable card interface.
7. The frontend calls `/getcards` to display the authenticated user's saved cards.
8. Users can delete individual cards through `/deletecard/:id`.
9. Loading, empty, success, and error states are handled.
10. The UI works properly on desktop, tablet, and mobile.
11. The design uses the supplied 21st.dev reference as visual inspiration without copying its product.
12. Existing working functionality is preserved.
13. Backend/API behavior is unchanged.
14. Authentication remains handled by Clerk.
15. No secrets are exposed in client-side code.
16. The implementation uses reusable, maintainable React components.
17. No unnecessary dependencies or unrelated features are introduced.

---

# FINAL VERIFICATION

After implementation:

- Run the existing frontend checks/build.
- Fix TypeScript or lint errors introduced by the changes.
- Verify routing.
- Verify Clerk-protected pages.
- Verify all three API integrations.
- Verify generation loading/error states.
- Verify empty and populated My Cards states.
- Verify deletion behavior.
- Verify responsive layouts.
- Verify keyboard accessibility.
- Verify there is no horizontal overflow on mobile.

Only make changes necessary to satisfy this specification.
