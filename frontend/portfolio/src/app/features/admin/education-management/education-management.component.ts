import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EducationService } from '../../../core/services/education.service';
import { Education, CreateEducationDto, UpdateEducationDto } from '../../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-education-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './education-management.component.html',
  styleUrl: './education-management.component.scss'
})
export class EducationManagementComponent implements OnInit {
  private educationService = inject(EducationService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  educations = signal<Education[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingEducation = signal<Education | null>(null);

  educationForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadEducations();
  }

  initializeForm(): void {
    this.educationForm = this.fb.group({
      institution: ['', [Validators.required, Validators.maxLength(200)]],
      degree: ['', [Validators.required, Validators.maxLength(200)]],
      field: ['', [Validators.required, Validators.maxLength(200)]],
      startDate: ['', Validators.required],
      endDate: [''],
      description: ['', Validators.maxLength(2000)],
      isCompleted: [true],
      displayOrder: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadEducations(): void {
    this.loading.set(true);
    this.error.set(null);
    this.educationService.getEducations().subscribe({
      next: (data) => {
        this.educations.set(data.sort((a, b) => a.displayOrder - b.displayOrder));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  openForm(edu?: Education): void {
    if (edu) {
      this.editingEducation.set(edu);
      this.educationForm.patchValue({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate?.toString().slice(0, 10) ?? '',
        endDate: edu.endDate?.toString().slice(0, 10) ?? '',
        description: edu.description ?? '',
        isCompleted: edu.isCompleted,
        displayOrder: edu.displayOrder
      });
    } else {
      this.editingEducation.set(null);
      this.educationForm.reset({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
        isCompleted: true,
        displayOrder: 0
      });
    }
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingEducation.set(null);
    this.educationForm.reset();
  }

  onSubmit(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }
    const v = this.educationForm.value;
    const dto = {
      institution: v.institution,
      degree: v.degree,
      field: v.field,
      startDate: v.startDate,
      endDate: v.endDate || undefined,
      description: v.description || undefined,
      isCompleted: !!v.isCompleted,
      displayOrder: Number(v.displayOrder) || 0
    };
    if (this.editingEducation()) {
      this.educationService.updateEducation(this.editingEducation()!.id, dto as UpdateEducationDto).subscribe({
        next: () => { this.loadEducations(); this.closeForm(); },
        error: (err) => { this.error.set(err.userMessage || 'errors.networkError'); }
      });
    } else {
      this.educationService.createEducation(dto as CreateEducationDto).subscribe({
        next: () => { this.loadEducations(); this.closeForm(); },
        error: (err) => { this.error.set(err.userMessage || 'errors.networkError'); }
      });
    }
  }

  deleteEducation(edu: Education): void {
    const name = `${edu.degree} - ${edu.institution}`;
    if (!confirm(this.translate.instant('common.confirmDelete', { name }))) return;
    this.loading.set(true);
    this.error.set(null);
    this.educationService.deleteEducation(edu.id).subscribe({
      next: () => this.loadEducations(),
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
