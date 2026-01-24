import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BlogService } from '../../core/services/blog.service';
import { BlogPost } from '../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { marked } from 'marked';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss'
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  post = signal<BlogPost | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  htmlContent = signal('');

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadPost(slug);
    }
  }

  loadPost(slug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.blogService.getPostBySlug(slug).subscribe({
      next: (data) => {
        this.post.set(data);
        // Markdown'ı HTML'e çevir - translation'dan content al
        const content = this.getPostContent(data);
        if (content) {
          const html = marked.parse(content);
          this.htmlContent.set(typeof html === 'string' ? html : '');
        } else {
          this.htmlContent.set('');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
        this.loading.set(false);
      }
    });
  }

  getPostContent(post: BlogPost): string {
    // Önce translation'dan al, yoksa eski content'ten
    const trTranslation = post.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.content || post.content || '';
  }

  getPostTitle(post: BlogPost): string {
    // Önce translation'dan al, yoksa eski title'dan
    const trTranslation = post.translations?.find(t => t.languageCode === 'tr');
    return trTranslation?.title || post.title || '';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
