import java.util.*;

public class Main {
        public static void main(String[] args) {
                System.out.println("=== Cafeteria Billing ===");

                CafeteriaSystem sys = new CafeteriaSystem(
                                TaxRules.defaultRules(),
                                DiscountRules.defaultRules(),
                                new InvoiceFormatter(),
                                new FileStore());

                sys.addToMenu(new MenuItem("M1", "Veg Thali", 80.00));
                sys.addToMenu(new MenuItem("C1", "Coffee", 30.00));
                sys.addToMenu(new MenuItem("S1", "Sandwich", 60.00));

                List<OrderLine> studentOrder = List.of(
                                new OrderLine("M1", 2),
                                new OrderLine("C1", 1));
                sys.checkout("student", studentOrder);

                System.out.println();
                List<OrderLine> staffOrder = List.of(
                                new OrderLine("M1", 1),
                                new OrderLine("C1", 2),
                                new OrderLine("S1", 1));
                sys.checkout("staff", staffOrder);
        }
}
