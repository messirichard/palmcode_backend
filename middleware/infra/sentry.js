const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const errorTypes = require('../errorHandler/errorType');
const {
    SENTRY_DSN: dsn,
    SENTRY_TRACE_SAMP_RATE: traceSampRate,
} = process.env;

module.exports = {
    BeginMiddlewareSentry: (app) => {
        Sentry.init({
            dsn: dsn || null,
            integrations: [
                new Sentry.Integrations.Http({
                    tracing: true
                }),
                new Tracing.Integrations.Express({
                    app
                }),
            ],
            tracesSampleRate: parseFloat(traceSampRate) || 1.0,
        });
        app.use(Sentry.Handlers.requestHandler());
        app.use(Sentry.Handlers.tracingHandler());
    },
    EndMiddlewareSentry: (app) => {
        app.use((err, req, res, next) => {
            const {
                type,
                error
            } = err;
            // filter error types
            //
            Sentry.withScope((scope) => {
                const trx = res.__sentry_transaction;
                if (trx && scope.getSpan() === undefined) {
                    scope.setSpan(trx);
                }
                scope.setExtra("appRefErrCode", type);
                const evId = Sentry.captureException(error || err);
                res.sentryEvId = (evId || 'N/A');
                next(err);
            });
        });
    }
}
