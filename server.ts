import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Hono } from "hono";
import { timeout } from "hono/timeout";
import { HTTP } from "+app";
import * as infra from "+infra";
import * as Adapters from "+infra/adapters";
import { BasicAuthShield } from "+infra/basic-auth-shield";
import { Env } from "+infra/env";
import { healthcheck } from "+infra/healthcheck";
import { I18nConfig } from "+infra/i18n";
import * as RateLimiters from "+infra/rate-limiters";

const Deps = {
  Logger: Adapters.Logger,
  I18n: I18nConfig,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  JsonFileReader: Adapters.JsonFileReader,
};

const production = Env.type === bg.NodeEnvironmentEnum.production;
const server = new Hono<infra.HonoConfig>();

server.use(
  ...bg.Setup.essentials(Deps, {
    httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] },
  }),
);

const startup = new tools.Stopwatch(Adapters.Clock.now());

// Healthcheck =================
server.get(
  "/healthcheck",
  bg.ShieldRateLimit(
    { enabled: production, subject: bg.AnonSubjectResolver, store: RateLimiters.HealthcheckStore },
    Deps,
  ),
  timeout(tools.Duration.Seconds(15).ms, infra.requestTimeoutError),
  BasicAuthShield,
  ...bg.Healthcheck.build(healthcheck, Deps),
);
// =============================

server.get("/", async (c) => {
  return c.html("Homepage");
});

server.onError(HTTP.ErrorHandler.handle);

export { server, startup };
