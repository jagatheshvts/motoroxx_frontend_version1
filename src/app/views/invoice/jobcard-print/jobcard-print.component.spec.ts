import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardPrintComponent } from './jobcard-print.component';

describe('JobcardPrintComponent', () => {
  let component: JobcardPrintComponent;
  let fixture: ComponentFixture<JobcardPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobcardPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobcardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
