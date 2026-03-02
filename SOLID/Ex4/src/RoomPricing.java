public class RoomPricing implements PricingComponent {
    private final Money monthly;
    private final Money deposit;

    public RoomPricing(double monthly, double deposit) {
        this.monthly = new Money(monthly);
        this.deposit = new Money(deposit);
    }

    @Override
    public Money monthlyContribution() {
        return monthly;
    }

    @Override
    public Money depositContribution() {
        return deposit;
    }
}
