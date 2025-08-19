import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  // Required for date parsing
import { MatDatepicker } from '@angular/material/datepicker';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import { CompanymasterComponent } from './companymaster/companymaster.component';
import { superadminRoutingModule } from './superadmin-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
// import { FormsRoutingModule } from './forms-routing.module';
import { FormWizardModule } from 'src/app/shared/components/form-wizard/form-wizard.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrModule } from 'ngx-toastr';
import { BrandandmodelComponent } from './brandandmodel/brandandmodel.component';
import { CompanycreationComponent } from './companycreation/companycreation.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TemplatesComponent } from './templates/templates.component';
import { MessageAlertsTemplatesComponent } from './message-alerts-templates/message-alerts-templates.component';







@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDatepicker,
    OverlayModule,
    ReactiveFormsModule,
    MatSelectModule,
    superadminRoutingModule,
    MatExpansionModule,
    MatTabsModule,
    FormWizardModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    ToastrModule,


    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,

    // FormsRoutingModule




  ],
  declarations: [
    CompanymasterComponent,
    BrandandmodelComponent,
    CompanycreationComponent,
    TemplatesComponent,
    MessageAlertsTemplatesComponent

    
  ]
})
export class SuperadminModule { }
