import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost } from '../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { ScrollAnimationDirective } from '../../shared/directives/scroll-animation.directive';
import { LazyImageDirective } from '../../shared/directives/lazy-image.directive';

@Component({
  selector: 'app-blog',
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
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.blogService.getPublishedPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  get filteredPosts(): BlogPost[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.posts();

    return this.posts().filter(post => {
      const title = this.getPostTitle(post).toLowerCase();
      const excerpt = this.getPostExcerpt(post).toLowerCase();
      return title.includes(term) || excerpt.includes(term);
    });
  }

  getPostTitle(post: BlogPost): string {
    // Önce translation'dan al, yoksa eski title'dan
    const trTranslation = post.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.title || post.title || '';
  }

  getPostExcerpt(post: BlogPost): string {
    // Önce translation'dan al, yoksa eski excerpt'ten
    const trTranslation = post.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.excerpt || post.excerpt || '';
  }

  getPostSlug(post: BlogPost): string {
    // Önce translation'dan al, yoksa eski slug'dan
    const trTranslation = post.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.slug || post.slug || '';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
