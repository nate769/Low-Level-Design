public record RegistrationRequest(
        String name,
        String email,
        String phone,
        String program) {
    // record automatically provides constructor and getters
}