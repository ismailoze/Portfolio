import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { WorkExperience, CreateWorkExperienceDto, UpdateWorkExperienceDto } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiService = inject(ApiService);

  getExperiences(): Observable<WorkExperience[]> {
    return this.apiService.get<WorkExperience[]>('experience');
  }

  getExperienceById(id: string): Observable<WorkExperience> {
    return this.apiService.get<WorkExperience>(`experience/${id}`);
  }

  createExperience(dto: CreateWorkExperienceDto): Observable<WorkExperience> {
    return this.apiService.post<WorkExperience>('experience', dto);
  }

  updateExperience(id: string, dto: UpdateWorkExperienceDto): Observable<WorkExperience> {
    return this.apiService.put<WorkExperience>(`experience/${id}`, dto);
  }

  deleteExperience(id: string): Observable<void> {
    return this.apiService.delete<void>(`experience/${id}`);
  }
}
