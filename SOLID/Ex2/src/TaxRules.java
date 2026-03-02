import java.util.Arrays;
import java.util.List;

public class TaxRules {

    public static List<TaxRule> defaultRules() {
        return Arrays.asList(
                new TaxRule() {
                    public boolean appliesTo(String t) {
                        return "student".equalsIgnoreCase(t);
                    }

                    public double taxPercent() {
                        return 5.0;
                    }
                },
                new TaxRule() {
                    public boolean appliesTo(String t) {
                        return "staff".equalsIgnoreCase(t);
                    }

                    public double taxPercent() {
                        return 2.0;
                    }
                },
                new TaxRule() { // default / fallback
                    public boolean appliesTo(String t) {
                        return true;
                    }

                    public double taxPercent() {
                        return 8.0;
                    }
                });
    }
}
