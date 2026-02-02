/**
 * Centralized service for application error logging.
 */
const errorService = {
    logError: (error, context = {}) => {
        // In production, this would send to Sentry, CloudWatch, or a custom logging endpoint.
        const errorDetails = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
        };

        if (import.meta.env.DEV) {
            console.error('[ErrorService] Caught error:', errorDetails);
        } else {
            // Logic for production error reporting goes here
            // Example: reportToSentry(errorDetails);
        }
    },

    logWarning: (message, context = {}) => {
        if (import.meta.env.DEV) {
            console.warn(`[ErrorService] Warning: ${message}`, context);
        }
    }
};

export default errorService;
