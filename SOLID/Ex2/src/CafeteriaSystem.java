import java.util.*;

public class CafeteriaSystem {
    private final Map<String, MenuItem> menu = new LinkedHashMap<>();
    private final List<TaxRule> taxRules;
    private final List<DiscountRule> discountRules;
    private final InvoiceFormatter formatter;
    private final InvoiceStore store;
    private int invoiceSeq = 1000;

    public CafeteriaSystem(List<TaxRule> taxRules,
            List<DiscountRule> discountRules,
            InvoiceFormatter formatter,
            InvoiceStore store) {
        this.taxRules = taxRules;
        this.discountRules = discountRules;
        this.formatter = formatter;
        this.store = store;
    }

    public void addToMenu(MenuItem item) {
        menu.put(item.id, item);
    }

    public void checkout(String customerType, List<OrderLine> lines) {
        String invId = "INV-" + (++invoiceSeq);

        PricingCalculator calc = new PricingCalculator(menu);
        List<SubtotalData> lineItems = calc.computeLines(lines);
        double subtotal = calc.subtotal(lineItems);

        double taxPct = resolveTaxPct(customerType);
        double tax = subtotal * (taxPct / 100.0);
        double discount = resolveDiscount(customerType, subtotal, lines.size());
        double total = subtotal + tax - discount;

        InvoiceData data = new InvoiceData(invId, lineItems, subtotal, taxPct, tax, discount, total);
        String text = formatter.format(data);

        System.out.print(text);
        store.save(invId, text);
        System.out.println("Saved invoice: " + invId + " (lines=" + store.countLines(invId) + ")");
    }

    private double resolveTaxPct(String customerType) {
        for (TaxRule rule : taxRules) {
            if (rule.appliesTo(customerType))
                return rule.taxPercent();
        }
        return 0.0;
    }

    private double resolveDiscount(String customerType, double subtotal, int distinctLines) {
        for (DiscountRule rule : discountRules) {
            if (rule.appliesTo(customerType))
                return rule.discountAmount(subtotal, distinctLines);
        }
        return 0.0;
    }
}
