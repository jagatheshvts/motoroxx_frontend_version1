import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { AdminLayoutSidebarCompactComponent } from './shared/components/layouts/admin-layout-sidebar-compact/admin-layout-sidebar-compact.component';

const adminRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'uikits',
    loadChildren: () => import('./views/ui-kits/ui-kits.module').then(m => m.UiKitsModule)
  },

  {
    path: 'superadmin',
    loadChildren: () => import('./views/superadmin/superadmin.module').then(m => m.SuperadminModule)
  },
  {
    path: 'transaction',
    loadChildren: () => import('./views/transaction/forms.module').then(m => m.AppFormsModule)
  },
  {
    path: 'Business',
    loadChildren: () => import('./views/invoice/invoice.module').then(m => m.InvoiceModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./views/inbox/inbox.module').then(m => m.InboxModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./views/calendar/calendar.module').then(m => m.CalendarAppModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./views/chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./views/contacts/contacts.module').then(m => m.ContactsModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('./views/masters/data-tables.module').then(m => m.DataTablesModule)
  },
  {
    path: 'expense',
    loadChildren: () => import('./views/expense/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'icons',
    loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
  }
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/v1',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule)
      }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'others',
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule)
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarCompactComponent,
    canActivate: [AuthGaurd],
    children: adminRoutes
  },
  {
    path: '**',
    redirectTo: 'others/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
