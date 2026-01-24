import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';
import { LazyImageDirective } from '../../shared/directives/lazy-image.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ScrollAnimationDirective,
    LazyImageDirective
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);

  projects = signal<Project[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectService.getPublishedProjects().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  get filteredProjects(): Project[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.projects();

    return this.projects().filter(project => {
      const title = this.getProjectTitle(project).toLowerCase();
      const description = this.getProjectDescription(project).toLowerCase();
      const technologies = this.getProjectTechnologies(project).toLowerCase();
      return title.includes(term) || description.includes(term) || technologies.includes(term);
    });
  }

  getProjectTitle(project: Project): string {
    // Önce translation'dan al, yoksa eski title'dan
    const trTranslation = project.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.title || project.title || '';
  }

  getProjectDescription(project: Project): string {
    // Önce translation'dan al, yoksa eski description'dan
    const trTranslation = project.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.description || project.description || '';
  }

  getProjectTechnologies(project: Project): string {
    // Önce translation'dan al, yoksa eski technologies'den
    const trTranslation = project.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.technologies || project.technologies || '';
  }

  getTechnologies(technologies?: string): string[] {
    if (!technologies) return [];
    return technologies.split(',').map(t => t.trim());
  }
}
