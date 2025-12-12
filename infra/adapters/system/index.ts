import type { EnvironmentType } from "+infra/env";
import { createCertificateInspector } from "./certificate-inspector.adapter";
import { createClock } from "./clock.adapter";
import { createDiskSpaceChecker } from "./disk-space-checker.adapter";
import { createIdProvider } from "./id-provider.adapter";
import { createJsonFileReader } from "./json-file-reader.adapter";
import { createLogger } from "./logger.adapter";
import { createShieldBasicAuth } from "./shield-basic-auth.adapter";
import { createShieldRateLimit } from "./shield-rate-limit.adapter";
import { createShieldTimeout } from "./shield-timeout.adapter";
import { createTimekeeper } from "./timekeeper.adapter";

export function createSystemAdapters(Env: EnvironmentType) {
  const Clock = createClock();
  const IdProvider = createIdProvider();
  const Logger = createLogger(Env);
  const Timekeeper = createTimekeeper(Env, { Clock });

  return {
    ShieldBasicAuth: createShieldBasicAuth(Env),
    CertificateInspector: createCertificateInspector(Env, { Clock }),
    Clock,
    DiskSpaceChecker: createDiskSpaceChecker(Env),
    IdProvider,
    JsonFileReader: createJsonFileReader(),
    Logger,
    Timekeeper,
    ShieldTimeout: createShieldTimeout(),
    ShieldRateLimit: createShieldRateLimit(Env, { Clock }),
  };
}
