// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://e87f1663b6987c18bea8ab24fdb68bd5@o4506817294368768.ingest.sentry.io/4506817295941632",
    beforeSend(event, hint) {
        if (event.exception && event.event_id) {
            Sentry.showReportDialog({eventId: event.event_id});
        }
        return event;
    },

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    replaysOnErrorSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
        Sentry.replayIntegration({
            // Additional Replay configuration goes in here, for example:
            maskAllText: false,
            blockAllMedia: true,
        }),
        Sentry.feedbackIntegration(),
        Sentry.browserTracingIntegration(),
        Sentry.browserProfilingIntegration()
    ],
});
