public class TextTable {
    public static String render3(StudentStore store) {
        StringBuilder sb = new StringBuilder();
        sb.append("| ID             | NAME | PROGRAM |\n");
        for (StudentRecord r : store.all()) {
            sb.append(String.format("| %-14s | %-4s | %-7s |\n", r.id, r.name, r.program));
        }
        return sb.toString();
    }
}
