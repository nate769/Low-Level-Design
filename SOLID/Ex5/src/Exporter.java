/**
 * Base exporter contract.
 *
 * Precondition : req must not be null.
 * Postcondition : returns a non-null ExportResult with a valid contentType and
 * a byte array that faithfully represents the full input.
 *
 * Subtypes must NOT tighten preconditions (e.g. reject valid requests) and
 * must NOT weaken postconditions (e.g. silently corrupt or truncate data).
 */
public abstract class Exporter {

    /** Template method — validates then delegates; not overridable. */
    public final ExportResult export(ExportRequest req) {
        if (req == null)
            throw new IllegalArgumentException("Request cannot be null");
        return doExport(req);
    }

    /** Subclasses implement the actual encoding. req is guaranteed non-null. */
    protected abstract ExportResult doExport(ExportRequest req);
}
