import java.util.*;

public class EligibilityEngine {
    private final FakeEligibilityStore store;

    public EligibilityEngine(FakeEligibilityStore store) { this.store = store; }

    public void runAndPrint(StudentProfile s) {
        ReportPrinter p = new ReportPrinter();
        EligibilityEngineResult r = evaluate(s); // giant conditional inside
        p.print(s, r);
        store.save(s.rollNo, r.status);
    }

    public EligibilityEngineResult evaluate(StudentProfile s) {
        RuleInput input = new RuleInput();
        List<String> reasons = new ArrayList<>();
        List<Rule> rules = List.of(
                new DisiplinaryFlagRule(s, reasons),
                new CgrRule(s, reasons, input),
                new AttendanceRule(s, reasons, input),
                new CreditRule(s, reasons, input)

        );

        boolean status = true;

        for (Rule r : rules) {
            status = status & r.check();
        }

        return new EligibilityEngineResult(status ? "ELIGIBLE" : "NOT_ELIGIBLE", reasons);
    }
}

