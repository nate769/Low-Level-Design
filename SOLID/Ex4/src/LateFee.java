public class LateFee implements PricingComponent {

  @Override
  public Money monthlyContribution() {
    return new Money(200);
  }

  @Override
  public Money depositContribution() {
    return Money.ZERO;
  }

}
