import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BlogMapper } from '@knb/core/mapper/blog.mapper';
import { BlogCreation } from '@knb/core/models/blog';
import { map, Observable } from 'rxjs';
import { AppUrlsConfig } from './app-urls.config';

@Injectable({ providedIn: 'root' })
export class BlogsApiService {
  private readonly blogMapper = inject(BlogMapper);
  private readonly appUrlsConfig = inject(AppUrlsConfig);
  private readonly httpClient = inject(HttpClient);

  public createBlog(blog: BlogCreation): Observable<void> {
    const blogDto = this.blogMapper.toCreationDto(blog);
    return this.httpClient.post(this.appUrlsConfig.blog.createBlog, blogDto).pipe(map(() => undefined));
  }

  public getBlogs(blog: BlogCreation): Observable<void> {
    const blogDto = this.blogMapper.toCreationDto(blog);
    return this.httpClient.post(this.appUrlsConfig.blog.createBlog, blogDto).pipe(map(() => undefined));
  }
}
