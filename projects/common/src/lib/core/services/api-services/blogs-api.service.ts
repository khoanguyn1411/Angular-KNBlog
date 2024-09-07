import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { blogDetailDtoSchema, blogDtoSchema } from '@knb/core/dtos/blog.dto';
import { createPaginationDtoSchema } from '@knb/core/dtos/pagination.dto';
import { BlogMapper } from '@knb/core/mapper/blog.mapper';
import { BlogsFilterParamsMapper } from '@knb/core/mapper/blogs-filter-params.mapper';
import { BlogsWithEmoticonsParamsMapper } from '@knb/core/mapper/blogs-with-emoticons-params.mapper';
import { PaginationMapper } from '@knb/core/mapper/pagination.mapper';
import { Blog, BlogCreation, BlogDetail } from '@knb/core/models/blog';
import { BlogsFilterParams } from '@knb/core/models/blogs-filter-params';
import { BlogsWithEmoticonsParams } from '@knb/core/models/blogs-with-emoticons-params';
import { Pagination } from '@knb/core/models/pagination';
import { composeHttpParams } from '@knb/core/utils/compose-http-params';
import { safeParse } from '@knb/core/utils/safe-parse';
import { map, Observable } from 'rxjs';
import { z } from 'zod';
import { AppUrlsConfig } from './app-urls.config';

@Injectable({ providedIn: 'root' })
export class BlogsApiService {
  private readonly blogMapper = inject(BlogMapper);
  private readonly appUrlsConfig = inject(AppUrlsConfig);
  private readonly httpClient = inject(HttpClient);
  private readonly paginationMapper = inject(PaginationMapper);
  private readonly blogsFilterParamsMapper = inject(BlogsFilterParamsMapper);
  private readonly blogsWithEmoticonsParamsMapper = inject(BlogsWithEmoticonsParamsMapper);

  public createBlog(blog: BlogCreation): Observable<void> {
    const blogDto = this.blogMapper.toCreationDto(blog);
    return this.httpClient.post(this.appUrlsConfig.blog.createBlog, blogDto).pipe(map(() => undefined));
  }

  public getBlogs(filters: BlogsFilterParams): Observable<Pagination<Blog>> {
    const filtersDto = composeHttpParams(this.blogsFilterParamsMapper.toDto(filters));
    return this.httpClient.get<unknown>(this.appUrlsConfig.blog.list, { params: filtersDto }).pipe(
      map((response) => safeParse(createPaginationDtoSchema(blogDtoSchema), response)),
      map((pagination) => this.paginationMapper.fromDto(pagination, (blogDto) => this.blogMapper.fromDto(blogDto))),
    );
  }

  public getBlogById(id: BlogDetail['id']): Observable<BlogDetail> {
    return this.httpClient.get<unknown>(this.appUrlsConfig.blog.detail(id)).pipe(
      map((response) => safeParse(blogDetailDtoSchema, response)),
      map((response) => this.blogMapper.fromDetailDto(response)),
    );
  }

  public getBlogsWithEmoticons(params: BlogsWithEmoticonsParams): Observable<Blog['id'][]> {
    const paramsDto = this.blogsWithEmoticonsParamsMapper.toDto(params);
    const httpParams = composeHttpParams(paramsDto);
    return this.httpClient
      .get<unknown>(this.appUrlsConfig.blog.blogsHaveEmoticons, { params: httpParams })
      .pipe(map((response) => safeParse(z.string().array(), response)));
  }
}
