public class EmailSender extends NotificationSender {
    public EmailSender(AuditLog audit) {
        super(audit);
    }

    @Override
    protected void doSend(Notification n) {
        // Silent truncation was removed: it violated the postcondition by
        // changing meaning without the caller's knowledge. If a body-length
        // limit is a real requirement, enforce it in the caller or wrap it in
        // a dedicated validator before dispatching.
        System.out.println("EMAIL -> to=" + n.email + " subject=" + n.subject + " body=" + n.body);
        audit.add("email sent");
    }
}
