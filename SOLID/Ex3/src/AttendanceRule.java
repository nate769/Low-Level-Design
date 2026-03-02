import java.util.List;

public class AttendanceRule implements Rule{
    StudentProfile profile;
    List<String> reasons;
    RuleInput input;

    public AttendanceRule(StudentProfile profile, List<String> reasons, RuleInput input) {
        this.profile = profile;
        this.reasons = reasons;
        this.input = input;
    }

    @Override
    public boolean check() {
        if(profile.attendancePct < input.minAttendance) {
            reasons.add("attendance below " +  input.minAttendance);
            return false;
        }

        return true;
    }

}
