# Checkpoint C — Extract validation

**Done.**

- **Component:** `RegistrationValidator` with `List<String> validate(RegistrationRequest req)`.
- Same rules: name required, email must contain `@`, phone digits only, program in CSE/AI/SWE.
- Same message order and text: "name is required", "email is invalid", "phone is invalid", "program is invalid".
- Validation is testable without console IO (returns list of errors).
- `OnboardingService` now uses the validator instead of inline checks.
