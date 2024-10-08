import { Injectable, inject } from '@angular/core';
import { Blog } from '@knb/core/models/blog';
import { AppConfig } from '../app.config';

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
    googleLogin: this.toApi('auth/google-login/'),
    register: this.toApi('auth/register/'),
    logout: this.toApi('auth/logout/'),
    refreshSecret: this.toApi('auth/token/refresh/'),
  } as const;

  /** User routes. */
  public readonly user = {
    list: this.toApi('users/'),
    profile: this.toApi('users/profile/'),
    updateUser: (userId: string) => this.toApi(`users/${userId}/`),
    detail: (userId: string) => this.toApi(`users/${userId}/`),
  } as const;

  /** Blog routes. */
  public readonly blog = {
    createBlog: this.toApi('blogs/'),
    list: this.toApi('blogs/'),
    detail: (id: Blog['id']) => this.toApi(`blogs/${id}`),
    blogsHaveEmoticons: this.toApi('blogs/blogs-have-emoticons/'),
  } as const;

  /** Emoticon routes. */
  public readonly emoticon = {
    add: this.toApi('blog-emoticon/'),
    remove: (id: Blog['id']) => this.toApi(`blog-emoticon/${id}`),
  } as const;

  /** Upload routes. */
  public readonly upload = {
    image: this.toApi('upload/image/'),
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
    return Object.values(this.auth).find((authUrl) => authUrl.includes(url) && authUrl !== this.auth.logout) != null;
  }

  private toApi(...args: readonly string[]): string {
    const path = args.join('/');
    return new URL(path, this.appConfigService.apiUrl).toString();
  }
}
