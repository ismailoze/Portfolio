import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SkillService } from '../../../core/services/skill.service';
import { Skill, CreateSkillDto, UpdateSkillDto } from '../../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { SkillIconComponent } from '../../../shared/components/skill-icon/skill-icon.component';

@Component({
  selector: 'app-skills-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    SkillIconComponent
  ],
  templateUrl: './skills-management.component.html',
  styleUrl: './skills-management.component.scss'
})
export class SkillsManagementComponent implements OnInit {
  private skillService = inject(SkillService);
  private fb = inject(FormBuilder);

  skills = signal<Skill[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingSkill = signal<Skill | null>(null);
  showIconPicker = signal(false);
  availableIcons = signal<string[]>([]);
  iconSearchTerm = signal('');

  skillForm!: FormGroup;

  // Yaygın kullanılan icon isimleri - Iconify formatında
  // Icon setleri: simple-icons, logos, devicon, skill-icons, carbon, vb.
  commonIcons = [
    // Simple Icons (brand renkleri ile) - Doğru icon adları
    'simple-icons:jsonwebtokens', 'simple-icons:github', 'simple-icons:git', 'simple-icons:docker', 
    'simple-icons:postgresql', 'simple-icons:mysql', 'simple-icons:mongodb',
    'simple-icons:redis', 'simple-icons:nodedotjs', 'simple-icons:typescript', 
    'simple-icons:javascript', 'simple-icons:angular', 'simple-icons:react',
    'simple-icons:vuedotjs', 'simple-icons:dotnet', 'simple-icons:csharp', 
    'simple-icons:aspdotnetcore', 'simple-icons:entityframework',
    'simple-icons:amazonaws', 'simple-icons:microsoftazure', 'simple-icons:googlecloud', 
    'simple-icons:kubernetes', 'simple-icons:nginx', 'simple-icons:apache',
    'simple-icons:html5', 'simple-icons:css3', 'simple-icons:sass', 
    'simple-icons:tailwindcss', 'simple-icons:bootstrap', 'simple-icons:materialdesign',
    'simple-icons:figma', 'simple-icons:adobexd', 'simple-icons:adobephotoshop', 
    'simple-icons:adobeillustrator',
    // Logos (renkli alternatifler)
    'logos:react', 'logos:vue', 'logos:angular-icon', 'logos:nodejs-icon',
    'logos:typescript-icon', 'logos:javascript', 'logos:docker-icon',
    'logos:aws', 'logos:azure', 'logos:google-cloud', 'logos:kubernetes',
    // Devicon (geliştirici icon'ları)
    'devicon:angular', 'devicon:react', 'devicon:vuejs', 'devicon:nodejs',
    'devicon:typescript', 'devicon:javascript', 'devicon:docker',
    'devicon:postgresql', 'devicon:mysql', 'devicon:mongodb',
    // Skill Icons (renkli skill icon'ları)
    'skill-icons:typescript', 'skill-icons:javascript', 'skill-icons:react-dark',
    'skill-icons:vuejs-dark', 'skill-icons:angular-dark', 'skill-icons:nodejs-dark'
  ];

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSkills();
    this.loadAvailableIcons();
  }

  initializeForm(): void {
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', [Validators.required]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      icon: [''],
      displayOrder: [0]
    });
  }

  loadSkills(): void {
    this.loading.set(true);
    this.error.set(null);

    this.skillService.getSkills().subscribe({
      next: (data) => {
        this.skills.set(data.sort((a, b) => a.category.localeCompare(b.category) || a.displayOrder - b.displayOrder));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  async loadAvailableIcons(): Promise<void> {
    // Iconify kullanıyoruz, bu yüzden icon'lar dinamik olarak yüklenir
    // Yaygın icon'ları ve farklı icon setlerinden örnekleri göster
    // Iconify API'den icon listesi çekmek yerine, yaygın icon'ları kullanıyoruz
    this.availableIcons.set(this.commonIcons);
  }

  getFilteredIcons(): string[] {
    const search = this.iconSearchTerm().toLowerCase();
    if (!search) {
      // İlk 100 icon'u göster
      return this.availableIcons().slice(0, 100);
    }
    // Arama yaparken icon adını veya icon set adını kontrol et
    return this.availableIcons().filter(icon => {
      const iconLower = icon.toLowerCase();
      // Icon formatı: "iconSet:iconName" veya sadece "iconName"
      return iconLower.includes(search) || iconLower.split(':')[1]?.includes(search);
    }).slice(0, 100);
  }

  openForm(skill?: Skill): void {
    if (skill) {
      this.editingSkill.set(skill);
      this.skillForm.patchValue({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon || '',
        displayOrder: skill.displayOrder
      });
    } else {
      this.editingSkill.set(null);
      this.skillForm.reset({
        name: '',
        category: '',
        level: 1,
        icon: '',
        displayOrder: 0
      });
    }
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingSkill.set(null);
    this.skillForm.reset();
  }

  toggleIconPicker(): void {
    this.showIconPicker.set(!this.showIconPicker());
  }

  selectIcon(iconName: string): void {
    this.skillForm.patchValue({ icon: iconName });
    this.showIconPicker.set(false);
    this.iconSearchTerm.set('');
  }

  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    const skillData = this.skillForm.value;

    if (this.editingSkill()) {
      this.updateSkill(skillData);
    } else {
      this.createSkill(skillData);
    }
  }

  createSkill(dto: CreateSkillDto): void {
    this.loading.set(true);
    this.error.set(null);

    this.skillService.createSkill(dto).subscribe({
      next: () => {
        this.loadSkills();
        this.closeForm();
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  updateSkill(dto: UpdateSkillDto): void {
    const skillId = this.editingSkill()!.id;
    this.loading.set(true);
    this.error.set(null);

    this.skillService.updateSkill(skillId, dto).subscribe({
      next: () => {
        this.loadSkills();
        this.closeForm();
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  deleteSkill(skill: Skill): void {
    if (!confirm(`"${skill.name}" yeteneğini silmek istediğinize emin misiniz?`)) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.skillService.deleteSkill(skill.id).subscribe({
      next: () => {
        this.loadSkills();
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  getCategories(): string[] {
    const categories = new Set(this.skills().map(s => s.category));
    return Array.from(categories).sort();
  }

  getIconDisplayName(icon: string): string {
    // Icon formatı: "iconSet:iconName" veya sadece "iconName"
    const parts = icon.split(':');
    if (parts.length > 1) {
      return parts[1]; // Sadece icon adını göster
    }
    return icon;
  }
}
