# Checkpoint E — Extract printing/formatting

**Done.**

- **Component:** `OnboardingPrinter` with:
  - `printInput(String raw)` — echoes "INPUT: " + raw
  - `printValidationErrors(List<String> errors)` — "ERROR: cannot register" then "- " + each message
  - `printSuccess(String id, int totalCount, StudentRecord rec)` — OK line, Saved line, CONFIRMATION block
- **OnboardingService** no longer uses `System.out`; it delegates all output to the printer (injected via constructor).
- Console output is unchanged.
- Acceptance: "OnboardingService no longer directly formats output" ✓
