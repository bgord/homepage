import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { CertificateInspector } from "+infra/adapters/certificate-inspector.adapter";
import { DiskSpaceChecker } from "+infra/adapters/disk-space-checker.adapter";
import { LoggerWinstonProductionAdapter } from "+infra/adapters/logger.adapter";
import { Env } from "+infra/env";

const production = Env.type === bg.NodeEnvironmentEnum.production;

export const prerequisites = [
  new bg.PrerequisitePort({ label: "port", port: Env.PORT }),
  new bg.PrerequisiteTimezoneUTC({ label: "timezone", timezone: tools.Timezone.parse(Env.TZ) }),
  new bg.PrerequisiteRAM({ label: "RAM", minimum: tools.Size.fromMB(128), enabled: production }),
  new bg.PrerequisiteSpace({
    label: "disk-space",
    minimum: tools.Size.fromMB(512),
    checker: DiskSpaceChecker,
  }),
  new bg.PrerequisiteNode({
    label: "node",
    version: tools.PackageVersion.fromString("24.3.0"),
    current: process.version,
  }),
  new bg.PrerequisiteBun({
    label: "bun",
    version: tools.PackageVersion.fromString("1.3.1"),
    current: Bun.version,
  }),
  new bg.PrerequisiteMemory({ label: "memory-consumption", maximum: tools.Size.fromMB(300) }),
  new bg.PrerequisiteLogFile({
    label: "log-file",
    logger: LoggerWinstonProductionAdapter,
    enabled: production,
  }),
  new bg.PrerequisiteOutsideConnectivity({ label: "outside-connectivity", enabled: production }),
  new bg.PrerequisiteRunningUser({ label: "user", username: "bgord", enabled: production }),
  new bg.PrerequisiteSSLCertificateExpiry({
    label: "ssl",
    host: "homepage.bgord.dev",
    days: 7,
    enabled: production,
    inspector: CertificateInspector,
  }),
];
