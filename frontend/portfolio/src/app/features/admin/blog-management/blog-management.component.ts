import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost } from '../../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './blog-management.component.html',
  styleUrl: './blog-management.component.scss'
})
export class BlogManagementComponent implements OnInit {
  private blogService = inject(BlogService);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.blogService.getAllPosts().subscribe({
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

  deletePost(id: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          this.loadPosts();
        },
        error: (err) => {
          this.error.set(err.userMessage || 'errors.networkError');
        }
      });
    }
  }
}
