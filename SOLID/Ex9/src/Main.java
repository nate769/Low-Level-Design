public class Main {
    public static void main(String[] args) {
        System.out.println("=== Evaluation Pipeline ===");
        Submission sub = new Submission("23BCS1007", "public class A{}", "A.java");

        Rubric r = new Rubric();
        Grader grader = new CodeGrader();
        Writer writer = new ReportWriter();
        PlagiarismChecker pc = new PlagiarismChecker();

        new EvaluationPipeline(r, pc, grader, writer).evaluate(sub);
    }
}
