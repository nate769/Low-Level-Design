import java.util.List;

public interface Database {
     void save(StudentRecord r);
     int count();
     List<StudentRecord> all();
}
