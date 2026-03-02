import java.util.*;

public class BookingPricingResolver {
    private static final Map<Integer, PricingComponent> ROOM_PRICING = Map.of(
            LegacyRoomTypes.SINGLE, new RoomPricing(14000.0, 5000.0),
            LegacyRoomTypes.DOUBLE, new RoomPricing(15000.0, 5000.0),
            LegacyRoomTypes.TRIPLE, new RoomPricing(12000.0, 5000.0),
            LegacyRoomTypes.DELUXE, new RoomPricing(16000.0, 5000.0));

    private static final Map<AddOn, PricingComponent> ADDON_PRICING = Map.of(
            AddOn.MESS, new AddOnPricing(1000.0),
            AddOn.LAUNDRY, new AddOnPricing(500.0),
            AddOn.GYM, new AddOnPricing(300.0));

    public static List<PricingComponent> resolve(BookingRequest req) {
        List<PricingComponent> components = new ArrayList<>();
        components.add(ROOM_PRICING.getOrDefault(req.roomType, new RoomPricing(16000.0, 5000.0)));
        for (AddOn addOn : req.addOns) {
            PricingComponent addon = ADDON_PRICING.get(addOn);
            if (addon != null)
                components.add(addon);
        }
        return components;
    }
}
