import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../../../core/services/contact.service';
import { ContactMessage, ReplyContactMessageDto } from '../../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);

  messages = signal<ContactMessage[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedMessage = signal<ContactMessage | null>(null);
  showReplyForm = signal(false);
  deletingMessageId = signal<string | null>(null);
  replyingMessageId = signal<string | null>(null);

  replyForm!: FormGroup;

  ngOnInit(): void {
    this.loadMessages();
    this.initializeReplyForm();
  }

  initializeReplyForm(): void {
    this.replyForm = this.fb.group({
      replyMessage: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadMessages(): void {
    this.loading.set(true);
    this.error.set(null);

    this.contactService.getAllMessages().subscribe({
      next: (data) => {
        this.messages.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  selectMessage(message: ContactMessage): void {
    this.selectedMessage.set(message);
    this.showReplyForm.set(false);
    this.replyForm.reset();
    this.markAsRead(message);
  }

  markAsRead(message: ContactMessage): void {
    if (!message.isRead) {
      this.contactService.markAsRead(message.id).subscribe({
        next: () => {
          this.loadMessages();
        },
        error: (err) => {
          this.error.set(err.userMessage || 'errors.networkError');
        }
      });
    }
  }

  deleteMessage(message: ContactMessage, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!confirm(`"${message.subject}" mesajını silmek istediğinize emin misiniz?`)) {
      return;
    }

    this.deletingMessageId.set(message.id);
    this.error.set(null);

    this.contactService.deleteMessage(message.id).subscribe({
      next: () => {
        if (this.selectedMessage()?.id === message.id) {
          this.selectedMessage.set(null);
          this.showReplyForm.set(false);
        }
        this.loadMessages();
        this.deletingMessageId.set(null);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.deletingMessageId.set(null);
      }
    });
  }

  toggleReplyForm(): void {
    this.showReplyForm.set(!this.showReplyForm());
    if (this.showReplyForm()) {
      this.replyForm.reset();
    }
  }

  sendReply(): void {
    if (this.replyForm.invalid) {
      this.replyForm.markAllAsTouched();
      return;
    }

    const message = this.selectedMessage();
    if (!message) {
      return;
    }

    this.replyingMessageId.set(message.id);
    this.error.set(null);

    const dto: ReplyContactMessageDto = {
      replyMessage: this.replyForm.value.replyMessage
    };

    this.contactService.replyToMessage(message.id, dto).subscribe({
      next: () => {
        this.replyForm.reset();
        this.showReplyForm.set(false);
        this.replyingMessageId.set(null);
        // Başarı mesajı gösterilebilir
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.replyingMessageId.set(null);
      }
    });
  }

  getUnreadCount(): number {
    return this.messages().filter(m => !m.isRead).length;
  }

  getFilteredMessages(): ContactMessage[] {
    return this.messages();
  }
}
