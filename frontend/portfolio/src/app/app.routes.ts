import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/projects/project-detail.component').then(m => m.ProjectDetailComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/blog/blog.component').then(m => m.BlogComponent)
      },
      {
        path: 'blog/:slug',
        loadComponent: () => import('./features/blog/blog-post.component').then(m => m.BlogPostComponent)
      },
      {
        path: 'experience',
        loadComponent: () => import('./features/experience/experience.component').then(m => m.ExperienceComponent)
      },
      {
        path: 'education',
        loadComponent: () => import('./features/education/education.component').then(m => m.EducationComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./features/skills/skills.component').then(m => m.SkillsComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
