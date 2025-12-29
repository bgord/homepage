import type { EnvironmentType } from "+infra/env";
import { createCertificateInspector } from "./certificate-inspector.adapter";
import { Clock } from "./clock.adapter";
import { createDiskSpaceChecker } from "./disk-space-checker.adapter";
import { FileReaderJson } from "./file-reader-json.adapter";
import { IdProvider } from "./id-provider.adapter";
import { createLogger } from "./logger.adapter";
import { createSleeper } from "./sleeper.adapter";
import { createTimekeeper } from "./timekeeper.adapter";

export function createSystemAdapters(Env: EnvironmentType) {
  const Logger = createLogger(Env);
  const Timekeeper = createTimekeeper(Env, { Clock });

  return {
    CertificateInspector: createCertificateInspector(Env, { Clock }),
    Clock,
    DiskSpaceChecker: createDiskSpaceChecker(Env),
    IdProvider,
    FileReaderJson,
    Logger,
    Timekeeper,
    Sleeper: createSleeper(Env),
  };
}
