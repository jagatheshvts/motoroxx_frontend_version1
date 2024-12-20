import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllTechComponent } from './all-tech.component';

describe('AllTechComponent', () => {
  let component: AllTechComponent;
  let fixture: ComponentFixture<AllTechComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTechComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
