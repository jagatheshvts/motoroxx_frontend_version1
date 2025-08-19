import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {  EstComponent} from './Est.component';

describe('EstComponent', () => {
  let component: EstComponent;
  let fixture: ComponentFixture<EstComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
