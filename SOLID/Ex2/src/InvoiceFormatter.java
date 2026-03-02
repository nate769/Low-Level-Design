public class InvoiceFormatter {

    public String format(InvoiceData d) {
        StringBuilder sb = new StringBuilder();
        sb.append("Invoice# ").append(d.invoiceId).append("\n");
        for (SubtotalData s : d.lineItems) {
            sb.append(String.format("- %s x%d = %.2f\n", s.item.name, s.qty, s.lineTotal));
        }
        sb.append(String.format("Subtotal: %.2f\n", d.subtotal));
        sb.append(String.format("Tax(%.0f%%): %.2f\n", d.taxPct, d.tax));
        sb.append(String.format("Discount: -%.2f\n", d.discount));
        sb.append(String.format("TOTAL: %.2f\n", d.total));
        return sb.toString();
    }
}
