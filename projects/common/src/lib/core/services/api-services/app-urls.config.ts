import { Injectable, inject } from "@angular/core";
import { AppConfig } from "../app.config";


/**
 * Urls used within the application.
 * Stringified for convenience, since most of the Angular's HTTP tools work with strings.
 */
@Injectable({ providedIn: 'root' })
export class AppUrlsConfig {
	private readonly appConfigService = inject(AppConfig);

	/** Auth-related routes. */
	public readonly auth = {
		login: this.toApi('auth/login/'),
		register: this.toApi('auth/register/'),
		logout: this.toApi('auth/logout/'),
		refreshSecret: this.toApi('auth/password-reset/'),
	} as const;

	/**
	 * Checks whether the url is application-scoped.
	 * @param url Url to check.
	 */
	public isApplicationUrl(url: string): boolean {
		return url.startsWith(this.appConfigService.apiUrl);
	}

	/**
	 * Checks whether the specified url is calling an auth-related endpoint.
	 * @param url Url to check.
	 */
	public isAuthUrl(url: string): boolean {
		return Object.values(this.auth).find(authUrl => authUrl.includes(url)) != null;
	}

	private toApi(...args: readonly string[]): string {
		const path = args.join('/');
		return new URL(path, this.appConfigService.apiUrl).toString();
	}
}
