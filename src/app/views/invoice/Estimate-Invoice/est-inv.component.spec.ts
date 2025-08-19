import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstinvComponent } from './est-inv.component';

describe('EstinvComponent', () => {
  let component: EstinvComponent;
  let fixture: ComponentFixture<EstinvComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstinvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstinvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
