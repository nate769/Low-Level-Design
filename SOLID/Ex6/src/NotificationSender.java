/**
 * Base notification-sender contract.
 *
 * Precondition : n must not be null.
 * Postcondition : the notification is dispatched on the channel (best-effort).
 *
 * Subtypes must NOT tighten preconditions (e.g. require a specific phone
 * format) and must NOT surprise callers with undocumented exceptions.
 * Channel-specific validation belongs in the caller, not in this hierarchy.
 */
public abstract class NotificationSender {
    protected final AuditLog audit;

    protected NotificationSender(AuditLog audit) {
        this.audit = audit;
    }

    /** Template method — validates then delegates; not overridable. */
    public final void send(Notification n) {
        if (n == null)
            throw new IllegalArgumentException("Notification cannot be null");
        doSend(n);
    }

    /** Subclasses implement channel-specific dispatch. n is guaranteed non-null. */
    protected abstract void doSend(Notification n);
}
