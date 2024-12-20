import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierComponent } from './supplier/supplier.component';
import { BootstrapTableComponent } from './bootstrap-table/bootstrap-table.component';

const routes: Routes = [
  {
    path: 'supplier',
    component: SupplierComponent
  },
  {
    path: 'bootstrap-table',
    component: BootstrapTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataTablesRoutingModule { }
