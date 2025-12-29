import type * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";

export const I18nConfig: bg.I18nConfigType = {
  supportedLanguages: SupportedLanguages,
  defaultLanguage: SupportedLanguages.en,
};

/** @public */
export type I18nVariables = { language: SupportedLanguages };
