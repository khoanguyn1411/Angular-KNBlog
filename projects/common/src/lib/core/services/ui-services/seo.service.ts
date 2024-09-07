import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_NAME, APP_SUMMARY } from '@knb/core/constants/app-info';

type MainMetaTags = {
  readonly description?: string;
  readonly imageUrl?: string;
  readonly url?: string;
  readonly keywords?: string;
  readonly shouldIndexPage?: boolean;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private addCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector(`link[rel='canonical']`);

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  public addTitle(title: string) {
    const concatTitle = `${APP_NAME} | ${title}`;
    this.titleService.setTitle(concatTitle);
    this.metaService.addTag({ property: 'og:title', content: concatTitle });
  }

  public addTags(mainMetaTags: MainMetaTags) {
    const url = mainMetaTags.url ?? this.document.location.href;
    const shouldIndexPage = mainMetaTags.shouldIndexPage ?? true;
    const description = mainMetaTags.description ?? APP_SUMMARY;

    this.addCanonicalUrl(url);

    this.metaService.addTags([
      { name: 'description', content: description },
      { property: 'og:description', content: description },
      { property: 'og:image', content: mainMetaTags.imageUrl ?? '' },
      { property: 'og:url', content: url },
      { name: 'robots', content: shouldIndexPage ? 'index, follow' : 'noindex, nofollow' },
    ]);
  }
}
