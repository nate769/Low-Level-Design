public class SmsSender extends NotificationSender {
    public SmsSender(AuditLog audit) {
        super(audit);
    }

    @Override
    protected void doSend(Notification n) {
        // SMS has no subject field; this is a channel constraint, not an LSP
        // violation — base contract never promised subject would be forwarded.
        System.out.println("SMS -> to=" + n.phone + " body=" + n.body);
        audit.add("sms sent");
    }
}
