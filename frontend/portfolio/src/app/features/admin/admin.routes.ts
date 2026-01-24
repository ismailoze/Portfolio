import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./projects-management/projects-management.component').then(m => m.ProjectsManagementComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('./blog-management/blog-management.component').then(m => m.BlogManagementComponent)
      },
      {
        path: 'messages',
        loadComponent: () => import('./messages/messages.component').then(m => m.MessagesComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./skills-management/skills-management.component').then(m => m.SkillsManagementComponent)
      },
      {
        path: 'education',
        loadComponent: () => import('./education-management/education-management.component').then(m => m.EducationManagementComponent)
      },
      {
        path: 'experience',
        loadComponent: () => import('./experience-management/experience-management.component').then(m => m.ExperienceManagementComponent)
      }
    ]
  }
];
