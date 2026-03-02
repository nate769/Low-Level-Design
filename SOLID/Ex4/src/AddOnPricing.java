public class AddOnPricing implements PricingComponent {
    private final Money monthly;

    public AddOnPricing(double monthly) {
        this.monthly = new Money(monthly);
    }

    @Override
    public Money monthlyContribution() {
        return monthly;
    }

    @Override
    public Money depositContribution() {
        return Money.ZERO;
    }
}
