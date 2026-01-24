import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactMessage, CreateContactMessageDto, ReplyContactMessageDto } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiService = inject(ApiService);

  sendMessage(dto: CreateContactMessageDto): Observable<ContactMessage> {
    return this.apiService.post<ContactMessage>('contact', dto);
  }

  getAllMessages(): Observable<ContactMessage[]> {
    return this.apiService.get<ContactMessage[]>('contact');
  }

  getMessageById(id: string): Observable<ContactMessage> {
    return this.apiService.get<ContactMessage>(`contact/${id}`);
  }

  markAsRead(id: string): Observable<void> {
    return this.apiService.put<void>(`contact/${id}/read`, {});
  }

  deleteMessage(id: string): Observable<void> {
    return this.apiService.delete<void>(`contact/${id}`);
  }

  replyToMessage(id: string, dto: ReplyContactMessageDto): Observable<void> {
    return this.apiService.post<void>(`contact/${id}/reply`, dto);
  }
}
