# Checkpoint D — Decouple persistence

**Done.**

- **Interface:** `StudentStore` with `save(StudentRecord r)`, `count()`, `all()`.
- **Implementation:** `FakeDb` implements `StudentStore` (unchanged behavior).
- **OnboardingService** now depends on `StudentStore`, not `FakeDb` — no direct knowledge of the concrete DB.
- **Main** uses `StudentStore store = new FakeDb();` and passes `store` to the service and to `TextTable.render3(store)`.
- **TextTable.render3** now accepts `StudentStore` so the DB dump works with any store implementation.
