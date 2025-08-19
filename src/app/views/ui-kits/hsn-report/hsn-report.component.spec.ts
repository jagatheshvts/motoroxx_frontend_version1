import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnReportComponent } from './hsn-report.component';

describe('HsnReportComponent', () => {
  let component: HsnReportComponent;
  let fixture: ComponentFixture<HsnReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HsnReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
