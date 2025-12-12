import * as bg from "@bgord/bun";
import { Hono } from "hono";
import { HTTP } from "+app";
import type * as infra from "+infra";
import type { bootstrap } from "+infra/bootstrap";

export function createServer(di: Awaited<ReturnType<typeof bootstrap>>) {
  const server = new Hono<infra.Config>().use(
    ...bg.Setup.essentials(
      { ...di.Adapters.System, I18n: di.Tools.I18nConfig },
      { httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] } },
    ),
  );

  // Healthcheck =================
  server.get(
    "/api/healthcheck",
    di.Adapters.System.ShieldRateLimit.verify,
    di.Adapters.System.ShieldTimeout.verify,
    di.Adapters.System.ShieldBasicAuth.verify,
    ...bg.Healthcheck.build(di.Tools.prerequisites, di.Adapters.System),
  );
  // =============================

  server.get("/", async (c) => c.html("Homepage"));
  server.get("/binary-search-visualizer", async (c) =>
    c.html(await Bun.file("web/binary-search.html").text()),
  );

  server.onError(HTTP.ErrorHandler.handle(di.Adapters.System));

  return server;
}
