import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboadDefaultComponent } from './dashboad-default/dashboad-default.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { DashboardV2Component } from './dashboard-v2/dashboard-v2.component';
import { DashboardV3Component } from './dashboard-v3/dashboard-v3.component';
import { DashboardV4Component } from './dashboard-v4/dashboard-v4.component';
import { ClientDetailsDashboardComponent } from './client-details-dashboard/client-details-dashboard.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  // Required for date parsing
import { FormsModule } from '@angular/forms';  // Required for ngModel
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepicker } from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    NgbModule,
    NgScrollbarModule,
    DashboardRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    // BrowserAnimationsModule,
    MatDatepicker,
    OverlayModule
  ],
  declarations: [DashboadDefaultComponent, DashboardV2Component, DashboardV3Component, DashboardV4Component, ClientDetailsDashboardComponent]
})
export class DashboardModule { }
