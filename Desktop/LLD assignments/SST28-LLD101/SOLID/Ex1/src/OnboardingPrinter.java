import java.util.List;

/**
 * Handles all console output for the onboarding workflow (Checkpoint E).
 * Keeps formatting separate from business logic; exact output preserved.
 */
public class OnboardingPrinter {

    public void printInput(String raw) {
        System.out.println("INPUT: " + raw);
    }

    public void printValidationErrors(List<String> errors) {
        System.out.println("ERROR: cannot register");
        for (String e : errors) {
            System.out.println("- " + e);
        }
    }

    public void printSuccess(String id, int totalCount, StudentRecord rec) {
        System.out.println("OK: created student " + id);
        System.out.println("Saved. Total students: " + totalCount);
        System.out.println("CONFIRMATION:");
        System.out.println(rec);
    }
}
