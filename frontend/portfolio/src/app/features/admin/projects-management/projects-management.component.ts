import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectService } from '../../../core/services/project.service';
import { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-projects-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './projects-management.component.html',
  styleUrl: './projects-management.component.scss'
})
export class ProjectsManagementComponent implements OnInit {
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  projects = signal<Project[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingProject = signal<Project | null>(null);
  submitting = signal(false);
  activeLanguage = signal<'tr' | 'en'>('tr');
  projectForm!: FormGroup;

  ngOnInit(): void {
    this.loadProjects();
    this.initializeForm();
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      // Translation fields for TR
      trTitle: ['', [Validators.required, Validators.maxLength(200)]],
      trDescription: ['', [Validators.required, Validators.maxLength(2000)]],
      trTechnologies: [''],
      // Translation fields for EN
      enTitle: ['', [Validators.required, Validators.maxLength(200)]],
      enDescription: ['', [Validators.required, Validators.maxLength(2000)]],
      enTechnologies: [''],
      // Common fields
      githubUrl: [''],
      liveUrl: [''],
      imageUrl: [''],
      isPublished: [false],
      displayOrder: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectService.getAllProjects().subscribe({
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

  deleteProject(id: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const project = this.projects().find(p => p.id === id);
    const projectTitle = project ? this.getProjectTitle(project) : 'this project';
    
    if (confirm(`"${projectTitle}" projesini silmek istediğinize emin misiniz?`)) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (err) => {
          this.error.set(err.userMessage || 'errors.networkError');
        }
      });
    }
  }

  editProject(project: Project): void {
    this.editingProject.set(project);
    
    // Translation'ları form'a yükle
    const trTranslation = project.translations?.find(t => t.languageCode === 'tr');
    const enTranslation = project.translations?.find(t => t.languageCode === 'en');
    
    this.projectForm.patchValue({
      trTitle: trTranslation?.title || '',
      trDescription: trTranslation?.description || '',
      trTechnologies: trTranslation?.technologies || '',
      enTitle: enTranslation?.title || '',
      enDescription: enTranslation?.description || '',
      enTechnologies: enTranslation?.technologies || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrl: project.imageUrl || '',
      isPublished: project.isPublished,
      displayOrder: project.displayOrder
    });
    this.showForm.set(true);
  }

  createNew(): void {
    this.editingProject.set(null);
    this.activeLanguage.set('tr');
    this.projectForm.reset({
      trTitle: '',
      trDescription: '',
      trTechnologies: '',
      enTitle: '',
      enDescription: '',
      enTechnologies: '',
      githubUrl: '',
      liveUrl: '',
      imageUrl: '',
      isPublished: false,
      displayOrder: 0
    });
    this.showForm.set(true);
  }

  setActiveLanguage(lang: 'tr' | 'en'): void {
    this.activeLanguage.set(lang);
  }

  onSubmit(): void {
    // Aktif dilin formunu kontrol et
    const activeLang = this.activeLanguage();
    const titleField = activeLang === 'tr' ? 'trTitle' : 'enTitle';
    const descField = activeLang === 'tr' ? 'trDescription' : 'enDescription';
    
    // Her iki dil için de validasyon yap
    const trTitleControl = this.projectForm.get('trTitle');
    const trDescControl = this.projectForm.get('trDescription');
    const enTitleControl = this.projectForm.get('enTitle');
    const enDescControl = this.projectForm.get('enDescription');
    
    // Her iki dil için de zorunlu alanları kontrol et
    if (!trTitleControl?.value || !trDescControl?.value || 
        !enTitleControl?.value || !enDescControl?.value) {
      this.projectForm.markAllAsTouched();
      return;
    }

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const project = this.editingProject();
    const formValue = this.projectForm.value;

    const translations = [
      {
        languageCode: 'tr',
        title: formValue.trTitle,
        description: formValue.trDescription,
        technologies: formValue.trTechnologies || undefined
      },
      {
        languageCode: 'en',
        title: formValue.enTitle,
        description: formValue.enDescription,
        technologies: formValue.enTechnologies || undefined
      }
    ];

    if (project) {
      // Update existing project
      const updateDto: UpdateProjectDto = {
        translations: translations,
        githubUrl: formValue.githubUrl || undefined,
        liveUrl: formValue.liveUrl || undefined,
        imageUrl: formValue.imageUrl || undefined,
        isPublished: formValue.isPublished,
        displayOrder: formValue.displayOrder
      };

      this.projectService.updateProject(project.id, updateDto).subscribe({
        next: () => {
          this.onFormClose();
          this.submitting.set(false);
        },
        error: (err) => {
          this.error.set(err.userMessage || 'errors.networkError');
          this.submitting.set(false);
        }
      });
    } else {
      // Create new project
      const createDto: CreateProjectDto = {
        translations: translations,
        githubUrl: formValue.githubUrl || undefined,
        liveUrl: formValue.liveUrl || undefined,
        imageUrl: formValue.imageUrl || undefined,
        isPublished: formValue.isPublished,
        displayOrder: formValue.displayOrder
      };

      this.projectService.createProject(createDto).subscribe({
        next: () => {
          this.onFormClose();
          this.submitting.set(false);
        },
        error: (err) => {
          this.error.set(err.userMessage || 'errors.networkError');
          this.submitting.set(false);
        }
      });
    }
  }

  onFormClose(): void {
    this.showForm.set(false);
    this.editingProject.set(null);
    this.projectForm.reset();
    this.error.set(null);
    this.loadProjects();
  }

  validateUrl(url: string | null | undefined): boolean {
    if (!url || url.trim() === '') {
      return true; // Optional field
    }
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'validation.required';
    }
    if (field.errors['maxlength']) {
      return 'validation.maxLength';
    }
    if (field.errors['min']) {
      return 'validation.min';
    }
    if (field.errors['url']) {
      return 'validation.invalidUrl';
    }

    return '';
  }

  getTranslationField(field: string): string {
    const lang = this.activeLanguage();
    return `${lang}${field.charAt(0).toUpperCase() + field.slice(1)}`;
  }

  getProjectTitle(project: Project): string {
    // Önce translation'dan al, yoksa eski title'dan
    const trTranslation = project.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.title || project.title || 'Untitled';
  }

  getProjectDescription(project: Project): string {
    // Önce translation'dan al, yoksa eski description'dan
    const trTranslation = project.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.description || project.description || '';
  }
}
