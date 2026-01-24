import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BlogPost, CreateBlogPostDto, UpdateBlogPostDto } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiService = inject(ApiService);

  /**
   * Yayınlanmış blog yazılarını getir
   */
  getPublishedPosts(): Observable<BlogPost[]> {
    return this.apiService.get<BlogPost[]>('blog');
  }

  /**
   * Tüm blog yazılarını getir (Admin)
   */
  getAllPosts(): Observable<BlogPost[]> {
    return this.apiService.get<BlogPost[]>('blog/all');
  }

  /**
   * Slug ile blog yazısı getir
   */
  getPostBySlug(slug: string): Observable<BlogPost> {
    return this.apiService.get<BlogPost>(`blog/slug/${slug}`);
  }

  /**
   * ID ile blog yazısı getir
   */
  getPostById(id: string): Observable<BlogPost> {
    return this.apiService.get<BlogPost>(`blog/${id}`);
  }

  /**
   * Yeni blog yazısı oluştur
   */
  createPost(dto: CreateBlogPostDto): Observable<BlogPost> {
    return this.apiService.post<BlogPost>('blog', dto);
  }

  /**
   * Blog yazısı güncelle
   */
  updatePost(id: string, dto: UpdateBlogPostDto): Observable<BlogPost> {
    return this.apiService.put<BlogPost>(`blog/${id}`, dto);
  }

  /**
   * Blog yazısı sil
   */
  deletePost(id: string): Observable<void> {
    return this.apiService.delete<void>(`blog/${id}`);
  }
}
