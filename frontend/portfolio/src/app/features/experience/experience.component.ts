import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ExperienceService } from '../../core/services/experience.service';
import { WorkExperience } from '../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent, ScrollAnimationDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  private experienceService = inject(ExperienceService);

  experiences = signal<WorkExperience[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadExperiences();
  }

  loadExperiences(): void {
    this.loading.set(true);
    this.error.set(null);

    this.experienceService.getExperiences().subscribe({
      next: (data) => {
        this.experiences.set(data.sort((a, b) => b.displayOrder - a.displayOrder));
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

  getTechnologies(technologies?: string): string[] {
    if (!technologies) return [];
    return technologies.split(',').map(t => t.trim());
  }
}
