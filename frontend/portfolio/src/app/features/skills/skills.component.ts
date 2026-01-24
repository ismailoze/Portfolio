import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SkillService } from '../../core/services/skill.service';
import { Skill } from '../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';
import { SkillIconComponent } from '../../shared/components/skill-icon/skill-icon.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent, ScrollAnimationDirective, SkillIconComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit {
  private skillService = inject(SkillService);

  skills = signal<Skill[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);

  categories = computed(() => {
    const cats = new Set(this.skills().map(s => s.category));
    return Array.from(cats).sort();
  });

  filteredSkills = computed(() => {
    const category = this.selectedCategory();
    if (!category) return this.skills();
    return this.skills().filter(s => s.category === category);
  });

  skillsByCategory = computed(() => {
    const category = this.selectedCategory();
    if (category) {
      return { [category]: this.filteredSkills() };
    }
    
    const grouped: Record<string, Skill[]> = {};
    this.skills().forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    return grouped;
  });

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading.set(true);
    this.error.set(null);

    this.skillService.getSkills().subscribe({
      next: (data) => {
        this.skills.set(data.sort((a, b) => b.displayOrder - a.displayOrder));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  selectCategory(category: string | null): void {
    this.selectedCategory.set(category);
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.skillsByCategory());
  }

  /**
   * Level'i 10 üzerinden göster (1-100 arası level'i 1-10'a çevir)
   */
  getLevelOutOfTen(level: number): number {
    // Level 1-100 arası, 10 üzerinden göstermek için 10'a böl ve yuvarla
    return Math.round(level / 10);
  }
}
