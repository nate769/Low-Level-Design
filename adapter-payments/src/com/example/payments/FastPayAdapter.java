package com.example.payments;

public class FastPayAdapter implements PaymentGateway {
  FastPayClient fastPayClient;

  public FastPayAdapter(FastPayClient fastPayClient) {
    this.fastPayClient = fastPayClient;
  }

  @Override
  public String charge(String customerId, int amountCents) {
    return fastPayClient.payNow(customerId, amountCents);
  }

}
