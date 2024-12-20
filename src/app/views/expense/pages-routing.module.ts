import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';
import { ProductInventoryComponent } from './product-inventory/product-inventory.component';



const routes: Routes = [
    {
        path: 'expense',
        component: ExpenseComponent
    },
    {
        path: 'product-inventory',
        component: ProductInventoryComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
