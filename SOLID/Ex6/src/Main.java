public class Main {
    public static void main(String[] args) {
        System.out.println("=== Notification Demo ===");
        AuditLog audit = new AuditLog();

        Notification n = new Notification("Welcome", "Hello and welcome to SST!", "riya@sst.edu", "9876543210");

        NotificationSender email = new EmailSender(audit);
        NotificationSender sms = new SmsSender(audit);
        NotificationSender wa = new WhatsAppSender(audit);

        email.send(n);
        sms.send(n);

        // E.164 validation is the caller's responsibility — it does NOT belong
        // inside the sender hierarchy (that would tighten the base precondition
        // and break LSP). We validate here and handle the failure explicitly.
        try {
            if (n.phone == null || !n.phone.startsWith("+"))
                throw new IllegalArgumentException("phone must start with + and country code");
            wa.send(n);
        } catch (RuntimeException ex) {
            System.out.println("WA ERROR: " + ex.getMessage());
            audit.add("WA failed");
        }

        System.out.println("AUDIT entries=" + audit.size());
    }
}
