import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstinvComponent } from './Estimate-Invoice/est-inv.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { JobcardComponent } from './jobcard/jobcard.component';
import { JobcardPrintComponent } from './jobcard-print/jobcard-print.component';
import { AuthGaurd } from 'src/app/shared/services/auth.gaurd';


const routes: Routes = [
    {
        path: '',
        component: EstinvComponent,
        canDeactivate: [AuthGaurd]
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
        component: JobcardComponent,
        canDeactivate: [AuthGaurd]

    },
    {
        path: 'jobcardprint',
        component: JobcardPrintComponent

    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
