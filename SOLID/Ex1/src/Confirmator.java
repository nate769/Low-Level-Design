public class Confirmator {
  Database db;
  StudentRecord record;

  public Confirmator(Database db, StudentRecord record) {
    this.db = db;
    this.record = record;
  }

  public void showStatus() {
    System.out.println("OK: created student " + record.id);
    System.out.println("Saved. Total students: " + db.count());
    System.out.println("CONFIRMATION:");
    System.out.println(record);
  }

}
