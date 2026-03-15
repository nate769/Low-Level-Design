package com.example.tickets;

import java.util.ArrayList;
import java.util.List;

/**
 * INTENTION: A ticket should be an immutable record-like object.
 *
 * CURRENT STATE (BROKEN ON PURPOSE):
 * - mutable fields
 * - multiple constructors
 * - public setters
 * - tags list can be modified from outside
 * - validation is scattered elsewhere
 *
 */
public class IncidentTicket {

    private final String id;
    private final String reporterEmail;
    private final String title;

    private final String description;
    private final String priority; // LOW, MEDIUM, HIGH, CRITICAL
    private final List<String> tags; // mutable leak
    private final String assigneeEmail;
    private final boolean customerVisible;
    private final Integer slaMinutes; // optional
    private final String source; // e.g. "CLI", "WEBHOOK", "EMAIL"

    private IncidentTicket(IncidentTicketBuilder builder) {
        this.id = builder.id;
        this.reporterEmail = builder.reporterEmail;
        this.title = builder.title;
        this.description = builder.description;
        this.priority = builder.priority;
        this.tags = List.copyOf(builder.tags);
        this.assigneeEmail = builder.assigneeEmail;
        this.customerVisible = builder.customerVisible;
        this.slaMinutes = builder.slaMinutes;
        this.source = builder.source;
    }

    public IncidentTicketBuilder toBuilder() {
        return new IncidentTicketBuilder(this.id, this.reporterEmail, this.title)
                .setDescription(this.description)
                .setPriority(this.priority)
                .setTags(this.tags)
                .setAssigneeEmail(this.assigneeEmail)
                .setCustomerVisible(this.customerVisible)
                .setSlaMinutes(this.slaMinutes)
                .setSource(this.source);
    }

    static class IncidentTicketBuilder {

        private String id;
        private String reporterEmail;
        private String title;

        private String description;
        private String priority;
        private List<String> tags;
        private String assigneeEmail;
        private boolean customerVisible;
        private Integer slaMinutes;
        private String source;

        public IncidentTicketBuilder(String id, String reporterEmail, String title) {
            this.id = id;
            this.reporterEmail = reporterEmail;
            this.title = title;
        }

        public IncidentTicket build() { // build method to call parent and return obj

            // Validations...
            Validation.requireTicketId(id);

            // Email Validation
            if (this.reporterEmail != null)
                Validation.requireEmail(reporterEmail, "reporterEmail");
            if (this.assigneeEmail != null)
                Validation.requireEmail(assigneeEmail, "assigneeEmail");

            // Title validation
            Validation.requireNonBlank(title, "title");
            Validation.requireMaxLen(title, 80, "title");

            // Priority validaion
            if (priority != null)
                Validation.requireOneOf(this.priority, "priority", "LOW", "MEDIUM", "HIGH", "CRITICAL");

            // slaMinutes validation
            if (this.slaMinutes != null)
                Validation.requireRange(slaMinutes, 5, 200, "slaMinutes");

            return new IncidentTicket(this);
        }

        public static IncidentTicketBuilder copyOf(IncidentTicket ticket) {
            return new IncidentTicketBuilder(ticket.id, ticket.reporterEmail, ticket.title)
                    .setDescription(ticket.description)
                    .setPriority(ticket.priority)
                    .setTags(ticket.tags)
                    .setAssigneeEmail(ticket.assigneeEmail)
                    .setCustomerVisible(ticket.customerVisible)
                    .setSlaMinutes(ticket.slaMinutes)
                    .setSource(ticket.source);
        }

        // getters and setters...

        public IncidentTicketBuilder setId(String id) {
            this.id = id;
            return this;
        }

        public IncidentTicketBuilder setReporterEmail(String reporterEmail) {
            this.reporterEmail = reporterEmail;
            return this;
        }

        public IncidentTicketBuilder setTitle(String title) {
            this.title = title;
            return this;
        }

        public IncidentTicketBuilder setDescription(String description) {
            this.description = description;
            return this;
        }

        public IncidentTicketBuilder setPriority(String priority) {
            this.priority = priority;
            return this;
        }

        public IncidentTicketBuilder setTags(List<String> tags) {
            this.tags = tags;
            return this;
        }

        public IncidentTicketBuilder setAssigneeEmail(String assigneeEmail) {
            this.assigneeEmail = assigneeEmail;
            return this;
        }

        public IncidentTicketBuilder setCustomerVisible(boolean customerVisible) {
            this.customerVisible = customerVisible;
            return this;
        }

        public IncidentTicketBuilder setSlaMinutes(Integer slaMinutes) {
            this.slaMinutes = slaMinutes;
            return this;
        }

        public IncidentTicketBuilder setSource(String source) {
            this.source = source;
            return this;
        }

        public String getId() {
            return id;
        }

        public String getReporterEmail() {
            return reporterEmail;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }

        public String getPriority() {
            return priority;
        }

        public List<String> getTags() {
            return tags;
        }

        public String getAssigneeEmail() {
            return assigneeEmail;
        }

        public boolean isCustomerVisible() {
            return customerVisible;
        }

        public Integer getSlaMinutes() {
            return slaMinutes;
        }

        public String getSource() {
            return source;
        }

    }

    // Getters
    public String getId() {
        return id;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getPriority() {
        return priority;
    }

    public List<String> getTags() {
        return new ArrayList<>(tags);
    }

    public String getAssigneeEmail() {
        return assigneeEmail;
    }

    public boolean isCustomerVisible() {
        return customerVisible;
    }

    public Integer getSlaMinutes() {
        return slaMinutes;
    }

    public String getSource() {
        return source;
    }

    @Override
    public String toString() {
        return "IncidentTicket{" +
                "id='" + id + '\'' +
                ", reporterEmail='" + reporterEmail + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", priority='" + priority + '\'' +
                ", tags=" + tags +
                ", assigneeEmail='" + assigneeEmail + '\'' +
                ", customerVisible=" + customerVisible +
                ", slaMinutes=" + slaMinutes +
                ", source='" + source + '\'' +
                '}';
    }
}
