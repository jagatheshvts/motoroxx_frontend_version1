import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReceiptComponent } from './receipt/receipt.component';
import { AppImgCropperComponent } from './img-cropper/img-cropper.component';
// import { ImageCropperModule } from 'ngx-img-cropper';
import { WizardComponent } from './wizard/wizard.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
// import { TextMaskModule } from 'angular2-text-mask';
import { InputMaskComponent } from './input-mask/input-mask.component';
import { InputGroupsComponent } from './input-groups/input-groups.component';
import { PaymentsComponent } from './payments/payments.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  // Required for date parsing
import { MatDatepicker } from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    NgbModule,
    // ImageCropperModule,
    // TextMaskModule,
    NgxMaskDirective, 
    NgxMaskPipe,
    FormWizardModule,
    FormsRoutingModule,

    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepicker,
    OverlayModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule
  ],
  providers: [provideNgxMask()],
  declarations: [ReceiptComponent, AppImgCropperComponent, WizardComponent, InputMaskComponent, InputGroupsComponent, PaymentsComponent]
})
export class AppFormsModule { }
