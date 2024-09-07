import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_NAME, APP_SUMMARY } from '@knb/core/constants/app-info';
import { DateTime } from 'luxon';

type MainMetaTags = {
  readonly description?: string;
  readonly imageUrl?: string;
  readonly url?: string;
  readonly keywords?: string;
  readonly shouldIndexPage?: boolean;
};

type JsonLdScript = {
  readonly title: string;
  readonly imageUrl: string;
  readonly author: string;
  readonly datePublished: Date;
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
    this.addCanonicalUrl(this.document.location.hostname);
  }

  public addJsonLdScript(renderer: Renderer2, scriptConfig: JsonLdScript): void {
    const script = renderer.createElement('script');
    script.type = 'application/ld+json';

    const jsonLd = {
      '@context': this.document.location.href,
      '@type': 'Article',
      headline: `${scriptConfig.title}`,
      image: `${scriptConfig.imageUrl}`,
      author: {
        '@type': 'Person',
        name: `${scriptConfig.author}`,
      },
      datePublished: DateTime.fromJSDate(scriptConfig.datePublished).toFormat('yyyy-mm-dd'),
    };

    script.text = JSON.stringify(jsonLd);
    renderer.appendChild(this.document.head, script);
  }

  public addTags(mainMetaTags: MainMetaTags) {
    const url = mainMetaTags.url ?? this.document.location.href;
    const shouldIndexPage = mainMetaTags.shouldIndexPage ?? true;
    const description = mainMetaTags.description ?? APP_SUMMARY;

    this.metaService.addTags([
      { name: 'description', content: description },
      { property: 'og:description', content: description },
      { property: 'og:image', content: mainMetaTags.imageUrl ?? '' },
      { property: 'og:url', content: url },
      { name: 'robots', content: shouldIndexPage ? 'index, follow' : 'noindex, nofollow' },
    ]);
  }
}
