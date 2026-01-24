import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExperienceService } from '../../../core/services/experience.service';
import { WorkExperience, CreateWorkExperienceDto, UpdateWorkExperienceDto } from '../../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-experience-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './experience-management.component.html',
  styleUrl: './experience-management.component.scss'
})
export class ExperienceManagementComponent implements OnInit {
  private experienceService = inject(ExperienceService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  experiences = signal<WorkExperience[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingExperience = signal<WorkExperience | null>(null);

  experienceForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadExperiences();
  }

  initializeForm(): void {
    this.experienceForm = this.fb.group({
      company: ['', [Validators.required, Validators.maxLength(200)]],
      position: ['', [Validators.required, Validators.maxLength(200)]],
      startDate: ['', Validators.required],
      endDate: [''],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      technologies: ['', Validators.maxLength(500)],
      isCurrent: [false],
      displayOrder: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadExperiences(): void {
    this.loading.set(true);
    this.error.set(null);
    this.experienceService.getExperiences().subscribe({
      next: (data) => {
        this.experiences.set(data.sort((a, b) => a.displayOrder - b.displayOrder));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  openForm(exp?: WorkExperience): void {
    if (exp) {
      this.editingExperience.set(exp);
      this.experienceForm.patchValue({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate?.toString().slice(0, 10) ?? '',
        endDate: exp.endDate?.toString().slice(0, 10) ?? '',
        description: exp.description ?? '',
        technologies: exp.technologies ?? '',
        isCurrent: exp.isCurrent,
        displayOrder: exp.displayOrder
      });
    } else {
      this.editingExperience.set(null);
      this.experienceForm.reset({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: '',
        isCurrent: false,
        displayOrder: 0
      });
    }
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingExperience.set(null);
    this.experienceForm.reset();
  }

  onSubmit(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }
    const v = this.experienceForm.value;
    const dto = {
      company: v.company,
      position: v.position,
      startDate: v.startDate,
      endDate: v.endDate || undefined,
      description: v.description,
      technologies: v.technologies || undefined,
      isCurrent: !!v.isCurrent,
      displayOrder: Number(v.displayOrder) || 0
    };
    if (this.editingExperience()) {
      this.experienceService.updateExperience(this.editingExperience()!.id, dto as UpdateWorkExperienceDto).subscribe({
        next: () => { this.loadExperiences(); this.closeForm(); },
        error: (err) => { this.error.set(err.userMessage || 'errors.networkError'); }
      });
    } else {
      this.experienceService.createExperience(dto as CreateWorkExperienceDto).subscribe({
        next: () => { this.loadExperiences(); this.closeForm(); },
        error: (err) => { this.error.set(err.userMessage || 'errors.networkError'); }
      });
    }
  }

  deleteExperience(exp: WorkExperience): void {
    const name = `${exp.position} - ${exp.company}`;
    if (!confirm(this.translate.instant('common.confirmDelete', { name }))) return;
    this.loading.set(true);
    this.error.set(null);
    this.experienceService.deleteExperience(exp.id).subscribe({
      next: () => this.loadExperiences(),
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  formatDate(d: string | undefined): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  }
}
