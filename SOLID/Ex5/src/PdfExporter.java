import java.nio.charset.StandardCharsets;

/**
 * PdfExporter is intentionally NOT a subclass of Exporter.
 *
 * It has a hard limit of 20 characters per body, which is a tighter
 * precondition than Exporter's contract allows. Forcing it into the Exporter
 * hierarchy would break LSP — callers that hold an Exporter reference would
 * get surprise exceptions for content that the base says is valid.
 *
 * Instead it is a standalone class with its own explicit contract:
 * Precondition: req must not be null; req.body must be ≤ 20 characters.
 */
public class PdfExporter {

    private static final int MAX_BODY = 20;

    public ExportResult export(ExportRequest req) {
        if (req == null)
            throw new IllegalArgumentException("Request cannot be null");
        if (req.body != null && req.body.length() > MAX_BODY)
            throw new IllegalArgumentException(
                    "PDF cannot handle content > " + MAX_BODY + " chars");
        String fakePdf = "PDF(" + req.title + "):" + req.body;
        return new ExportResult("application/pdf", fakePdf.getBytes(StandardCharsets.UTF_8));
    }
}
