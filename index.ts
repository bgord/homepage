import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as infra from "+infra";
import { Clock } from "+infra/adapters/clock.adapter";
import { Logger } from "+infra/adapters/logger.adapter";
import { Env } from "+infra/env";
import { prerequisites } from "+infra/prerequisites";
import { server, startup } from "./server";

const deps = { Logger: Logger, Clock: Clock };

(async function main() {
  await new bg.Prerequisites(deps).check(prerequisites);

  const app = Bun.serve({
    maxRequestBodySize: infra.BODY_LIMIT_MAX_SIZE,
    idleTimeout: infra.IDLE_TIMEOUT,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      ...bg.StaticFiles.handle(
        "/public/*",
        Env.type === bg.NodeEnvironmentEnum.production
          ? bg.StaticFileStrategyMustRevalidate(tools.Duration.Minutes(5))
          : bg.StaticFileStrategyNoop,
      ),
      "/*": server.fetch,
    },
  });

  Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: Env.PORT, startupTimeMs: startup.stop().ms },
  });

  new bg.GracefulShutdown(deps).applyTo(app);
})();
