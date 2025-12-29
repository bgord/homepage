import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "./server";

(async function main() {
  const di = await bootstrap();
  const server = createServer(di);

  await new bg.PrerequisiteRunnerStartup(di.Adapters.System).check(di.Tools.Prerequisites);

  const app = Bun.serve({
    port: di.Env.PORT,
    maxRequestBodySize: tools.Size.fromKb(128).toBytes(),
    idleTimeout: tools.Duration.Seconds(10).seconds,
    routes: {
      "/favicon.ico": Bun.file("public/favicon.ico"),
      ...bg.StaticFiles.handle(
        "/public/*",
        di.Env.type === bg.NodeEnvironmentEnum.production
          ? bg.StaticFileStrategyMustRevalidate(tools.Duration.Minutes(5))
          : bg.StaticFileStrategyNoop,
      ),
      "/*": server.fetch,
    },
  });

  new bg.GracefulShutdown(di.Adapters.System).applyTo(app);

  di.Adapters.System.Logger.info({
    message: "Server has started",
    component: "infra",
    operation: "server_startup",
    metadata: { port: di.Env.PORT },
  });
})();
