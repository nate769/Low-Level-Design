import java.util.List;

public class DisiplinaryFlagRule implements Rule {

    StudentProfile profile;
    List<String> reasons;

    public DisiplinaryFlagRule(StudentProfile profile, List<String> reasons) {
        this.profile = profile;
        this.reasons = reasons;
    }

    @Override
    public boolean check() {
        if(profile.disciplinaryFlag != LegacyFlags.NONE) {
            reasons.add("disciplinary flag present");
            return false;
        }

        return true;
    }
}
