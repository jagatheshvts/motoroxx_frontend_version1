import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpareComponent } from './Spare/spare.component';
import { CardsComponent } from './cards/cards.component';
import { AllTechComponent } from './All-Tech/all-tech.component';
import { EstComponent } from './Est/est.component';
import { GstComponent } from './Gst/gst.component';
import { ViComponent } from './VI/vi.component';
import { BatteryComponent } from './Battery/battery.component';
import { InvComponent } from './Inv/inv.component';
import { TechComponent } from './Tech/tech.component';
import { LoadersComponent } from './loaders/loaders.component';
import { ButtonsLoadingComponent } from './buttons-loading/buttons-loading.component';
import { ChatscreenComponent } from './Chatscreen/chatscreen.component';
import { RatingComponent } from './rating/rating.component';
import { ClosedjobcardsComponent } from './closedjobcards/closedjobcards.component';
import { HsnReportComponent } from './hsn-report/hsn-report.component';
import { HSNSearchComponent } from './hsn-search/hsn-search.component';

const routes: Routes = [
  {
    path: 'VI',
    component: ViComponent
  },
  {
    path: 'Est',
    component: EstComponent
  },
  {
    path: 'Inv',
    component: InvComponent
  },
  {
    path: 'Closed',
    component: ClosedjobcardsComponent
  },
  {
    path: 'Spare',
    component: SpareComponent
  },
  {
    path: 'buttons-loading',
    component: ButtonsLoadingComponent
  },
  {
    path: 'cards',
    component: CardsComponent
  },
  {
    path: 'Tech',
    component: TechComponent
  },
  {
    path: 'All-Tech',
    component: AllTechComponent
  },
  {
    path: 'Battery',
    component: BatteryComponent
  },
  {
    path: 'Gst',
    component: GstComponent
  },
  {
    path: 'loaders',
    component: LoadersComponent
  },
  {
    path: 'Chatscreen',
    component: ChatscreenComponent
  },
  {
    path: 'rating',
    component: RatingComponent
  },
  {
    path: 'HSN-Report',
    component: HsnReportComponent
  },
  {
    path: 'hsn',
    component: HSNSearchComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiKitsRoutingModule { }
