import java.util.ArrayList;
import java.util.List;

/**
 * Validates a RegistrationRequest. Returns a list of error messages
 * in a fixed order. Testable without console IO.
 */
public class RegistrationValidator {
    private static final List<String> ALLOWED_PROGRAMS = List.of("CSE", "AI", "SWE");

    public List<String> validate(RegistrationRequest req) {
        List<String> errors = new ArrayList<>();
        if (req.name().isBlank()) errors.add("name is required");
        if (req.email().isBlank() || !req.email().contains("@")) errors.add("email is invalid");
        if (req.phone().isBlank() || !req.phone().chars().allMatch(Character::isDigit)) errors.add("phone is invalid");
        if (!ALLOWED_PROGRAMS.contains(req.program())) errors.add("program is invalid");
        return errors;
    }
}
