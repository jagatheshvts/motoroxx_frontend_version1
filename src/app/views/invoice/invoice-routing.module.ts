import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstinvComponent } from './Estimate-Invoice/est-inv.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { JobcardComponent } from './jobcard/jobcard.component';

const routes: Routes = [
    {
        path: '',
        component: EstinvComponent
    },
    {
        path: 'new',
        component: InvoiceDetailComponent
    },
    {
        path: 'edit/:id',
        component: InvoiceDetailComponent
    },
    {
        path: 'jobcard',
        component: JobcardComponent

    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
