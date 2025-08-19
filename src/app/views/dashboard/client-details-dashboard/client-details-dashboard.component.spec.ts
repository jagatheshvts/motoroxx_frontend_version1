import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDetailsDashboardComponent } from './client-details-dashboard.component';

describe('ClientDetailsDashboardComponent', () => {
  let component: ClientDetailsDashboardComponent;
  let fixture: ComponentFixture<ClientDetailsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDetailsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
