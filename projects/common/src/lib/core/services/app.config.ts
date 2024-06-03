/**
 * Abstract app config object. Provides information about current application environment configuration.
 */
export abstract class AppConfig {
  // This must NOT have any environment-provided properties declarations, since environments are application-specific.
  // Please use application-specific implementations for this (e.g. web-app-config.service.ts)!

  /** API base URL. */
  public abstract readonly apiUrl: string;

  /** App version. */
  public abstract readonly version: string;
}
