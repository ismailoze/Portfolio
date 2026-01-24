import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);

  project = signal<Project | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
    }
  }

  loadProject(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectService.getProjectById(id).subscribe({
      next: (data) => {
        this.project.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  getTechnologies(technologies?: string): string[] {
    if (!technologies) return [];
    return technologies.split(',').map(t => t.trim());
  }
}
