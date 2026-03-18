package com.example.reports;

/**
 * Implement Proxy responsibilities here:
 * - access check -> DONE
 * - lazy loading -> DONE
 * - caching of RealReport within the same proxy -> DONE RealReport also caches
 * the read string...
 */

public class ReportProxy implements Report {

    private final String reportId;
    private final String title;
    private final String classification;
    private final AccessControl accessControl = new AccessControl();
    private RealReport realReport = null; // null until first authorized access

    public ReportProxy(String reportId, String title, String classification) {
        this.reportId = reportId;
        this.title = title;
        this.classification = classification;
    }

    @Override
    public void display(User user) {
        if (!accessControl.canAccess(user, classification)) {
            System.out.println("[proxy] ACCESS DENIED: " + user.getName()
                    + " cannot view " + classification + " report " + reportId);
            return;
        }

        if (realReport == null) {
            System.out.println("[proxy] lazy-loading report " + reportId + " for first time");
            realReport = new RealReport(reportId, title, classification);
        } else {
            System.out.println("[proxy] serving cached report " + reportId);
        }

        realReport.display(user);
    }
}