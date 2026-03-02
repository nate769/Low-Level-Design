import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Hostel Fee Calculator ===");
        BookingRequest req = new BookingRequest(LegacyRoomTypes.DOUBLE, List.of(AddOn.LAUNDRY, AddOn.MESS));

        List<PricingComponent> components = BookingPricingResolver.resolve(req);
        FeeResult fee = new HostelFeeCalculator().calculate(components);

        ReceiptPrinter.print(req, fee.monthly, fee.deposit);

        String bookingId = "H-" + (7000 + new Random(1).nextInt(1000));
        new FakeBookingRepo().save(bookingId, req, fee.monthly, fee.deposit);
    }
}
