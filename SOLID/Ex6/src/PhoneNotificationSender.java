public abstract class PhoneNotificationSender extends NotificationSender {
    protected PhoneNotificationSender(AuditLog audit) {
        super(audit);
    }

    // contract: phone must be E.164 (start with +)
    @Override
    public void doSend(Notification n) {
        if (n.phone == null || !n.phone.startsWith("+"))
            throw new IllegalArgumentException("phone must start with + and country code");

        doPhoneSend(n);
    }

    public abstract void doPhoneSend(Notification n);
}
