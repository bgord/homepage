import type { EnvironmentType } from "+infra/env";
import { createCertificateInspector } from "./certificate-inspector.adapter";
import { Clock } from "./clock.adapter";
import { createDiskSpaceChecker } from "./disk-space-checker.adapter";
import { FileReaderJson } from "./file-reader-json.adapter";
import { IdProvider } from "./id-provider.adapter";
import { createLogger } from "./logger.adapter";
import { createShieldBasicAuth } from "./shield-basic-auth.adapter";
import { createShieldRateLimit } from "./shield-rate-limit.adapter";
import { ShieldTimeout } from "./shield-timeout.adapter";
import { createTimekeeper } from "./timekeeper.adapter";

export function createSystemAdapters(Env: EnvironmentType) {
  const Logger = createLogger(Env);
  const Timekeeper = createTimekeeper(Env, { Clock });

  return {
    ShieldBasicAuth: createShieldBasicAuth(Env),
    CertificateInspector: createCertificateInspector(Env, { Clock }),
    Clock,
    DiskSpaceChecker: createDiskSpaceChecker(Env),
    IdProvider,
    FileReaderJson,
    Logger,
    Timekeeper,
    ShieldTimeout,
    ShieldRateLimit: createShieldRateLimit(Env, { Clock }),
  };
}
