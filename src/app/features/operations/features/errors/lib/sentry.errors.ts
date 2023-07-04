import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { env } from "src/app/legacy/env.tool";

const sentryDsn = env("VITE_APP_SENTRY_DSN");

const EXCLUDED_ERRORS_REGEX = [
  "Non-Error promise rejection captured with keys: data, errors",
  "Non-Error exception captured with keys: message",
  "Non-Error exception captured with keys: data, errors",
  "Failed to fetch dynamically imported module:.*",
  "ResizeObserver loop limit exceeded",
  "Unauthorized",
];

export const SentryErrorsInit = () => {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0,
    enabled: import.meta.env.PROD,
    beforeSend(event, hint) {
      try {
        const isNonErrorException =
          event?.exception?.values?.[0].value?.startsWith(
            "Non-Error exception captured",
          );
        if (isNonErrorException && event?.exception?.values) {
          if (!event?.extra?.__serialized__) {
            return null;
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          let realErrMsg = event.extra.__serialized__.error?.message;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          realErrMsg = realErrMsg || event.extra.__serialized__.message;
          // this is a useless error message that masks the actual error.  Let's try to set it properly
          event.exception.values[0].value = realErrMsg;
          event.message = realErrMsg;
        }
      } catch (e) {
        // Ignore error
        return null;
      }

      const errorMessageFromException =
        event.exception?.values && event.exception?.values.length > 0
          ? event.exception?.values[0].value
          : null;
      const error = hint.originalException;
      const errorMessage = error instanceof Error ? error.message : error;

      event.extra = event.extra ?? {};
      event.extra.event = JSON.stringify(event);
      event.extra.hint = JSON.stringify(hint);

      try {
        for (const errorRegex of EXCLUDED_ERRORS_REGEX) {
          if (
            errorMessageFromException?.match(errorRegex) ||
            errorMessage?.match(errorRegex) ||
            event.message?.match(errorRegex)
          ) {
            // Ignore error
            return null;
          }
        }

        return event;
      } catch (err) {
        return event;
      }
    },
  });
};
