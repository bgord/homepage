import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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

export const MasterKeyPath = tools.FilePathAbsolute.fromString("/etc/bgord/homepage/master.key");
export const SecretsPath = tools.FilePathAbsolute.fromString("/var/www/homepage/secrets.enc");

export async function createEnvironmentLoader(): Promise<bg.EnvironmentLoaderPort<typeof Schema>> {
  const type = bg.NodeEnvironment.parse(process.env.NODE_ENV);

  const CryptoKeyProvider = new bg.CryptoKeyProviderFileAdapter(MasterKeyPath);

  const Encryption = new bg.EncryptionBunAdapter({ CryptoKeyProvider });

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.EnvironmentLoaderProcessSafeAdapter({ type, Schema }, process.env),
    [bg.NodeEnvironmentEnum.test]: new bg.EnvironmentLoaderProcessAdapter({ type, Schema }, process.env),
    [bg.NodeEnvironmentEnum.staging]: new bg.EnvironmentLoaderProcessSafeAdapter(
      { type, Schema },
      process.env,
    ),
    [bg.NodeEnvironmentEnum.production]: new bg.EnvironmentLoaderEncryptedAdapter(
      { type, Schema, path: SecretsPath },
      { Encryption },
    ),
  }[type];
}
