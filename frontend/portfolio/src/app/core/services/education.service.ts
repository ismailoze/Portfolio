import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Education, CreateEducationDto, UpdateEducationDto } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private apiService = inject(ApiService);

  getEducations(): Observable<Education[]> {
    return this.apiService.get<Education[]>('education');
  }

  getEducationById(id: string): Observable<Education> {
    return this.apiService.get<Education>(`education/${id}`);
  }

  createEducation(dto: CreateEducationDto): Observable<Education> {
    return this.apiService.post<Education>('education', dto);
  }

  updateEducation(id: string, dto: UpdateEducationDto): Observable<Education> {
    return this.apiService.put<Education>(`education/${id}`, dto);
  }

  deleteEducation(id: string): Observable<void> {
    return this.apiService.delete<void>(`education/${id}`);
  }
}
