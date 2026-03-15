package com.example.tickets;

import java.util.ArrayList;
import java.util.List;

/**
 * Service layer that creates tickets.
 *
 * CURRENT STATE (BROKEN ON PURPOSE):
 * - creates partially valid objects
 * - mutates after creation (bad for auditability)
 * - validation is scattered & incomplete
 *
 * - After introducing immutable IncidentTicket + Builder, refactor this to stop
 * mutating.
 */
public class TicketService {

    public IncidentTicket createTicket(String id, String reporterEmail, String title) {
        // scattered validation (incomplete on purpose)
        if (id == null || id.trim().isEmpty())
            throw new IllegalArgumentException("id required");
        if (reporterEmail == null || !reporterEmail.contains("@"))
            throw new IllegalArgumentException("email invalid");
        if (title == null || title.trim().isEmpty())
            throw new IllegalArgumentException("title required");

        List<String> tags = new ArrayList<>();
        tags.add("NEW");

        return new IncidentTicket.IncidentTicketBuilder(id, reporterEmail, title)
                .setPriority("MEDIUM")
                .setSource("CLI")
                .setCustomerVisible(false)
                .setTags(tags)
                .build();

    }

    public IncidentTicket escalateToCritical(IncidentTicket t) {
        List<String> tags = t.getTags();
        tags.add("ESCALATED");
        return t.toBuilder()
                .setPriority("CRITICAL")
                .setTags(tags)
                .build();
    }

    public IncidentTicket assign(IncidentTicket t, String assigneeEmail) {
        // scattered validation
        if (assigneeEmail != null && !assigneeEmail.contains("@")) {
            throw new IllegalArgumentException("assigneeEmail invalid");
        }

        return t.toBuilder()
                .setAssigneeEmail(assigneeEmail)
                .build();

    }
}
