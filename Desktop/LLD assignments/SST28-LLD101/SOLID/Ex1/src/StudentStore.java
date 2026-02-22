import java.util.List;

/**
 * Interface for persisting and querying student records.
 * Decouples onboarding from a specific storage implementation (Checkpoint D).
 */
public interface StudentStore {
    void save(StudentRecord r);
    int count();
    List<StudentRecord> all();
}
