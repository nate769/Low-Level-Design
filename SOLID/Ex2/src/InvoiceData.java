import java.util.List;

public class InvoiceData {
    public final String invoiceId;
    public final List<SubtotalData> lineItems;
    public final double subtotal;
    public final double taxPct;
    public final double tax;
    public final double discount;
    public final double total;

    public InvoiceData(String invoiceId, List<SubtotalData> lineItems,
            double subtotal, double taxPct, double tax,
            double discount, double total) {
        this.invoiceId = invoiceId;
        this.lineItems = lineItems;
        this.subtotal = subtotal;
        this.taxPct = taxPct;
        this.tax = tax;
        this.discount = discount;
        this.total = total;
    }
}
