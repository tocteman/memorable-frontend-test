/* eslint-disable @typescript-eslint/no-unused-vars */

import * as Sentry from "@sentry/react";
import LogRocket from "logrocket";
import { Component, ErrorInfo, ReactNode } from "react";
import ErrorsPage from "../pages/error.page";
import { getStackFunctionNamesTool } from "../pages/tools/getStackFunctionNames.tool";
import { transformErrorToCustomErrorTool } from "../pages/tools/transformErrorToCustomError.tool";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  info: ErrorInfo | null;
}

class ErrorBoundaries extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    info: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, info: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    /**
     * ADD LOGGING SERVICE HERE
     * logErrorToMyService(error, errorInfo);
     */
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, errorInfo);
    Sentry.withScope((scope) => {
      scope.setExtras({ errorInfo });
      Sentry.captureException(error);
    });
    LogRocket.captureException(error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorsPage
          errors={
            this.state.error
              ? [
                  transformErrorToCustomErrorTool(
                    this.state.error,
                    getStackFunctionNamesTool(this.state.error.stack ?? ""),
                  ),
                ]
              : []
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaries;
