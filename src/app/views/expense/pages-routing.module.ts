import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';



const routes: Routes = [
    {
        path: 'expense',
        component: ExpenseComponent
    },
    {
        path: 'product-inventory',
        component: ProductInventoryComponent
    },
    {
        path: 'inventory-report',
        component: InventoryReportComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
