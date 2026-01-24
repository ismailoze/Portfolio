import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiService = inject(ApiService);

  /**
   * Yayınlanmış projeleri getir
   */
  getPublishedProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('projects');
  }

  /**
   * Tüm projeleri getir (Admin)
   */
  getAllProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('projects/all');
  }

  /**
   * Proje detayını getir
   */
  getProjectById(id: string): Observable<Project> {
    return this.apiService.get<Project>(`projects/${id}`);
  }

  /**
   * Yeni proje oluştur
   */
  createProject(dto: CreateProjectDto): Observable<Project> {
    return this.apiService.post<Project>('projects', dto);
  }

  /**
   * Proje güncelle
   */
  updateProject(id: string, dto: UpdateProjectDto): Observable<Project> {
    return this.apiService.put<Project>(`projects/${id}`, dto);
  }

  /**
   * Proje sil
   */
  deleteProject(id: string): Observable<void> {
    return this.apiService.delete<void>(`projects/${id}`);
  }
}
