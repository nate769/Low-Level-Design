import java.util.List;

public class CgrRule implements Rule{
    StudentProfile profile;
    List<String> reasons;
    RuleInput input;

    public CgrRule(StudentProfile profile, List<String> reasons, RuleInput input) {
        this.profile = profile;
        this.reasons = reasons;
        this.input = input;
    }

    @Override
    public boolean check() {
        if(profile.cgr < input.minCgr) {
            reasons.add("CGR below " + input.minCgr);
            return false;
        }

        return true;
    }
}
