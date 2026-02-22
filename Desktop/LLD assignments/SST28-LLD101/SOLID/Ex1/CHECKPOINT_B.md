# Checkpoint B — Extract parsing

**Status:** Already done.

- **Input:** Raw string (e.g. `name=Riya;email=riya@sst.edu;...`).
- **Output:** `RegistrationRequest` (name, email, phone, program).
- **Class:** `InputParser.parse(String raw)` returns `RegistrationRequest`. Missing keys yield empty strings.
- Behavior is unchanged; `OnboardingService` already uses the parser.
