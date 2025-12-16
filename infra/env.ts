import * as bg from "@bgord/bun";
import { z } from "zod/v4";

export const Schema = z
  .object({
    PORT: bg.Port,
    LOGS_LEVEL: z.enum(bg.LogLevelEnum),
    TZ: bg.TimezoneUtc,
    BASIC_AUTH_USERNAME: bg.BasicAuthUsername,
    BASIC_AUTH_PASSWORD: bg.BasicAuthPassword,
  })
  .strip();

export type EnvironmentType = bg.EnvironmentResultType<typeof Schema>;

const type = bg.NodeEnvironment.parse(process.env.NODE_ENV);

export const EnvironmentLoader = new bg.EnvironmentLoaderProcessAdapter({ type, Schema }, process.env);
