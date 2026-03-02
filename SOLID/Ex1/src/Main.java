
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Student Onboarding ===");
        FakeDb db = new FakeDb();
        Parser parser = new Parser();
        Validator validator = new Validator();
        ConsoleOutput consoleOutput = new ConsoleOutput();
        OnboardingService svc = new OnboardingService(db, parser, validator, consoleOutput);

        String raw = "name=Riya;email=riya@sst.edu;phone=9876543210;program=CSE";

        svc.register(raw);
        svc.register(raw);

        consoleOutput.println();
        consoleOutput.println("-- DB DUMP --");
        consoleOutput.print(TextTable.render3(db));
    }
}
