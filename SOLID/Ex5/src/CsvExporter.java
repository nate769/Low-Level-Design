import java.nio.charset.StandardCharsets;

public class CsvExporter extends Exporter {
    @Override
    protected ExportResult doExport(ExportRequest req) {
        // Properly quote fields so commas and newlines inside values are preserved,
        // not stripped — honor the base-class postcondition of faithful output.
        String csv = "title,body\n" + csvField(req.title) + "," + csvField(req.body) + "\n";
        return new ExportResult("text/csv", csv.getBytes(StandardCharsets.UTF_8));
    }

    /** Wraps a field in double-quotes if it contains a comma, newline, or quote. */
    private String csvField(String value) {
        if (value == null)
            return "";
        if (value.contains(",") || value.contains("\n") || value.contains("\""))
            return "\"" + value.replace("\"", "\"\"") + "\"";
        return value;
    }
}
