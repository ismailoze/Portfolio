import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Skill, CreateSkillDto, UpdateSkillDto } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiService = inject(ApiService);

  getSkills(category?: string): Observable<Skill[]> {
    const params = category ? { category } : undefined;
    return this.apiService.get<Skill[]>('skills', params);
  }

  getSkillById(id: string): Observable<Skill> {
    return this.apiService.get<Skill>(`skills/${id}`);
  }

  createSkill(dto: CreateSkillDto): Observable<Skill> {
    return this.apiService.post<Skill>('skills', dto);
  }

  updateSkill(id: string, dto: UpdateSkillDto): Observable<Skill> {
    return this.apiService.put<Skill>(`skills/${id}`, dto);
  }

  deleteSkill(id: string): Observable<void> {
    return this.apiService.delete<void>(`skills/${id}`);
  }
}
