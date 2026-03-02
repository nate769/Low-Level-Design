/**
 * WhatsApp sender extends NotificationSender directly.
 *
 * PhoneNotificationSender was removed because its doSend() added an E.164
 * precondition not present in the base contract, which breaks LSP — callers
 * holding a NotificationSender reference would get surprise exceptions.
 *
 * Channel-specific validation (E.164 check) is the caller's responsibility.
 */
public class WhatsAppSender extends NotificationSender {
    public WhatsAppSender(AuditLog audit) {
        super(audit);
    }

    @Override
    protected void doSend(Notification n) {
        System.out.println("WA -> to=" + n.phone + " body=" + n.body);
        audit.add("wa sent");
    }
}
