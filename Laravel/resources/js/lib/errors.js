export class ApiError extends Error {
    constructor(
        message,
        {
            status = null,
            errors = {},
            originalError = null,
            exception = null,
            file = null,
            line = null,
            trace = null,
        } = {},
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
        this.originalError = originalError;

        // Laravel debug information
        this.exception = exception;
        this.file = file;
        this.line = line;
        this.trace = trace;
    }
}