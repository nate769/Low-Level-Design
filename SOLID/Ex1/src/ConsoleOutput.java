public class ConsoleOutput implements OutputService {

  public void println(Object s) {
    System.out.println(s.toString());
  }

  public void print(Object s) {
    System.out.print(s.toString());
  }

  public void println() {
    System.out.println();
  }
}
