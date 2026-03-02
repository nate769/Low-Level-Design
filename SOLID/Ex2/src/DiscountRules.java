import java.util.Arrays;
import java.util.List;

public class DiscountRules {

    public static List<DiscountRule> defaultRules() {
        return Arrays.asList(
                new DiscountRule() {
                    public boolean appliesTo(String t) {
                        return "student".equalsIgnoreCase(t);
                    }

                    public double discountAmount(double subtotal, int distinctLines) {
                        return subtotal >= 180.0 ? 10.0 : 0.0;
                    }
                },
                new DiscountRule() {
                    public boolean appliesTo(String t) {
                        return "staff".equalsIgnoreCase(t);
                    }

                    public double discountAmount(double subtotal, int distinctLines) {
                        return distinctLines >= 3 ? 15.0 : 5.0;
                    }
                },
                new DiscountRule() { // default / no discount
                    public boolean appliesTo(String t) {
                        return true;
                    }

                    public double discountAmount(double subtotal, int distinctLines) {
                        return 0.0;
                    }
                });
    }
}
