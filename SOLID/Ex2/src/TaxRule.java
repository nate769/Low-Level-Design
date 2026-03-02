public interface TaxRule {
    boolean appliesTo(String customerType);

    double taxPercent();
}
