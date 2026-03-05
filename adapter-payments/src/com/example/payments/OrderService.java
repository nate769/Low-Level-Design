package com.example.payments;

import java.util.Map;
import java.util.Objects;

public class OrderService {
    private final Map<String, PaymentGateway> gateways;

    public OrderService(Map<String, PaymentGateway> gateways) {
        Objects.requireNonNull(gateways, "gateways");
        gateways.values().forEach((value) -> Objects.requireNonNull(value, "gateway cannot contain null values"));
        // |-> eliminates worring about null values in the gateway
        this.gateways = Map.copyOf(gateways); // defensive copy & immutable
    }

    // Smell: still switches; your refactor should remove this by ensuring map
    // contains adapters. -> done
    public String charge(String provider, String customerId, int amountCents) {
        if (!gateways.containsKey(provider))
            throw new IllegalArgumentException("unknown provider: " + provider);
        PaymentGateway gw = gateways.get(provider);
        return gw.charge(customerId, amountCents);
    }
}
