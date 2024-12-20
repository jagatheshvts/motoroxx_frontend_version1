import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViComponent } from './vi.component';

describe('ViComponent', () => {
  let component: ViComponent;
  let fixture: ComponentFixture<ViComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
