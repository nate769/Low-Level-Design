public class TransportBookingService {

    IDistanceCalculator dist;
    IDriverAllocator alloc;
    IPaymentGateway pay;

    public TransportBookingService(IDistanceCalculator dist, IDriverAllocator alloc, IPaymentGateway pay) {
        this.dist = dist;
        this.alloc = alloc;
        this.pay = pay;
    }

    public void book(TripRequest req) {

        double km = dist.km(req.from, req.to);
        System.out.println("DistanceKm=" + km);

        String driver = alloc.allocate(req.studentId);
        System.out.println("Driver=" + driver);

        double fare = getFare(km);

        String txn = pay.charge(req.studentId, fare);
        System.out.println("Payment=PAID txn=" + txn);

        BookingReceipt r = new BookingReceipt("R-501", fare);
        System.out.println("RECEIPT: " + r.id + " | fare=" + String.format("%.2f", r.fare));
    }

    public double getFare(double km) {
        double fare = Fares.BASE_FARE + km * Fares.PER_KM_RATE;
        return Math.round(fare * 100.0) / 100.0;
    }
}
