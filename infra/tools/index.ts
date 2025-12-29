import type * as bg from "@bgord/bun";
import type { EnvironmentType } from "+infra/env";
import { I18nConfig } from "./i18n";
import { createPrerequisites } from "./prerequisites";
import { createShieldBasicAuth } from "./shield-basic-auth.strategy";
import { createShieldRateLimit } from "./shield-rate-limit.strategy";
import { ShieldTimeout } from "./shield-timeout.strategy";

type Dependencies = {
  Clock: bg.ClockPort;
  DiskSpaceChecker: bg.DiskSpaceCheckerPort;
  Logger: bg.LoggerPort;
  CertificateInspector: bg.CertificateInspectorPort;
  Timekeeper: bg.TimekeeperPort;
  Sleeper: bg.SleeperPort;
  TimeoutRunner: bg.TimeoutRunnerPort;
};

export function createTools(Env: EnvironmentType, deps: Dependencies) {
  return {
    ShieldTimeout,
    ShieldRateLimit: createShieldRateLimit(Env, deps),
    ShieldBasicAuth: createShieldBasicAuth(Env),
    Prerequisites: createPrerequisites(Env, deps),
    I18nConfig,
  };
}
