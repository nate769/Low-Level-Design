# Checkpoint A — Run & identify responsibilities

## Captured output (matches README sample)
```
=== Student Onboarding ===
INPUT: name=Riya;email=riya@sst.edu;phone=9876543210;program=CSE
OK: created student SST-2026-0001
Saved. Total students: 1
CONFIRMATION:
StudentRecord{id='SST-2026-0001', name='Riya', email='riya@sst.edu', phone='9876543210', program='CSE'}

-- DB DUMP --
| ID             | NAME | PROGRAM |
| SST-2026-0001  | Riya | CSE     |
```

## Responsibilities inside `OnboardingService.registerFromRawInput`

1. **Echo input** — Print the raw input line (`INPUT: ...`).
2. **Parsing** — Convert raw string to structured data (already delegated to `InputParser` → `RegistrationRequest`).
3. **Validation** — Check name, email, phone, program; build list of error messages in order.
4. **Error reporting** — Print validation errors (`ERROR: cannot register`, then each `- <message>`).
5. **ID generation** — Call `IdUtil.nextStudentId(db.count())`.
6. **Record creation** — Build `StudentRecord` from validated data and new ID.
7. **Persistence** — Save record via `db.save(rec)`.
8. **Success output** — Print OK line, "Saved. Total students: N", CONFIRMATION header, and record toString.

So the method mixes: **IO/printing**, **parsing** (delegated), **validation**, **business rules** (allowed programs), **ID generation**, **persistence**, and **formatting**.
