public interface DiscountRule {
    boolean appliesTo(String customerType);

    double discountAmount(double subtotal, int distinctLines);
}
