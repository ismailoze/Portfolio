import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DashboardStats } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiService = inject(ApiService);

  getDashboardStats(): Observable<DashboardStats> {
    // Backend'den gelen PascalCase response'u camelCase'e çevir
    return this.apiService.get<Record<string, number>>('admin/stats').pipe(
      map((response) => ({
        totalProjects: response.TotalProjects || response.totalProjects || 0,
        publishedProjects: response.PublishedProjects || response.publishedProjects || 0,
        totalBlogPosts: response.TotalBlogPosts || response.totalBlogPosts || 0,
        publishedBlogPosts: response.PublishedBlogPosts || response.publishedBlogPosts || 0,
        unreadMessages: response.UnreadMessages || response.unreadMessages || 0,
        totalMessages: response.TotalMessages || response.totalMessages || 0
      }))
    );
  }
}
