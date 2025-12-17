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

  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ ttl: tools.Duration.Hours(1) });
  const CacheResolver = new bg.CacheResolverSimpleAdapter({ CacheRepository });

  const EnvironmentLoaderProcessSafe = new bg.EnvironmentLoaderProcessSafeAdapter(
    process.env,
    { type, Schema },
    { CacheResolver },
  );

  return {
    [bg.NodeEnvironmentEnum.local]: EnvironmentLoaderProcessSafe,
    [bg.NodeEnvironmentEnum.test]: new bg.EnvironmentLoaderProcessAdapter({ type, Schema }, process.env),
    [bg.NodeEnvironmentEnum.staging]: EnvironmentLoaderProcessSafe,
    [bg.NodeEnvironmentEnum.production]: new bg.EnvironmentLoaderEncryptedAdapter(
      { type, Schema, path: SecretsPath },
      { Encryption },
    ),
  }[type];
}
