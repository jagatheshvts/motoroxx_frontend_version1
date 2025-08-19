import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DecimalPipe, AsyncPipe } from '@angular/common';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from '../../shared/directives/sortable.directive';

import { DataTablesRoutingModule } from './data-tables-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SupplierComponent } from './supplier/supplier.component';
import { BootstrapTableComponent } from './bootstrap-table/bootstrap-table.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  // Required for date parsing
import { MatDatepicker } from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';

import { MatPaginatorModule } from '@angular/material/paginator';  // Import MatPaginatorModule
import { MatIconModule } from '@angular/material/icon';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbModule,
    DecimalPipe,
    FormsModule, 
    AsyncPipe, 
    NgbHighlight, 
    NgbdSortableHeader, 
    NgbPaginationModule,
    DataTablesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepicker,
    OverlayModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule
  ],
  declarations: [SupplierComponent, BootstrapTableComponent]
})
export class DataTablesModule { }
