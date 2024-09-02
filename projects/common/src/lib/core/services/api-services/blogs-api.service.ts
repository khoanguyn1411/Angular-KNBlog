import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { blogDtoSchema } from '@knb/core/dtos/blog.dto';
import { createPaginationDtoSchema } from '@knb/core/dtos/pagination.dto';
import { BlogMapper } from '@knb/core/mapper/blog.mapper';
import { BlogsFilterParamsMapper } from '@knb/core/mapper/blogs-filter-params.mapper';
import { PaginationMapper } from '@knb/core/mapper/pagination.mapper';
import { Blog, BlogCreation } from '@knb/core/models/blog';
import { BlogsFilterParams } from '@knb/core/models/blogs-filter-params';
import { Pagination } from '@knb/core/models/pagination';
import { safeParse } from '@knb/core/utils/safe-parse';
import { map, Observable } from 'rxjs';
import { AppUrlsConfig } from './app-urls.config';

@Injectable({ providedIn: 'root' })
export class BlogsApiService {
  private readonly blogMapper = inject(BlogMapper);
  private readonly appUrlsConfig = inject(AppUrlsConfig);
  private readonly httpClient = inject(HttpClient);
  private readonly paginationMapper = inject(PaginationMapper);
  private readonly blogsFilterParamsMapper = inject(BlogsFilterParamsMapper);

  public createBlog(blog: BlogCreation): Observable<void> {
    const blogDto = this.blogMapper.toCreationDto(blog);
    return this.httpClient.post(this.appUrlsConfig.blog.createBlog, blogDto).pipe(map(() => undefined));
  }

  public getBlogs(filters: BlogsFilterParams): Observable<Pagination<Blog>> {
    const filtersDto = this.blogsFilterParamsMapper.toDto(filters);
    return this.httpClient.get<unknown>(this.appUrlsConfig.blog.list, { params: filtersDto }).pipe(
      map((response) => safeParse(createPaginationDtoSchema(blogDtoSchema), response)),
      map((pagination) => this.paginationMapper.fromDto(pagination, (blogDto) => this.blogMapper.fromDto(blogDto))),
    );
  }

  public getBlogById(id: Blog['id']): Observable<Blog> {
    return this.httpClient.get<unknown>(this.appUrlsConfig.blog.detail(id)).pipe(
      map((response) => safeParse(blogDtoSchema, response)),
      map((response) => this.blogMapper.fromDto(response)),
    );
  }
}
