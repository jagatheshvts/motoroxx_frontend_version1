import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnSearchComponent } from './hsn-search.component';

describe('HsnSearchComponent', () => {
  let component: HsnSearchComponent;
  let fixture: ComponentFixture<HsnSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HsnSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
