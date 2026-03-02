import java.util.*;

public class OnboardingService {
    private final Database db;
    private final Parser parser;
    private final OutputService outputService;
    private final Validator validator;

    public OnboardingService(Database db, Parser parser, Validator validator, OutputService outputService) {
        this.db = db;
        this.parser = parser;
        this.validator = validator;
        this.outputService = outputService;
    }

    private String getNextId() {
        return IdUtil.nextStudentId(db.count());
    }

    public void register(String raw) {
        outputService.println("INPUT: " + raw);

        String id = getNextId();

        Map<String, String> kv = parser.parseString(raw);
        List<String> errors = validator.validateStudentRecord(kv);

        if (!errors.isEmpty()) {
            for (String e : errors)
                outputService.println("- " + e);
            return;
        }

        StudentRecord rec = new StudentRecord(id, kv.get("name"), kv.get("email"), kv.get("phone"), kv.get("program"));
        saveToDatabase(rec);
        sendConfirmation(rec);
    }

    public void sendConfirmation(StudentRecord record) {

        outputService.println("OK: created student " + record.id);
        outputService.println("Saved. Total students: " + db.count());
        outputService.println("CONFIRMATION:");
        outputService.println(record);
    }

    public void saveToDatabase(StudentRecord record) {
        db.save(record);
    }
}
