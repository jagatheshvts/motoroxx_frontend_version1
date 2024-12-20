import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UiKitsRoutingModule } from './ui-kits-routing.module';
import { SpareComponent } from './Spare/spare.component';
import { CardsComponent } from './cards/cards.component';
import { AllTechComponent } from './All-Tech/all-tech.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EstComponent } from './Est/est.component';
import { GstComponent } from './Gst/gst.component';
import { ViComponent } from './VI/vi.component';
import { ToastrModule } from 'ngx-toastr';
import { BatteryComponent } from './Battery/battery.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { InvComponent } from './Inv/inv.component';
import { TechComponent } from './Tech/tech.component';
import { LoadersComponent } from './loaders/loaders.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { ButtonsLoadingComponent } from './buttons-loading/buttons-loading.component';
import { ChatscreenComponent } from './Chatscreen/chatscreen.component';
import { RatingComponent } from './rating/rating.component';
 


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  // Required for date parsing
import { MatDatepicker } from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ToastrModule,
    NgbModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    SharedComponentsModule,
    SharedDirectivesModule,
    UiKitsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepicker,
    OverlayModule,
    ReactiveFormsModule,
    MatSelectModule


  ],
  declarations: [
    SpareComponent,
    CardsComponent,
    AllTechComponent,
    EstComponent,
    GstComponent,
    ViComponent,
    BatteryComponent,
    InvComponent,
    TechComponent,
    LoadersComponent,
    ButtonsLoadingComponent,
    ChatscreenComponent,
    RatingComponent
  ]
})
export class UiKitsModule { }
