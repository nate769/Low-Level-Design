import java.util.*;

public class OnboardingService {
    private final StudentStore store;
    private final OnboardingPrinter printer;

    public OnboardingService(StudentStore store, OnboardingPrinter printer) {
        this.store = store;
        this.printer = printer;
    }

    public void registerFromRawInput(String raw) {
        printer.printInput(raw);

        InputParser parser = new InputParser();
        RegistrationRequest req = parser.parse(raw);

        RegistrationValidator validator = new RegistrationValidator();
        List<String> errors = validator.validate(req);

        if (!errors.isEmpty()) {
            printer.printValidationErrors(errors);
            return;
        }

        String id = IdUtil.nextStudentId(store.count());
        StudentRecord rec = new StudentRecord(id, req.name(), req.email(), req.phone(), req.program());
        store.save(rec);

        printer.printSuccess(id, store.count(), rec);
    }
}
