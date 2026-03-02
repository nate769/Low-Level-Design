import java.util.*;

public class PricingCalculator {
    private final Map<String, MenuItem> menu;

    public PricingCalculator(Map<String, MenuItem> menu) {
        this.menu = menu;
    }

    public List<SubtotalData> computeLines(List<OrderLine> lines) {
        List<SubtotalData> result = new ArrayList<>();
        for (OrderLine l : lines) {
            MenuItem item = menu.get(l.itemId);
            double lineTotal = item.price * l.qty;
            result.add(new SubtotalData(item, l.qty, lineTotal));
        }
        return result;
    }

    public double subtotal(List<SubtotalData> lineItems) {
        double sum = 0.0;
        for (SubtotalData s : lineItems)
            sum += s.lineTotal;
        return sum;
    }
}
