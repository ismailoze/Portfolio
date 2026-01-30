import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost, UpdateBlogPostDto } from '../../../core/models/api.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './blog-management.component.html',
  styleUrl: './blog-management.component.scss'
})
export class BlogManagementComponent implements OnInit {
  private blogService = inject(BlogService);
  private fb = inject(FormBuilder);

  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingPost = signal<BlogPost | null>(null);
  submitting = signal(false);
  activeLanguage = signal<'tr' | 'en'>('tr');
  blogForm!: FormGroup;

  ngOnInit(): void {
    this.loadPosts();
    this.initializeForm();
  }

  initializeForm(): void {
    this.blogForm = this.fb.group({
      trTitle: ['', [Validators.required, Validators.maxLength(200)]],
      trContent: ['', [Validators.required]],
      trExcerpt: ['', [Validators.required, Validators.maxLength(500)]],
      trSlug: ['', [Validators.required, Validators.maxLength(200)]],
      enTitle: ['', [Validators.required, Validators.maxLength(200)]],
      enContent: ['', [Validators.required]],
      enExcerpt: ['', [Validators.required, Validators.maxLength(500)]],
      enSlug: ['', [Validators.required, Validators.maxLength(200)]],
      publishedAt: [null as string | null],
      isPublished: [false],
      featuredImageUrl: ['']
    });
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

  editPost(post: BlogPost): void {
    this.blogService.getPostById(post.id).subscribe({
      next: (fullPost) => {
        const tr = fullPost.translations?.find(t => t.languageCode === 'tr');
        const en = fullPost.translations?.find(t => t.languageCode === 'en');
        this.blogForm.patchValue({
          trTitle: tr?.title ?? '',
          trContent: tr?.content ?? '',
          trExcerpt: tr?.excerpt ?? '',
          trSlug: tr?.slug ?? '',
          enTitle: en?.title ?? '',
          enContent: en?.content ?? '',
          enExcerpt: en?.excerpt ?? '',
          enSlug: en?.slug ?? '',
          publishedAt: fullPost.publishedAt ? fullPost.publishedAt.split('T')[0] : null,
          isPublished: fullPost.isPublished,
          featuredImageUrl: fullPost.featuredImageUrl ?? ''
        });
        this.editingPost.set(fullPost);
        this.showForm.set(true);
      },
      error: (err) => {
        this.error.set(err.userMessage || 'errors.networkError');
      }
    });
  }

  setActiveLanguage(lang: 'tr' | 'en'): void {
    this.activeLanguage.set(lang);
  }

  onSubmit(): void {
    const trTitle = this.blogForm.get('trTitle');
    const trContent = this.blogForm.get('trContent');
    const trExcerpt = this.blogForm.get('trExcerpt');
    const trSlug = this.blogForm.get('trSlug');
    const enTitle = this.blogForm.get('enTitle');
    const enContent = this.blogForm.get('enContent');
    const enExcerpt = this.blogForm.get('enExcerpt');
    const enSlug = this.blogForm.get('enSlug');
    if (!trTitle?.value || !trContent?.value || !trExcerpt?.value || !trSlug?.value ||
        !enTitle?.value || !enContent?.value || !enExcerpt?.value || !enSlug?.value) {
      this.blogForm.markAllAsTouched();
      return;
    }
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const post = this.editingPost();
    if (!post) return;

    this.submitting.set(true);
    this.error.set(null);
    const v = this.blogForm.value;
    const dto: UpdateBlogPostDto = {
      translations: [
        { languageCode: 'tr', title: v.trTitle, content: v.trContent, excerpt: v.trExcerpt, slug: v.trSlug },
        { languageCode: 'en', title: v.enTitle, content: v.enContent, excerpt: v.enExcerpt, slug: v.enSlug }
      ],
      publishedAt: v.publishedAt ? `${v.publishedAt}T00:00:00` : undefined,
      isPublished: !!v.isPublished,
      featuredImageUrl: v.featuredImageUrl?.trim() || undefined
    };

    this.blogService.updatePost(post.id, dto).subscribe({
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

  onFormClose(): void {
    this.showForm.set(false);
    this.editingPost.set(null);
    this.blogForm.reset({
      trTitle: '',
      trContent: '',
      trExcerpt: '',
      trSlug: '',
      enTitle: '',
      enContent: '',
      enExcerpt: '',
      enSlug: '',
      publishedAt: null,
      isPublished: false,
      featuredImageUrl: ''
    });
    this.error.set(null);
    this.loadPosts();
  }

  getFieldError(fieldName: string): string {
    const field = this.blogForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';
    if (field.errors['required']) return 'validation.required';
    if (field.errors['maxlength']) return 'validation.maxLength';
    return '';
  }

  getPostTitle(post: BlogPost): string {
    const tr = post.translations?.find(t => t.languageCode === 'tr');
    return tr?.title ?? post.title ?? 'Untitled';
  }

  deletePost(post: BlogPost, event?: Event): void {
    if (event) event.stopPropagation();
    const title = this.getPostTitle(post);
    if (!confirm(`"${title}" yazısını silmek istediğinize emin misiniz?`)) return;
    this.blogService.deletePost(post.id).subscribe({
      next: () => this.loadPosts(),
      error: (err) => this.error.set(err.userMessage || 'errors.networkError')
    });
  }
}
