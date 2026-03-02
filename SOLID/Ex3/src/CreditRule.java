import java.util.List;

public class CreditRule implements Rule {
    StudentProfile profile;
    List<String> reasons;
    RuleInput input;

    public CreditRule(StudentProfile profile, List<String> reasons, RuleInput input) {
        this.profile = profile;
        this.reasons = reasons;
        this.input = input;
    }

    @Override
    public boolean check() {
        if(profile.earnedCredits < input.minCredits) {
            reasons.add("credits below " + input.minCredits);
            return false;
        }

        return true;
    }
}
