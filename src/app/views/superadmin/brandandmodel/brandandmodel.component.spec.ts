import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandandmodelComponent } from './brandandmodel.component';

describe('BrandandmodelComponent', () => {
  let component: BrandandmodelComponent;
  let fixture: ComponentFixture<BrandandmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandandmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandandmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
