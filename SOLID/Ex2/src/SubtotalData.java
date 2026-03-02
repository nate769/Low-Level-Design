public class SubtotalData {
  public final MenuItem item;
  public final int qty;
  public final double lineTotal;

  public SubtotalData(MenuItem item, int qty, double lineTotal) {
    this.item = item;
    this.qty = qty;
    this.lineTotal = lineTotal;
  }
}
