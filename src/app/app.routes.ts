import { Routes } from '@angular/router';
import { PageWelcomeComponent } from './page-welcome/page-welcome.component';

export const routes: Routes = [
  // preload only the first page so the initial file size is small
  {
    path: '',
    title: 'Home Page', // TODO add title page translation resolver
    component: PageWelcomeComponent
  },
  // lazy load all other pages
  {
    path: 'form/:tab',
    title: 'Form Page',
    loadComponent: () =>
      import('./page-form/page-form.component')
        .then(m => m.PageFormComponent)
  },
  {
    path: 'form',
    redirectTo: '/form/tab1',
  },
];
