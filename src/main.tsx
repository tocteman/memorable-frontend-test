import "./main.css";

import { render } from "react-dom";

import App from "./app/app.page";
import { Providers } from "./providers";
import { SentryErrorsInit } from "./app/features/operations/features/errors/lib/sentry.errors";

const root = document.getElementById("root");

SentryErrorsInit();

render(
  <Providers>
    <App />
  </Providers>,
  root,
);
