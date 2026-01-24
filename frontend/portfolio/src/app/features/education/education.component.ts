import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EducationService } from '../../core/services/education.service';
import { Education } from '../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent, ScrollAnimationDirective],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {
  private educationService = inject(EducationService);

  educations = signal<Education[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEducations();
  }

  loadEducations(): void {
    this.loading.set(true);
    this.error.set(null);

    this.educationService.getEducations().subscribe({
      next: (data) => {
        this.educations.set(data.sort((a, b) => b.displayOrder - a.displayOrder));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
  }
}
