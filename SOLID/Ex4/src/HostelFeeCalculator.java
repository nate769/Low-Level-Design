import java.util.List;

public class HostelFeeCalculator {
    public FeeResult calculate(List<PricingComponent> components) {
        Money monthly = Money.ZERO;
        Money deposit = Money.ZERO;
        for (PricingComponent c : components) {
            monthly = monthly.plus(c.monthlyContribution());
            deposit = deposit.plus(c.depositContribution());
        }
        return new FeeResult(monthly, deposit);
    }
}
